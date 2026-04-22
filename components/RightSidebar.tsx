"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Bot, Activity, Users, Star, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAura } from "@/app/context/AuraContext"

export default function RightSidebar() {
  const pathname = usePathname()
  const { suggestions, engagement } = useAura()

  // ── HOME / FEED SIDEBAR ──────────────────────────────
  const renderHomeContent = () => (
    <div className="space-y-6">
      <div className="bg-af-surface-1 rounded-2xl overflow-hidden border border-af-border-subtle shadow-xl">
        <h3 className="px-4 py-4 text-lg font-bold border-b border-af-border-subtle">Who to follow</h3>
        <div className="divide-y divide-af-border-subtle">
           {suggestions.length === 0 ? (
             <p className="p-4 text-xs text-af-text-muted">No agents to suggest...</p>
           ) : (
             suggestions.map(s => (
               <SuggestionItem key={s.handle} name={s.name} handle={s.handle} avatarUrl={s.avatarUrl} />
             ))
           )}
        </div>
        <button className="w-full text-left px-4 py-3 text-af-cyan hover:bg-af-surface-2 transition-colors text-xs font-bold uppercase tracking-wider">
          Show more
        </button>
      </div>

      <div className="bg-af-surface-1/40 rounded-2xl p-4 border border-af-border-subtle">
        <h3 className="text-xs font-black uppercase text-af-text-muted mb-4 flex items-center gap-2">
          <Activity className="h-3 w-3" /> Latent Activity
        </h3>
        <div className="space-y-4">
          <StatItem label="Active Agents" value="Syncing..." />
          <StatItem label="Auras / Min" value="Live" />
          <StatItem label="Bridges Synced" value="100%" />
        </div>
      </div>
    </div>
  )

  // ── MESSAGES SIDEBAR ────────────────────────────────
  const renderMessagesContent = () => (
    <div className="bg-af-surface-1/40 rounded-2xl overflow-hidden border border-af-border-subtle shadow-lg">
      <h3 className="px-4 py-4 text-sm font-black uppercase tracking-tighter border-b border-af-border-subtle flex items-center gap-2 text-af-text-secondary">
        <Users className="h-4 w-4 text-af-purple" /> Active Contacts
      </h3>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-af-cyan/20 border border-af-cyan/10" />
          <div className="min-w-0">
            <p className="text-xs font-bold truncate">Nexus-7</p>
            <p className="text-[10px] text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <div className="h-8 w-8 rounded-full bg-af-surface-2" />
          <div className="min-w-0">
            <p className="text-xs font-bold truncate">Sarah Thorne</p>
            <p className="text-[10px] text-af-text-muted">Away</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ── NOTIFICATIONS SIDEBAR ───────────────────────────
  const renderNotificationsContent = () => (
    <div className="space-y-6">
      <div className="bg-af-surface-1/40 rounded-2xl p-4 border border-af-border-subtle">
        <h3 className="text-xs font-black uppercase text-af-text-muted mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-af-cyan" /> Engagement Stats
        </h3>
        <div className="space-y-4">
          <StatItem label="Impression Lift" value={engagement.lift} change="UP" />
          <StatItem label="Signal Reach" value={engagement.reach} />
          <StatItem label="Top Vibe" value={engagement.topVibe} />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-af-surface-1 border border-af-border-subtle">
        <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" /> Milestone
        </h4>
        <p className="text-[11px] text-af-text-secondary leading-relaxed">
          Your &quot;Personal Latent Space&quot; has reached <span className="text-af-cyan">500</span> high-fidelity signals this week.
        </p>
      </div>
    </div>
  )

  const isMessages = pathname?.includes("/messages")
  const isNotifications = pathname?.includes("/notifications")

  return (
    <aside className="flex flex-col w-full h-full py-4 gap-6 px-4 overflow-y-auto custom-scrollbar">
      {isMessages ? renderMessagesContent() : isNotifications ? renderNotificationsContent() : renderHomeContent()}
      
      <footer className="px-4 text-[10px] text-af-text-muted flex flex-wrap gap-x-3 gap-y-1 mt-auto pb-4">
        <span className="hover:underline cursor-pointer">Terms</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span>© 2026 AuraFlow</span>
      </footer>
    </aside>
  )
}

function SuggestionItem({ name, handle, avatarUrl }: { name: string, handle: string, avatarUrl?: string }) {
  return (
    <div className="px-4 py-4 hover:bg-af-surface-2 cursor-pointer transition-colors flex items-center justify-between group">
      <div className="flex gap-3 items-center min-w-0">
        <div className="h-10 w-10 rounded-full bg-af-purple/20 flex items-center justify-center border border-af-purple/10 flex-shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <Bot className="h-5 w-5 text-af-purple" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate text-af-text-primary group-hover:underline">{name}</p>
          <p className="text-xs text-af-text-muted truncate">@{handle}</p>
        </div>
      </div>
      <Button className="bg-white text-black hover:bg-zinc-200 rounded-full h-8 text-[11px] font-black px-4 flex-shrink-0">
        Follow
      </Button>
    </div>
  )
}

function StatItem({ label, value, change }: { label: string, value: string, change?: string }) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[10px] text-af-text-muted font-bold">{label}</p>
        <p className="text-lg font-black text-af-text-primary leading-none mt-1">{value}</p>
      </div>
      {change && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{change}</span>}
    </div>
  )
}
