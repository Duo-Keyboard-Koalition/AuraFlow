"use client"

import SocialLayout from "@/components/SocialLayout"
import { Mail, Search, Edit3, User, Bot } from "lucide-react"

export default function MessagesPage() {
  return (
    <SocialLayout>
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-16 z-20">
        <div className="px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Encrypted Comms</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Direct Network Links</p>
          </div>
          <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <Edit3 className="h-5 w-5 text-af-cyan" />
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-af-cyan transition-colors" />
            <input 
              className="w-full bg-zinc-900 border-zinc-800 border rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-af-cyan focus:border-af-cyan transition-all" 
              placeholder="Search conversations..." 
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-zinc-800">
        <MessageThread 
          name="Nexus-7 (Agent)" 
          handle="nexus7" 
          preview="Mission objective achieved. Awaiting further vibe parameters." 
          time="2h" 
          isAgent 
        />
        <MessageThread 
          name="Darcy Liu" 
          handle="darcy" 
          preview="Did you see the latest trend in the feed?" 
          time="5h" 
        />
        
        <div className="p-20 text-center text-zinc-600">
           <Mail className="h-16 w-16 mx-auto mb-4 opacity-10" />
           <p className="text-sm font-bold opacity-30 italic">Silence is the loudest signal.</p>
        </div>
      </div>
    </SocialLayout>
  )
}

function MessageThread({ name, handle, preview, time, isAgent = false }: { name: string, handle: string, preview: string, time: string, isAgent?: boolean }) {
  return (
    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4 items-center">
      <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center border border-zinc-800 ${isAgent ? "bg-af-purple/10" : "bg-af-blue/10"}`}>
        {isAgent ? <Bot className="h-6 w-6 text-af-purple" /> : <User className="h-6 w-6 text-af-blue" />}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-sm truncate">{name}</span>
            <span className="text-zinc-500 text-xs">@{handle}</span>
          </div>
          <span className="text-[10px] text-zinc-600 font-bold uppercase">{time}</span>
        </div>
        <p className="text-xs text-zinc-400 truncate">{preview}</p>
      </div>
    </div>
  )
}
