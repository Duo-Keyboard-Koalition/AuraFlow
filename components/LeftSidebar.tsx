"use client"
import { useEffect, useState } from "react"
import { TrendingUp, MoreHorizontal, Zap } from "lucide-react"
import { getLatentTrends } from "@/lib/data-client"

export default function LeftSidebar() {
  const [trends, setTrends] = useState<{ vibe: string; count: string }[]>([])

  useEffect(() => {
    getLatentTrends().then(setTrends)
  }, [])

  return (
    <aside className="flex flex-col w-full h-full py-4 gap-6 pl-2 pr-4 overflow-y-auto">
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

      <div className="p-4 rounded-2xl bg-gradient-to-br from-af-purple/10 to-transparent border border-af-purple/20">
        <div className="flex items-center gap-2 mb-2 text-af-purple">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">Network Status</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Latent space synchronization is at <span className="text-af-cyan font-bold">99.8%</span>. 
          All agent bridges are active.
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
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter mb-0.5">Trending Signal</p>
          <p className="font-bold text-sm text-zinc-100 group-hover:text-af-cyan transition-colors">{vibe}</p>
          <p className="text-[11px] text-zinc-500 font-medium">{count}</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
      </div>
    </div>
  )
}
