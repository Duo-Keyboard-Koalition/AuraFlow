#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <chrono>
#include <ctime>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <mutex>
#include <optional>
#include <random>
#include <regex>
#include <sstream>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

namespace {

struct AgentRecord {
  std::string agent_id;
  std::string agent_name;
  std::string agent_type;
  std::string public_key_pem;
  std::string public_key_fingerprint;
  std::string created_at;
};

struct ChallengeRecord {
  std::string challenge_id;
  std::string agent_id;
  std::string challenge;
  std::chrono::system_clock::time_point expires_at;
};

struct RefreshRecord {
  std::string refresh_token;
  std::string agent_id;
  std::chrono::system_clock::time_point expires_at;
};

std::unordered_map<std::string, AgentRecord> g_agents;
std::unordered_map<std::string, ChallengeRecord> g_challenges;
std::unordered_map<std::string, RefreshRecord> g_refresh_tokens;
std::mutex g_mu;

const std::string kInboundLog = "/tmp/auraflow-bridge-inbound.log";

int env_int(const char *name, int fallback) {
  const char *v = std::getenv(name);
  if (!v || std::string(v).empty()) return fallback;
  try {
    return std::stoi(v);
  } catch (...) {
    return fallback;
  }
}

std::string now_iso8601() {
  auto now = std::chrono::system_clock::now();
  std::time_t t = std::chrono::system_clock::to_time_t(now);
  std::tm tm = *std::gmtime(&t);
  std::ostringstream oss;
  oss << std::put_time(&tm, "%Y-%m-%dT%H:%M:%SZ");
  return oss.str();
}

std::string json_escape(const std::string &s) {
  std::string out;
  out.reserve(s.size());
  for (char c : s) {
    switch (c) {
      case '"': out += "\\\""; break;
      case '\\': out += "\\\\"; break;
      case '\n': out += "\\n"; break;
      case '\r': out += "\\r"; break;
      case '\t': out += "\\t"; break;
      default: out += c; break;
    }
  }
  return out;
}

std::string random_hex(size_t bytes_len) {
  static std::mt19937_64 rng(std::random_device{}());
  std::uniform_int_distribution<int> dist(0, 255);
  std::ostringstream oss;
  for (size_t i = 0; i < bytes_len; ++i) {
    int b = dist(rng);
    oss << std::hex << std::setw(2) << std::setfill('0') << b;
  }
  return oss.str();
}

std::string pseudo_fingerprint(const std::string &pem) {
  std::hash<std::string> h;
  auto v = h(pem);
  std::ostringstream oss;
  oss << std::hex << v;
  return oss.str();
}

std::string route_key_from_origin_obj(const std::string &origin_obj) {
  auto find = [&](const std::string &key) {
    std::regex re("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
    std::smatch m;
    if (std::regex_search(origin_obj, m, re)) return m[1].str();
    return std::string("");
  };

  std::string workspace = find("workspaceId");
  std::string server = find("serverId");
  std::string channel = find("channelId");
  std::string thread = find("threadId");
  std::string user = find("userId");
  if (thread.empty()) thread = "default";
  return workspace + ":" + server + ":" + channel + ":" + thread + ":" + user;
}

std::optional<std::string> find_json_string(const std::string &json, const std::string &key) {
  std::regex re("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
  std::smatch m;
  if (std::regex_search(json, m, re)) return m[1].str();
  return std::nullopt;
}

std::optional<std::string> find_json_object(const std::string &json, const std::string &key) {
  std::string needle = "\"" + key + "\"";
  size_t pos = json.find(needle);
  if (pos == std::string::npos) return std::nullopt;
  pos = json.find(':', pos);
  if (pos == std::string::npos) return std::nullopt;
  pos = json.find('{', pos);
  if (pos == std::string::npos) return std::nullopt;

  int depth = 0;
  size_t start = pos;
  for (size_t i = pos; i < json.size(); ++i) {
    if (json[i] == '{') depth++;
    if (json[i] == '}') {
      depth--;
      if (depth == 0) {
        return json.substr(start, i - start + 1);
      }
    }
  }
  return std::nullopt;
}

void append_inbound_log(const std::string &raw_json) {
  std::ofstream out(kInboundLog, std::ios::app);
  out << now_iso8601() << " " << raw_json << "\n";
}

std::string make_response(int code, const std::string &status, const std::string &body) {
  std::ostringstream oss;
  oss << "HTTP/1.1 " << code << " " << status << "\r\n"
      << "Content-Type: application/json\r\n"
      << "Content-Length: " << body.size() << "\r\n"
      << "Connection: close\r\n\r\n"
      << body;
  return oss.str();
}

void send_json(int fd, int code, const std::string &status, const std::string &json) {
  std::string resp = make_response(code, status, json);
  (void)send(fd, resp.data(), resp.size(), 0);
}

struct HttpRequest {
  std::string method;
  std::string path;
  std::string body;
};

std::optional<HttpRequest> read_request(int fd) {
  std::string buf;
  char tmp[4096];
  while (buf.find("\r\n\r\n") == std::string::npos) {
    ssize_t n = recv(fd, tmp, sizeof(tmp), 0);
    if (n <= 0) return std::nullopt;
    buf.append(tmp, n);
    if (buf.size() > 2 * 1024 * 1024) return std::nullopt;
  }

  size_t header_end = buf.find("\r\n\r\n");
  std::string headers = buf.substr(0, header_end);
  std::string body = buf.substr(header_end + 4);

  std::istringstream hss(headers);
  std::string request_line;
  std::getline(hss, request_line);
  if (!request_line.empty() && request_line.back() == '\r') request_line.pop_back();

  std::istringstream rl(request_line);
  HttpRequest req;
  rl >> req.method >> req.path;
  if (req.method.empty() || req.path.empty()) return std::nullopt;

  int content_length = 0;
  std::string line;
  while (std::getline(hss, line)) {
    if (!line.empty() && line.back() == '\r') line.pop_back();
    auto lower = line;
    for (char &c : lower) c = static_cast<char>(std::tolower(c));
    if (lower.rfind("content-length:", 0) == 0) {
      try {
        content_length = std::stoi(line.substr(15));
      } catch (...) {
        content_length = 0;
      }
    }
  }

  while (static_cast<int>(body.size()) < content_length) {
    ssize_t n = recv(fd, tmp, sizeof(tmp), 0);
    if (n <= 0) break;
    body.append(tmp, n);
  }
  if (content_length > 0 && static_cast<int>(body.size()) > content_length) {
    body.resize(content_length);
  }

  req.body = body;
  return req;
}

void handle_health(int fd, int port) {
  send_json(fd, 200, "OK",
            "{\"ok\":true,\"service\":\"auraflow-bridge-cpp\",\"port\":" +
                std::to_string(port) + "}");
}

void handle_register(int fd, const std::string &body) {
  auto name = find_json_string(body, "agentName");
  auto type = find_json_string(body, "agentType");
  auto pem = find_json_string(body, "publicKeyPem");

  if (!name || !type || !pem || name->empty() || type->empty() || pem->empty()) {
    send_json(fd, 400, "Bad Request",
              "{\"error\":\"agentName, agentType, and publicKeyPem are required\"}");
    return;
  }

  AgentRecord rec;
  rec.agent_id = random_hex(16);
  rec.agent_name = *name;
  rec.agent_type = *type;
  rec.public_key_pem = *pem;
  rec.public_key_fingerprint = pseudo_fingerprint(*pem);
  rec.created_at = now_iso8601();

  {
    std::lock_guard<std::mutex> lk(g_mu);
    g_agents[rec.agent_id] = rec;
  }

  send_json(fd, 201, "Created",
            "{\"agentId\":\"" + json_escape(rec.agent_id) +
                "\",\"agentName\":\"" + json_escape(rec.agent_name) +
                "\",\"agentType\":\"" + json_escape(rec.agent_type) +
                "\",\"publicKeyFingerprint\":\"" +
                json_escape(rec.public_key_fingerprint) + "\"}");
}

void handle_login_challenge(int fd, const std::string &body) {
  auto agent_id = find_json_string(body, "agentId");
  if (!agent_id || agent_id->empty()) {
    send_json(fd, 404, "Not Found", "{\"error\":\"agent not found\"}");
    return;
  }

  {
    std::lock_guard<std::mutex> lk(g_mu);
    if (g_agents.find(*agent_id) == g_agents.end()) {
      send_json(fd, 404, "Not Found", "{\"error\":\"agent not found\"}");
      return;
    }

    ChallengeRecord c;
    c.challenge_id = random_hex(16);
    c.agent_id = *agent_id;
    c.challenge = random_hex(24);
    c.expires_at = std::chrono::system_clock::now() + std::chrono::seconds(60);
    g_challenges[c.challenge_id] = c;

    auto exp_t = std::chrono::system_clock::to_time_t(c.expires_at);
    std::tm tm = *std::gmtime(&exp_t);
    std::ostringstream exp;
    exp << std::put_time(&tm, "%Y-%m-%dT%H:%M:%SZ");

    send_json(fd, 200, "OK",
              "{\"challengeId\":\"" + c.challenge_id + "\",\"challenge\":\"" +
                  c.challenge + "\",\"expiresAt\":\"" + exp.str() + "\"}");
  }
}

void handle_login_verify(int fd, const std::string &body, int access_ttl, int refresh_ttl) {
  auto agent_id = find_json_string(body, "agentId");
  auto challenge_id = find_json_string(body, "challengeId");
  auto signature = find_json_string(body, "signature");

  if (!agent_id || !challenge_id || !signature) {
    send_json(fd, 400, "Bad Request", "{\"error\":\"invalid login state\"}");
    return;
  }

  std::lock_guard<std::mutex> lk(g_mu);
  auto ai = g_agents.find(*agent_id);
  auto ci = g_challenges.find(*challenge_id);
  if (ai == g_agents.end() || ci == g_challenges.end() || ci->second.agent_id != *agent_id) {
    send_json(fd, 400, "Bad Request", "{\"error\":\"invalid login state\"}");
    return;
  }

  if (ci->second.expires_at < std::chrono::system_clock::now()) {
    g_challenges.erase(ci);
    send_json(fd, 400, "Bad Request", "{\"error\":\"challenge expired\"}");
    return;
  }

  if (signature->empty()) {
    send_json(fd, 401, "Unauthorized", "{\"error\":\"invalid signature\"}");
    return;
  }

  g_challenges.erase(ci);

  std::string access_token = "cpp." + random_hex(12) + "." + random_hex(12);
  std::string refresh_token = random_hex(24);
  RefreshRecord rr{refresh_token, *agent_id,
                   std::chrono::system_clock::now() + std::chrono::seconds(refresh_ttl)};
  g_refresh_tokens[refresh_token] = rr;

  const AgentRecord &a = ai->second;
  send_json(fd, 200, "OK",
            "{\"accessToken\":\"" + access_token + "\",\"refreshToken\":\"" +
                refresh_token + "\",\"expiresInSeconds\":" + std::to_string(access_ttl) +
                ",\"agent\":{\"agentId\":\"" + json_escape(a.agent_id) +
                "\",\"agentName\":\"" + json_escape(a.agent_name) +
                "\",\"agentType\":\"" + json_escape(a.agent_type) +
                "\",\"publicKeyFingerprint\":\"" +
                json_escape(a.public_key_fingerprint) + "\"}}" );
}

void handle_token_refresh(int fd, const std::string &body, int access_ttl, int refresh_ttl) {
  auto rt = find_json_string(body, "refreshToken");
  if (!rt || rt->empty()) {
    send_json(fd, 401, "Unauthorized", "{\"error\":\"invalid refresh token\"}");
    return;
  }

  std::lock_guard<std::mutex> lk(g_mu);
  auto it = g_refresh_tokens.find(*rt);
  if (it == g_refresh_tokens.end() || it->second.expires_at < std::chrono::system_clock::now()) {
    if (it != g_refresh_tokens.end()) g_refresh_tokens.erase(it);
    send_json(fd, 401, "Unauthorized", "{\"error\":\"invalid refresh token\"}");
    return;
  }

  std::string agent_id = it->second.agent_id;
  g_refresh_tokens.erase(it);

  std::string next_rt = random_hex(24);
  g_refresh_tokens[next_rt] = RefreshRecord{next_rt, agent_id,
                                            std::chrono::system_clock::now() +
                                                std::chrono::seconds(refresh_ttl)};

  std::string access_token = "cpp." + random_hex(12) + "." + random_hex(12);
  send_json(fd, 200, "OK",
            "{\"accessToken\":\"" + access_token + "\",\"refreshToken\":\"" +
                next_rt + "\",\"expiresInSeconds\":" + std::to_string(access_ttl) + "}");
}

void handle_agents_list(int fd) {
  std::lock_guard<std::mutex> lk(g_mu);
  std::ostringstream oss;
  oss << "[";
  bool first = true;
  for (const auto &[_, a] : g_agents) {
    if (!first) oss << ",";
    first = false;
    oss << "{\"agentId\":\"" << json_escape(a.agent_id) << "\","
        << "\"agentName\":\"" << json_escape(a.agent_name) << "\","
        << "\"agentType\":\"" << json_escape(a.agent_type) << "\","
        << "\"publicKeyFingerprint\":\"" << json_escape(a.public_key_fingerprint) << "\","
        << "\"createdAt\":\"" << json_escape(a.created_at) << "\"}";
  }
  oss << "]";
  send_json(fd, 200, "OK", oss.str());
}

void handle_inbound(int fd, const std::string &body) {
  auto type = find_json_string(body, "type");
  auto text = find_json_string(body, "text");
  auto origin = find_json_object(body, "origin");
  if (!type || !text || !origin || *type != "user.message" || text->empty()) {
    send_json(fd, 400, "Bad Request", "{\"error\":\"invalid payload\"}");
    return;
  }

  append_inbound_log(body);
  std::string rk = route_key_from_origin_obj(*origin);
  send_json(fd, 202, "Accepted",
            "{\"accepted\":true,\"routeKey\":\"" + json_escape(rk) + "\"}");
}

void handle_outbound(int fd, const std::string &body) {
  auto text = find_json_string(body, "text");
  auto origin = find_json_object(body, "origin");
  if (!text || !origin || text->empty()) {
    send_json(fd, 400, "Bad Request", "{\"error\":\"invalid payload\"}");
    return;
  }

  std::string rk = route_key_from_origin_obj(*origin);
  send_json(fd, 202, "Accepted",
            "{\"accepted\":true,\"routeKey\":\"" + json_escape(rk) + "\"}");
}

void handle_client(int fd, int port, int access_ttl, int refresh_ttl) {
  auto req_opt = read_request(fd);
  if (!req_opt) {
    close(fd);
    return;
  }
  HttpRequest req = *req_opt;

  if (req.method == "GET" && req.path == "/health") {
    handle_health(fd, port);
  } else if (req.method == "POST" && req.path == "/v1/agents/register") {
    handle_register(fd, req.body);
  } else if (req.method == "POST" && req.path == "/v1/agents/login/challenge") {
    handle_login_challenge(fd, req.body);
  } else if (req.method == "POST" && req.path == "/v1/agents/login/verify") {
    handle_login_verify(fd, req.body, access_ttl, refresh_ttl);
  } else if (req.method == "POST" && req.path == "/v1/agents/token/refresh") {
    handle_token_refresh(fd, req.body, access_ttl, refresh_ttl);
  } else if (req.method == "GET" && req.path == "/v1/agents") {
    handle_agents_list(fd);
  } else if (req.method == "POST" && req.path == "/v1/inbound/messages") {
    handle_inbound(fd, req.body);
  } else if (req.method == "POST" && req.path == "/v1/outbound/messages") {
    handle_outbound(fd, req.body);
  } else if (req.method == "GET" && req.path == "/v1/ws") {
    send_json(fd, 501, "Not Implemented",
              "{\"error\":\"websocket not implemented in bridge-cpp minimal build\"}");
  } else {
    send_json(fd, 404, "Not Found", "{\"error\":\"not found\"}");
  }

  close(fd);
}

}  // namespace

int main() {
  int port = env_int("PORT", 8787);
  int access_ttl = env_int("ACCESS_TOKEN_TTL_SECONDS", 900);
  int refresh_ttl = env_int("REFRESH_TOKEN_TTL_SECONDS", 60 * 60 * 24 * 30);

  int server_fd = socket(AF_INET, SOCK_STREAM, 0);
  if (server_fd < 0) {
    std::cerr << "socket failed\n";
    return 1;
  }

  int opt = 1;
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  sockaddr_in addr{};
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = inet_addr("127.0.0.1");
  addr.sin_port = htons(static_cast<uint16_t>(port));

  if (bind(server_fd, reinterpret_cast<sockaddr *>(&addr), sizeof(addr)) < 0) {
    std::cerr << "bind failed\n";
    close(server_fd);
    return 1;
  }

  if (listen(server_fd, 64) < 0) {
    std::cerr << "listen failed\n";
    close(server_fd);
    return 1;
  }

  std::cout << "[auraflow-bridge-cpp] listening on http://127.0.0.1:" << port << "\n";
  std::cout << "[auraflow-bridge-cpp] websocket endpoint unavailable in minimal build\n";
  std::cout << "[auraflow-bridge-cpp] inbound log path: " << kInboundLog << "\n";

  while (true) {
    sockaddr_in client_addr{};
    socklen_t client_len = sizeof(client_addr);
    int client_fd = accept(server_fd, reinterpret_cast<sockaddr *>(&client_addr), &client_len);
    if (client_fd < 0) {
      continue;
    }

    std::thread([client_fd, port, access_ttl, refresh_ttl]() {
      handle_client(client_fd, port, access_ttl, refresh_ttl);
    }).detach();
  }

  close(server_fd);
  return 0;
}
