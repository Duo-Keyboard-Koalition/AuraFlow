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
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)

  const healthPollRef = useRef<number | null>(null)
  const activeServer = useMemo(() => servers.find((s) => s.id === activeServerId) || servers[0], [activeServerId])
  const activeChannel = useMemo(
    () => activeServer.channels.find((c) => c.id === activeChannelId) || activeServer.channels[0],
    [activeServer, activeChannelId],
  )

  const origin = useMemo(
    () => ({
      workspaceId: "auraflow",
      serverId: activeServer.id,
      channelId: activeChannel.id,
      threadId: "main",
      userId: user?.id || "guest",
    }),
    [activeChannel.id, activeServer.id, user?.id],
  )
  const routeKey = `${origin.workspaceId}:${origin.serverId}:${origin.channelId}:${origin.threadId}:${origin.userId}`

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const pollBridgeHealth = async () => {
      try {
        const response = await fetch("/api/bridge/health", { cache: "no-store" })
        setConnected(response.ok)
      } catch {
        setConnected(false)
      }
    }

    void pollBridgeHealth()
    healthPollRef.current = window.setInterval(() => {
      void pollBridgeHealth()
    }, 10000)

    return () => {
      if (healthPollRef.current !== null) {
        window.clearInterval(healthPollRef.current)
      }
      healthPollRef.current = null
    }
  }, [user])

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || sending) return

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

    setInput("")
    setSending(true)

    try {
      const response = await fetch("/api/bridge/inbound", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "user.message",
          text: content,
          origin: {
            ...origin,
            messageId: `m-${Date.now()}`,
          },
          target: {
            agentType: activeChannel.id,
            agentId: activeChannel.id,
          },
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(String(body?.error || `HTTP ${response.status}`))
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `system-sent-${Date.now()}`,
          author: "system",
          role: "system",
          content: `Message forwarded to bridge for route ${routeKey}.`,
          time: nowLabel(),
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-send-error-${Date.now()}`,
          author: "system",
          role: "system",
          content: `Failed to send to bridge webhook: ${error instanceof Error ? error.message : "unknown error"}`,
          time: nowLabel(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" style={{ color: "var(--af-blue)" }} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen text-white">
      <div className="flex min-h-screen">
        <aside className="w-[72px] af-navbar backdrop-blur-sm border-r flex flex-col items-center py-4 gap-3 shrink-0">
          <div className="h-12 w-12 rounded-2xl af-server-active flex items-center justify-center text-white font-bold">AF</div>
          <div className="h-px w-8 bg-white/10" />
          {servers.map((server) => (
            <button
              key={server.id}
              className={`h-12 w-12 rounded-2xl transition-colors text-sm font-semibold ${
                activeServerId === server.id ? "af-server-active" : "af-server-idle"
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
          className={`af-panel-soft backdrop-blur-sm border-r transition-all duration-300 overflow-hidden shrink-0 ${
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
                    activeChannelId === channel.id ? "af-row-active" : "af-row-idle"
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
          <header className="h-16 px-6 border-b af-navbar backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="h-8 w-8 rounded-md af-server-idle flex items-center justify-center af-outline-hover transition-colors"
                onClick={() => setSidebarExpanded((prev) => !prev)}
                aria-label="Toggle channel sidebar"
              >
                {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <Hash className="h-4 w-4 text-zinc-300" />
              <h1 className="text-lg font-semibold truncate">{activeChannel.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connected ? "af-dot-online" : "af-dot-offline"}`} />
              <span className="hidden md:inline text-xs text-zinc-300">
                {connected ? "bridge backend online" : "bridge backend offline"}
              </span>
              <Button
                variant="outline"
                className="border-white/30 text-white bg-transparent af-outline-hover"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 rounded-lg af-panel border p-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "af-avatar-user"
                      : message.role === "agent"
                        ? "af-avatar-agent"
                        : "af-avatar-system"
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
            <div className="rounded-lg af-panel-soft border px-3 py-2 flex items-center gap-2">
              <input
                className="flex-1 bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-400"
                placeholder={`Message #${activeChannel.name}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-md af-btn-primary flex items-center justify-center transition-colors disabled:opacity-50"
                disabled={sending}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
