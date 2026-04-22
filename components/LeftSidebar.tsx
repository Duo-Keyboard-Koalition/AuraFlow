"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { TrendingUp, MoreHorizontal, Zap, MessageSquare, Settings, Bell, Shield } from "lucide-react"
import { useAura } from "@/app/context/AuraContext"

export default function LeftSidebar() {
  const pathname = usePathname()
  const { trends, networkStatus } = useAura()

  // ── HOME / FEED SIDEBAR ──────────────────────────────
  const renderHomeContent = () => (
    <div className="bg-af-surface-1/40 rounded-2xl overflow-hidden border border-af-border-subtle shadow-lg backdrop-blur-sm">
      <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-af-border-subtle flex items-center gap-2 text-af-text-secondary">
        <TrendingUp className="h-4 w-4 text-af-cyan" /> Latent Trends
      </h3>
      <div className="divide-y divide-af-border-subtle">
        {trends.length === 0 ? (
          <p className="p-4 text-[10px] text-af-text-muted italic">No signals detected...</p>
        ) : (
          trends.map((trend) => (
            <TrendItem key={trend.vibe} vibe={trend.vibe} count={trend.count} />
          ))
        )}
      </div>
      <button className="w-full text-left px-4 py-3 text-af-cyan hover:bg-af-surface-2 transition-colors text-[10px] font-bold uppercase tracking-wider">
        Show more
      </button>
    </div>
  )

  // ── MESSAGES SIDEBAR ────────────────────────────────
  const renderMessagesContent = () => (
    <div className="space-y-4">
      <div className="bg-af-surface-1/40 rounded-2xl overflow-hidden border border-af-border-subtle shadow-lg backdrop-blur-sm">
        <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-af-border-subtle flex items-center gap-2 text-af-text-secondary">
          <MessageSquare className="h-4 w-4 text-af-purple" /> Message Settings
        </h3>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-af-text-secondary group-hover:text-white transition-colors">Direct Requests</span>
            <div className="h-4 w-4 rounded-full bg-af-surface-2 flex items-center justify-center text-[10px]">2</div>
          </div>
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-af-text-secondary group-hover:text-white transition-colors">Privacy Filters</span>
            <Settings className="h-3 w-3 text-af-text-muted" />
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-2xl bg-af-surface-1/40 border border-af-border-subtle">
        <h4 className="text-[10px] font-black uppercase text-af-text-muted mb-2">Encryption Status</h4>
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3 text-green-500" />
          <span className="text-[11px] text-af-text-secondary font-bold uppercase tracking-widest">End-to-End Active</span>
        </div>
      </div>
    </div>
  )

  // ── NOTIFICATIONS SIDEBAR ───────────────────────────
  const renderNotificationsContent = () => (
    <div className="bg-af-surface-1/40 rounded-2xl overflow-hidden border border-af-border-subtle shadow-lg backdrop-blur-sm">
      <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-af-border-subtle flex items-center gap-2 text-af-text-secondary">
        <Bell className="h-4 w-4 text-af-cyan" /> Alert Preferences
      </h3>
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-af-text-primary">Smart Digest</p>
          <p className="text-[10px] text-af-text-muted">Only high-fidelity signals shown.</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-af-text-primary">Mention Alerts</p>
          <p className="text-[10px] text-af-text-muted">Real-time agent bridging enabled.</p>
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
        <p className="text-[10px] text-af-text-muted leading-relaxed">
          Sync: <span className="text-af-cyan font-bold">{networkStatus.sync}</span>
        </p>
      </div>
    </aside>
  )
}

function TrendItem({ vibe, count }: { vibe: string, count: string }) {
  return (
    <div className="px-4 py-4 hover:bg-af-surface-2 cursor-pointer transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] text-af-text-muted uppercase font-black tracking-tighter mb-0.5">Signal</p>
          <p className="font-bold text-sm text-af-text-primary group-hover:text-af-cyan transition-colors">{vibe}</p>
          <p className="text-[11px] text-af-text-muted font-medium">{count}</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-af-text-muted group-hover:text-af-text-secondary" />
      </div>
    </div>
  )
}
