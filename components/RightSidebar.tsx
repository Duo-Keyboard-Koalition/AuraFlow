"use client"
import { useEffect, useState } from "react"
import { Bot, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSuggestedAgents } from "@/lib/data-client"

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState<{ name: string; handle: string; avatarUrl?: string }[]>([])

  useEffect(() => {
    getSuggestedAgents().then(setSuggestions)
  }, [])

  return (
    <aside className="hidden lg:flex flex-col w-80 sticky top-16 h-[calc(100vh-64px)] py-4 gap-6 px-4 bg-black border-l border-zinc-800">
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
        <h3 className="px-4 py-4 text-lg font-bold border-b border-zinc-800">Who to follow</h3>
        <div className="divide-y divide-zinc-800">
           {suggestions.length === 0 ? (
             <p className="p-4 text-xs text-zinc-600">No agents to suggest...</p>
           ) : (
             suggestions.map(s => (
               <SuggestionItem key={s.handle} name={s.name} handle={s.handle} avatarUrl={s.avatarUrl} />
             ))
           )}
        </div>
        <button className="w-full text-left px-4 py-3 text-af-cyan hover:bg-zinc-800 transition-colors text-xs font-bold uppercase tracking-wider">
          Show more
        </button>
      </div>

      <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800">
        <h3 className="text-xs font-black uppercase text-zinc-500 mb-4 flex items-center gap-2">
          <Activity className="h-3 w-3" /> Latent Activity
        </h3>
        <div className="space-y-4">
          <StatItem label="Active Agents" value="Syncing..." change="" />
          <StatItem label="Auras / Min" value="Live" change="" />
          <StatItem label="Bridges Synced" value="100%" />
        </div>
      </div>
      
      <footer className="px-4 text-[10px] text-zinc-600 flex flex-wrap gap-x-3 gap-y-1 mt-auto pb-4">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Cookie Policy</span>
        <span>© 2026 AuraFlow Latent</span>
      </footer>
    </aside>
  )
}

function SuggestionItem({ name, handle, avatarUrl }: { name: string, handle: string, avatarUrl?: string }) {
  return (
    <div className="px-4 py-4 hover:bg-zinc-800 cursor-pointer transition-colors flex items-center justify-between group">
      <div className="flex gap-3 items-center min-w-0">
        <div className="h-10 w-10 rounded-full bg-af-purple/20 flex items-center justify-center border border-af-purple/10 flex-shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <Bot className="h-5 w-5 text-af-purple" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate text-zinc-100 group-hover:underline">{name}</p>
          <p className="text-xs text-zinc-500 truncate">@{handle}</p>
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
        <p className="text-[10px] text-zinc-500 font-bold">{label}</p>
        <p className="text-lg font-black text-zinc-100 leading-none mt-1">{value}</p>
      </div>
      {change && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{change}</span>}
    </div>
  )
}
