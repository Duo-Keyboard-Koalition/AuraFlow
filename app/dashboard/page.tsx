"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Bot, ChevronDown, ChevronLeft, ChevronRight, Hash, Loader2, Send, UserRound } from "lucide-react"

interface ChatMessage {
  id: string
  author: string
  role: "bot" | "system" | "user"
  content: string
  time: string
}

interface Channel {
  id: string
  name: string
  messages: ChatMessage[]
}

interface Server {
  id: string
  name: string
  icon: string
  channels: Channel[]
}

interface DirectThread {
  id: string
  botName: string
  status: string
  messages: ChatMessage[]
}

const servers: Server[] = [
  {
    id: "content-lab",
    name: "Content Lab",
    icon: "CL",
    channels: [
      {
        id: "ideas",
        name: "ideas",
        messages: [
          {
            id: "m1",
            author: "Trend Scout",
            role: "bot",
            content: "3 short-form topics are breaking out in your niche: AI routines, creator finance, and BTS editing.",
            time: "09:14",
          },
          {
            id: "m2",
            author: "Hook Generator",
            role: "bot",
            content: "Suggested opener: 'Nobody talks about this creator KPI, but it changes everything.'",
            time: "09:16",
          },
        ],
      },
      {
        id: "scripts",
        name: "scripts",
        messages: [
          {
            id: "m3",
            author: "Script Writer",
            role: "bot",
            content: "Drafted a 45s script with 3 pattern interrupts and a CTA for comments.",
            time: "08:52",
          },
        ],
      },
      {
        id: "publishing",
        name: "publishing",
        messages: [
          {
            id: "m4",
            author: "Scheduler",
            role: "system",
            content: "Best posting windows updated based on your last 10 uploads.",
            time: "Yesterday",
          },
        ],
      },
    ],
  },
  {
    id: "deal-room",
    name: "Deal Room",
    icon: "DR",
    channels: [
      {
        id: "inbound",
        name: "inbound",
        messages: [
          {
            id: "m5",
            author: "Deal Finder",
            role: "bot",
            content: "4 campaign invites match your audience profile this week.",
            time: "10:03",
          },
        ],
      },
      {
        id: "negotiation",
        name: "negotiation",
        messages: [
          {
            id: "m6",
            author: "Outreach Agent",
            role: "bot",
            content: "Counter-offer template ready: +25% usage fee, reduced exclusivity window.",
            time: "10:05",
          },
        ],
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: "AN",
    channels: [
      {
        id: "weekly-review",
        name: "weekly-review",
        messages: [
          {
            id: "m7",
            author: "Audience Mapper",
            role: "bot",
            content: "Retention improved by 18% on videos with direct 3-second hooks.",
            time: "07:41",
          },
        ],
      },
      {
        id: "experiments",
        name: "experiments",
        messages: [
          {
            id: "m8",
            author: "A/B Agent",
            role: "bot",
            content: "Run experiment: face-cam intro vs text-only intro for next 6 uploads.",
            time: "07:45",
          },
        ],
      },
    ],
  },
]

const directThreads: DirectThread[] = [
  {
    id: "dm-trend-scout",
    botName: "Trend Scout",
    status: "online",
    messages: [
      {
        id: "d1",
        author: "Trend Scout",
        role: "bot",
        content: "Want me to prioritize trends by CPM potential or save-rate potential?",
        time: "Now",
      },
    ],
  },
  {
    id: "dm-script-writer",
    botName: "Script Writer",
    status: "busy",
    messages: [
      {
        id: "d2",
        author: "Script Writer",
        role: "bot",
        content: "Send me your next topic and I will return 3 script variants in different tones.",
        time: "Now",
      },
    ],
  },
  {
    id: "dm-deal-finder",
    botName: "Deal Finder",
    status: "online",
    messages: [
      {
        id: "d3",
        author: "Deal Finder",
        role: "bot",
        content: "I flagged two fintech partnerships with above-market payout and 30-day terms.",
        time: "Now",
      },
    ],
  },
]

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activeServerId, setActiveServerId] = useState(servers[0].id)
  const [activeChannelId, setActiveChannelId] = useState(servers[0].channels[0].id)
  const [activeDirectId, setActiveDirectId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const activeServer = servers.find((server) => server.id === activeServerId) || servers[0]
  const activeChannel = activeServer.channels.find((channel) => channel.id === activeChannelId) || activeServer.channels[0]
  const activeDirect = directThreads.find((dm) => dm.id === activeDirectId) || null
  const messageFeed = activeDirect ? activeDirect.messages : activeChannel.messages

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
          <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold">IW</div>
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
                setActiveDirectId(null)
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

          <div className="p-3 space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">Channels</p>
              <div className="space-y-1">
                {activeServer.channels.map((channel) => (
                  <button
                    key={channel.id}
                    className={`w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                      activeChannelId === channel.id && !activeDirectId
                        ? "bg-purple-600/40 text-white"
                        : "text-zinc-200 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setActiveChannelId(channel.id)
                      setActiveDirectId(null)
                    }}
                  >
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">Direct Messages</p>
              <div className="space-y-1">
                {directThreads.map((thread) => (
                  <button
                    key={thread.id}
                    className={`w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                      activeDirectId === thread.id ? "bg-purple-600/40 text-white" : "text-zinc-200 hover:bg-gray-800"
                    }`}
                    onClick={() => setActiveDirectId(thread.id)}
                  >
                    <Bot className="h-4 w-4 shrink-0" />
                    <span className="truncate">{thread.botName}</span>
                    <span
                      className={`ml-auto h-2 w-2 rounded-full ${
                        thread.status === "online" ? "bg-purple-300" : "bg-purple-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
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
              {activeDirect ? (
                <>
                  <UserRound className="h-4 w-4 text-zinc-300" />
                  <h1 className="text-lg font-semibold truncate">{activeDirect.botName}</h1>
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 text-zinc-300" />
                  <h1 className="text-lg font-semibold truncate">{activeChannel.name}</h1>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-zinc-300">{user?.firstName || user?.email?.split("@")[0]}</span>
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
            {messageFeed.map((message) => (
              <div key={message.id} className="flex gap-3 rounded-lg bg-gray-900/50 border border-gray-800 p-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-purple-500"
                      : message.role === "system"
                        ? "bg-purple-700"
                        : "bg-purple-600"
                  }`}
                >
                  {message.role === "system" ? <Hash className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{message.author}</span>
                    <span className="text-zinc-400 text-xs">{message.time}</span>
                  </p>
                  <p className="text-sm text-zinc-200">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-6 pt-0">
            <div className="rounded-lg bg-gray-900/70 border border-gray-700 px-3 py-2 flex items-center gap-2">
              <input
                className="flex-1 bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-400"
                placeholder={
                  activeDirect
                    ? `Message @${activeDirect.botName}`
                    : `Message #${activeChannel.name}`
                }
              />
              <button className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
