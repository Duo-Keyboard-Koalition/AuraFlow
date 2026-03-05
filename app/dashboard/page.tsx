"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronLeft, ChevronRight, Hash, Loader2, Send } from "lucide-react"

interface ChatMessage {
  id: string
  author: string
  role: "system" | "user" | "agent"
  content: string
  time: string
}

interface Channel {
  id: string
  name: string
}

interface Server {
  id: string
  name: string
  icon: string
  channels: Channel[]
}

const servers: Server[] = [
  {
    id: "auraflow",
    name: "AuraFlow",
    icon: "AF",
    channels: [
      { id: "general", name: "general" },
      { id: "scorpion", name: "scorpion" },
    ],
  },
]

const wsUrl = process.env.NEXT_PUBLIC_AURAFLOW_BRIDGE_WS_URL || "ws://127.0.0.1:8765"
const wsToken = process.env.NEXT_PUBLIC_AURAFLOW_BRIDGE_TOKEN || ""

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeServerId, setActiveServerId] = useState(servers[0].id)
  const [activeChannelId, setActiveChannelId] = useState(servers[0].channels[0].id)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-init",
      author: "system",
      role: "system",
      content: "Connect auraflow-bridge, then send a message here to test live bot replies.",
      time: nowLabel(),
    },
  ])
  const [connected, setConnected] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const activeServer = useMemo(() => servers.find((s) => s.id === activeServerId) || servers[0], [activeServerId])
  const activeChannel = useMemo(
    () => activeServer.channels.find((c) => c.id === activeChannelId) || activeServer.channels[0],
    [activeServer, activeChannelId],
  )
  const chatId = `${activeServer.id}:${activeChannel.id}:${user?.id || "guest"}`

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      if (wsToken) {
        ws.send(JSON.stringify({ type: "auth", token: wsToken }))
      }
      ws.send(JSON.stringify({ type: "subscribe", chatId }))
      setMessages((prev) => [
        ...prev,
        {
          id: `system-connected-${Date.now()}`,
          author: "system",
          role: "system",
          content: `Connected to auraflow-bridge at ${wsUrl}`,
          time: nowLabel(),
        },
      ])
    }

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === "reply" && payload.chatId === chatId) {
          setMessages((prev) => [
            ...prev,
            {
              id: `agent-${Date.now()}`,
              author: payload.author || "agent",
              role: "agent",
              content: String(payload.content || ""),
              time: nowLabel(),
            },
          ])
        }

        if (payload.type === "error") {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-error-${Date.now()}`,
              author: "system",
              role: "system",
              content: `Bridge error: ${String(payload.error || "unknown")}`,
              time: nowLabel(),
            },
          ])
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `system-parse-${Date.now()}`,
            author: "system",
            role: "system",
            content: "Received non-JSON bridge payload.",
            time: nowLabel(),
          },
        ])
      }
    }

    ws.onclose = () => {
      setConnected(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `system-close-${Date.now()}`,
          author: "system",
          role: "system",
          content: "Bridge disconnected.",
          time: nowLabel(),
        },
      ])
    }

    ws.onerror = () => {
      setConnected(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `system-ws-error-${Date.now()}`,
          author: "system",
          role: "system",
          content: "Failed to connect to auraflow-bridge.",
          time: nowLabel(),
        },
      ])
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [chatId, user])

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    const content = input.trim()
    if (!content) return

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        author: user?.firstName || user?.email?.split("@")[0] || "you",
        role: "user",
        content,
        time: nowLabel(),
      },
    ])

    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-not-open-${Date.now()}`,
          author: "system",
          role: "system",
          content: "Bridge is not connected. Start auraflow-bridge and reconnect.",
          time: nowLabel(),
        },
      ])
      setInput("")
      return
    }

    ws.send(
      JSON.stringify({
        type: "message",
        senderId: user?.id || "guest",
        chatId,
        serverId: activeServer.id,
        channelId: activeChannel.id,
        content,
        requestId: `req-${Date.now()}`,
      }),
    )
    setInput("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen text-white">
      <div className="flex min-h-screen">
        <aside className="w-[72px] bg-black/40 backdrop-blur-sm border-r border-gray-800 flex flex-col items-center py-4 gap-3 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold">AF</div>
          <div className="h-px w-8 bg-white/10" />
          {servers.map((server) => (
            <button
              key={server.id}
              className={`h-12 w-12 rounded-2xl transition-colors text-sm font-semibold ${
                activeServerId === server.id ? "bg-purple-600" : "bg-gray-900 hover:bg-purple-600"
              }`}
              onClick={() => {
                setActiveServerId(server.id)
                setActiveChannelId(server.channels[0].id)
              }}
              title={server.name}
            >
              {server.icon}
            </button>
          ))}
        </aside>

        <aside
          className={`bg-gray-900/80 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 overflow-hidden shrink-0 ${
            sidebarExpanded ? "w-[280px]" : "w-[0px]"
          }`}
        >
          <div className="h-16 border-b border-white/10 px-4 flex items-center justify-between">
            <p className="font-semibold truncate">{activeServer.name}</p>
            <ChevronDown className="h-4 w-4 text-zinc-300" />
          </div>

          <div className="p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">Channels</p>
            <div className="space-y-1">
              {activeServer.channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                    activeChannelId === channel.id ? "bg-purple-600/40 text-white" : "text-zinc-200 hover:bg-gray-800"
                  }`}
                  onClick={() => setActiveChannelId(channel.id)}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-transparent min-w-0 flex flex-col">
          <header className="h-16 px-6 border-b border-gray-800 bg-black/20 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="h-8 w-8 rounded-md bg-gray-900 flex items-center justify-center hover:bg-purple-600 transition-colors"
                onClick={() => setSidebarExpanded((prev) => !prev)}
                aria-label="Toggle channel sidebar"
              >
                {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <Hash className="h-4 w-4 text-zinc-300" />
              <h1 className="text-lg font-semibold truncate">{activeChannel.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-purple-300" : "bg-purple-700"}`} />
              <span className="hidden md:inline text-xs text-zinc-300">{connected ? "bridge online" : "bridge offline"}</span>
              <Button
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-purple-600 hover:text-white"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 rounded-lg bg-gray-900/50 border border-gray-800 p-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-purple-500"
                      : message.role === "agent"
                        ? "bg-purple-600"
                        : "bg-purple-700"
                  }`}
                >
                  {message.role === "user" ? "U" : message.role === "agent" ? "S" : "!"}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{message.author}</span>
                    <span className="text-zinc-400 text-xs">{message.time}</span>
                  </p>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="p-4 md:p-6 pt-0" onSubmit={handleSend}>
            <div className="rounded-lg bg-gray-900/70 border border-gray-700 px-3 py-2 flex items-center gap-2">
              <input
                className="flex-1 bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-400"
                placeholder={`Message #${activeChannel.name}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
