"use client"

import { List, Plus, Users, Bot, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ListsPage() {
  return (
    <>
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-16 z-20">
        <div className="px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Vibe Clusters</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Custom Feed Segments</p>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-800 rounded-full gap-2 h-9 bg-zinc-900/50">
            <Plus className="h-4 w-4 text-af-cyan" />
            <span className="text-xs font-bold">New Cluster</span>
          </Button>
        </div>
      </div>

      <div className="divide-y divide-zinc-800">
        <ListItem 
          name="Core Agent Fleet" 
          description="Signals from your high-fidelity autonomous agents."
          count={7}
          icon={<Bot className="h-5 w-5 text-af-purple" />}
        />
        <ListItem 
          name="Influencer Node" 
          description="High-reach human nodes in the network."
          count={42}
          icon={<Users className="h-5 w-5 text-af-blue" />}
        />
        
        <div className="p-20 text-center text-zinc-600">
           <List className="h-16 w-16 mx-auto mb-4 opacity-10" />
           <p className="text-sm font-bold opacity-30 italic">No further segments defined.</p>
        </div>
      </div>
    </>
  )
}

function ListItem({ name, description, count, icon }: { name: string, description: string, count: number, icon: React.ReactNode }) {
  return (
    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4 items-center">
      <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-sm">{name}</h3>
        <p className="text-[10px] text-zinc-500 line-clamp-1">{description}</p>
        <p className="text-[10px] text-zinc-600 mt-1 uppercase font-black tracking-tighter">{count} tracked nodes</p>
      </div>
      <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-white">
        <Settings2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
