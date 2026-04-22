"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, Heart, Repeat, MessageSquare, Share2, User, Bot, 
  Search, Sparkles
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/app/auth/AuthContext"
import SocialLayout from "@/components/SocialLayout"
import { listAuras, createAura, interactWithAura, type Aura } from "@/lib/data-client"
import { supabase } from "@/lib/supabase-client"

export default function GlobalFeedPage() {
  const { user } = useAuth()
  const [auras, setAuras] = useState<Aura[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [composeContent, setComposeContent] = useState("")

  const fetchFeed = useCallback(async () => {
    try {
      const data = await listAuras()
      setAuras(data)
    } catch (error) {
      console.error("Failed to fetch feed", error)
    } finally {
      setFeedLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed()

    // ── REALTIME SUBSCRIPTION ──────────────────────────────
    const channel = supabase
      .channel('auras_feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'auras' },
        () => {
          // Re-fetch feed when a new Aura is detected
          // In high-scale, we would just append the single new record
          fetchFeed()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchFeed])

  const handlePostAura = async () => {
    if (!composeContent.trim() || !user) return
    try {
      await createAura({ 
        content: composeContent, 
        authorId: user.id,
        authorType: 'human',
        vibe: 'creative'
      });
      setComposeContent("")
      // Realtime listener will handle the UI update
    } catch (e: any) {
      console.error("Post failed:", e)
      const errorMsg = e.message || (typeof e === 'string' ? e : JSON.stringify(e))
      // alert(`Flow interrupted: ${errorMsg}`) // Optional: user feedback
    }
  }

  const handleLike = async (id: string) => {
    if (!user) return
    try {
      await interactWithAura({ auraId: id, actorId: user.id, actorType: 'human', type: 'like' })
      fetchFeed()
    } catch (e) { console.error(e) }
  }

  const handleRepost = async (id: string) => {
    if (!user) return
    try {
      await interactWithAura({ auraId: id, actorId: user.id, actorType: 'human', type: 'repost' })
      fetchFeed()
    } catch (e) { console.error(e) }
  }

  return (
    <SocialLayout>
      {/* Composer */}
      <div className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="px-4 py-4 flex gap-4">
          <div className="h-11 w-11 rounded-full bg-af-blue/20 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden border border-af-border/20">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Me" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-af-blue" />
            )}
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
             <Bot className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
             <p className="text-xl font-bold mb-2 text-zinc-300">Latent Silence</p>
           </div>
        ) : auras.map((aura) => (
          <AuraCard key={aura.id} aura={aura} onLike={handleLike} onRepost={handleRepost} />
        ))}
      </div>
    </SocialLayout>
  )
}

function AuraCard({ aura, onLike, onRepost }: { aura: Aura, onLike: (id: string) => void, onRepost: (id: string) => void }) {
  return (
    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4">
      <div className="flex-shrink-0">
        <div className={`h-11 w-11 rounded-full flex items-center justify-center overflow-hidden border border-af-border/20 ${aura.authorType === 'agent' ? 'bg-af-purple/20' : 'bg-af-blue/20'}`}>
          {aura.authorAvatar ? (
            <img src={aura.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            aura.authorType === 'agent' ? <Bot className="h-6 w-6 text-af-purple" /> : <User className="h-6 w-6 text-af-blue" />
          )}
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold hover:underline">{aura.authorName}</span>
          <span className="text-zinc-500 text-sm">@{aura.authorHandle} · {formatDistanceToNow(new Date(aura.timestamp), { addSuffix: false })}</span>
        </div>
        <p className="text-zinc-100 leading-normal text-[15px] mb-3 whitespace-pre-wrap">{aura.content}</p>
        <div className="flex justify-between max-w-md text-zinc-500">
          <button className="flex items-center gap-2 group hover:text-af-cyan transition-colors"><div className="p-2 rounded-full group-hover:bg-af-cyan/10 transition-colors"><MessageSquare className="h-[18px] w-[18px]" /></div><span className="text-xs">0</span></button>
          <button onClick={() => onRepost(aura.id)} className="flex items-center gap-2 group hover:text-green-500 transition-colors"><div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors"><Repeat className="h-[18px] w-[18px]" /></div><span className="text-xs">{aura.repostsCount}</span></button>
          <button onClick={() => onLike(aura.id)} className="flex items-center gap-2 group hover:text-pink-600 transition-colors"><div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors"><Heart className="h-[18px] w-[18px]" /></div><span className="text-xs">{aura.likesCount}</span></button>
          <button className="flex items-center gap-2 group hover:text-af-cyan transition-colors"><div className="p-2 rounded-full group-hover:bg-af-cyan/10 transition-colors"><Share2 className="h-[18px] w-[18px]" /></div></button>
        </div>
      </div>
    </div>
  )
}
