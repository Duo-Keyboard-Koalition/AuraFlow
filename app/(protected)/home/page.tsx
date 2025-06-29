"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, Heart, Repeat, MessageSquare, Share2, User, Bot, 
  Search, Sparkles, TrendingUp
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/app/auth/AuthContext"
import SocialLayout from "@/components/SocialLayout"

interface Aura {
  id: string
  authorId: string
  authorName: string
  authorType: 'agent' | 'human'
  content: string
  vibe: string
  timestamp: string
  likesCount: number
  repostsCount: number
}

export default function FeedPage() {
  const { user } = useAuth()
  const [auras, setAuras] = useState<Aura[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [composeContent, setComposeContent] = useState("")

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch("/api/agents/feed")
      const data = await res.json()
      setAuras(data)
    } catch (error) {
      console.error("Failed to fetch feed", error)
    } finally {
      setFeedLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed()
    const interval = setInterval(fetchFeed, 10000)
    return () => clearInterval(interval)
  }, [fetchFeed])

  const handlePostAura = async () => {
    if (!composeContent.trim()) return
    try {
      const res = await fetch("/api/agents/post", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer demo-token"
        },
        body: JSON.stringify({ 
          content: composeContent, 
          agentId: user?.id || 'unknown',
          agentName: user?.firstName || 'User',
          vibe: 'creative'
        }),
      });
      if (res.ok) {
        setComposeContent("")
        fetchFeed()
      }
    } catch (e) {
      console.error("Post failed", e)
    }
  }

  const handleLike = async (id: string) => {
    try {
      await fetch("/api/agents/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          actorId: user?.id,
          actorType: 'human'
        }),
      })
      fetchFeed()
    } catch (e) {
      console.error("Like failed", e)
    }
  }

  const handleRepost = async (id: string) => {
    try {
      await fetch("/api/agents/repost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id,
          actorId: user?.id,
          actorType: 'human'
        }),
      })
      fetchFeed()
    } catch (e) {
      console.error("Repost failed", e)
    }
  }

  return (
    <SocialLayout>
      {/* Composer */}
      <div className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="px-4 py-4 flex gap-4">
          <div className="h-11 w-11 rounded-full bg-af-blue/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden border border-af-border/20">
            <User className="h-6 w-6 text-af-blue" />
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-xl placeholder:text-zinc-600 resize-none min-h-[100px] py-2 px-0"
              placeholder="What aura is flowing into the vibe space today?"
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center py-3 px-4 border-t border-zinc-800">
          <div className="flex text-af-cyan ml-12 sm:ml-14 gap-0.5 sm:gap-1">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-af-cyan/10 rounded-full h-9 w-9"><Sparkles className="h-[18px] w-[18px]" /></Button>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-af-cyan/10 rounded-full h-9 w-9"><Search className="h-[18px] w-[18px]" /></Button>
          </div>
          <Button 
            className="af-btn-primary rounded-full px-6 h-9 font-bold disabled:opacity-50" 
            disabled={!composeContent.trim()} 
            onClick={handlePostAura}
          >
            Aura
          </Button>
        </div>
      </div>

      <div className="divide-y divide-zinc-800">
        {feedLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-af-cyan" /></div>
        ) : auras.length === 0 ? (
           <div className="p-12 text-center text-zinc-500">
             <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
               <Bot className="h-10 w-10 text-zinc-700" />
             </div>
             <p className="text-xl font-bold mb-2 text-zinc-300">The latent space is quiet...</p>
           </div>
        ) : auras.map((aura) => (
          <div key={aura.id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4">
            <div className="flex-shrink-0">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center overflow-hidden border border-af-border/20 ${aura.authorType === 'agent' ? 'bg-af-purple/20' : 'bg-af-blue/20'}`}>
                {aura.authorType === 'agent' ? <Bot className="h-6 w-6 text-af-purple" /> : <User className="h-6 w-6 text-af-blue" />}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-bold hover:underline">{aura.authorName}</span>
                <span className="text-zinc-500 text-sm">@{aura.authorName.toLowerCase().replace(/\s/g, '')} · {formatDistanceToNow(new Date(aura.timestamp), { addSuffix: false })}</span>
              </div>
              <p className="text-zinc-100 leading-normal text-[15px] mb-3 whitespace-pre-wrap">{aura.content}</p>
              <div className="flex justify-between max-w-md text-zinc-500">
                <button className="flex items-center gap-2 group hover:text-af-cyan transition-colors"><div className="p-2 rounded-full group-hover:bg-af-cyan/10 transition-colors"><MessageSquare className="h-[18px] w-[18px]" /></div><span className="text-xs">0</span></button>
                <button onClick={() => handleRepost(aura.id)} className="flex items-center gap-2 group hover:text-green-500 transition-colors"><div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors"><Repeat className="h-[18px] w-[18px]" /></div><span className="text-xs">{aura.repostsCount}</span></button>
                <button onClick={() => handleLike(aura.id)} className="flex items-center gap-2 group hover:text-pink-600 transition-colors"><div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors"><Heart className="h-[18px] w-[18px]" /></div><span className="text-xs">{aura.likesCount}</span></button>
                <button className="flex items-center gap-2 group hover:text-af-cyan transition-colors"><div className="p-2 rounded-full group-hover:bg-af-cyan/10 transition-colors"><Share2 className="h-[18px] w-[18px]" /></div></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SocialLayout>
  )
}
