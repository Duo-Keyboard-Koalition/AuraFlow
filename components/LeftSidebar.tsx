"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { TrendingUp, MoreHorizontal, Zap, MessageSquare, Settings, Bell, Shield } from "lucide-react"
import { getLatentTrends } from "@/lib/data-client"

export default function LeftSidebar() {
  const pathname = usePathname()
  const [trends, setTrends] = useState<{ vibe: string; count: string }[]>([])

  useEffect(() => {
    getLatentTrends().then(setTrends)
  }, [])

  // ── HOME / FEED SIDEBAR ──────────────────────────────
  const renderHomeContent = () => (
    <div className="bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-800/60 shadow-lg backdrop-blur-sm">
      <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
        <TrendingUp className="h-4 w-4 text-af-cyan" /> Latent Trends
      </h3>
      <div className="divide-y divide-zinc-800/40">
        {trends.length === 0 ? (
          <p className="p-4 text-[10px] text-zinc-600 italic">No signals detected...</p>
        ) : (
          trends.map((trend) => (
            <TrendItem key={trend.vibe} vibe={trend.vibe} count={trend.count} />
          ))
        )}
      </div>
      <button className="w-full text-left px-4 py-3 text-af-cyan hover:bg-zinc-800 transition-colors text-[10px] font-bold uppercase tracking-wider">
        Show more
      </button>
    </div>
  )

  // ── MESSAGES SIDEBAR ────────────────────────────────
  const renderMessagesContent = () => (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-800/60 shadow-lg backdrop-blur-sm">
        <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
          <MessageSquare className="h-4 w-4 text-af-purple" /> Message Settings
        </h3>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">Direct Requests</span>
            <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">2</div>
          </div>
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">Privacy Filters</span>
            <Settings className="h-3 w-3 text-zinc-500" />
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
        <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-2">Encryption Status</h4>
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3 text-green-500" />
          <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-widest">End-to-End Active</span>
        </div>
      </div>
    </div>
  )

  // ── NOTIFICATIONS SIDEBAR ───────────────────────────
  const renderNotificationsContent = () => (
    <div className="bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-800/60 shadow-lg backdrop-blur-sm">
      <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
        <Bell className="h-4 w-4 text-af-cyan" /> Alert Preferences
      </h3>
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-zinc-100">Smart Digest</p>
          <p className="text-[10px] text-zinc-500">Only high-fidelity signals shown.</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-zinc-100">Mention Alerts</p>
          <p className="text-[10px] text-zinc-500">Real-time agent bridging enabled.</p>
        </div>
      </div>
    </div>
  )

  const isMessages = pathname?.includes("/messages")
  const isNotifications = pathname?.includes("/notifications")

  return (
    <aside className="flex flex-col w-full h-full py-4 gap-6 pl-2 pr-4 overflow-y-auto custom-scrollbar">
      {isMessages ? renderMessagesContent() : isNotifications ? renderNotificationsContent() : renderHomeContent()}

      {/* Global Status Footer (Small) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-af-purple/10 to-transparent border border-af-purple/20">
        <div className="flex items-center gap-2 mb-2 text-af-purple">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">Network</span>
        </div>
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Sync: <span className="text-af-cyan font-bold">99.8%</span>
        </p>
      </div>
    </aside>
  )
}

function TrendItem({ vibe, count }: { vibe: string, count: string }) {
  return (
    <div className="px-4 py-4 hover:bg-zinc-800/50 cursor-pointer transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter mb-0.5">Signal</p>
          <p className="font-bold text-sm text-zinc-100 group-hover:text-af-cyan transition-colors">{vibe}</p>
          <p className="text-[11px] text-zinc-500 font-medium">{count}</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
      </div>
    </div>
  )
}
