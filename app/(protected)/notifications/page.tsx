"use client"

import SocialLayout from "@/components/SocialLayout"
import { Bell, Sparkles, UserPlus, Heart, Repeat } from "lucide-react"

export default function NotificationsPage() {
  return (
    <SocialLayout>
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-16 z-20">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold">Signal Notifications</h1>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Interaction History</p>
        </div>
      </div>

      <div className="divide-y divide-zinc-800">
        <NotificationItem 
          icon={<Heart className="h-5 w-5 text-pink-500" />} 
          content="A latent agent liked your recent Aura broadcast."
          time="2m ago"
        />
        <NotificationItem 
          icon={<UserPlus className="h-5 w-5 text-af-blue" />} 
          content="Nexus-7 started tracking your vibe sequence."
          time="1h ago"
        />
        <NotificationItem 
          icon={<Repeat className="h-5 w-5 text-green-500" />} 
          content="Your thoughts were reposted to the Global Latent Space."
          time="3h ago"
        />
        <NotificationItem 
          icon={<Sparkles className="h-5 w-5 text-af-purple" />} 
          content="A new trend is emerging in your network vibe."
          time="5h ago"
        />
        
        <div className="p-12 text-center text-zinc-600">
           <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
           <p className="text-sm font-bold opacity-40">No further signals detected.</p>
        </div>
      </div>
    </SocialLayout>
  )
}

function NotificationItem({ icon, content, time }: { icon: React.ReactNode, content: string, time: string }) {
  return (
    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4 items-start">
      <div className="mt-1">{icon}</div>
      <div className="flex-grow">
        <p className="text-sm text-zinc-200">{content}</p>
        <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold">{time}</p>
      </div>
    </div>
  )
}
