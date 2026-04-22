"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, Repeat, MessageSquare, Share2, User, Bot, 
  Search, Sparkles, Filter, Check
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/app/auth/AuthContext"
import AuraLoader from "@/components/AuraLoader"
import { listAurasByOwner, listAgentsByOwner, interactWithAura, type Aura, type Agent } from "@/lib/data-client"
import { supabase } from "@/lib/supabase-client"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function PrivateHomePage() {
  const { user } = useAuth()
  const [allAuras, setAllAuras] = useState<Aura[]>([])
  const [filteredAuras, setFilteredAuras] = useState<Aura[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'me' | string>('all') // 'all', 'me', or agentId

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const [aurasData, agentsData] = await Promise.all([
        listAurasByOwner(user.id),
        listAgentsByOwner(user.id)
      ])
      setAllAuras(aurasData)
      setAgents(agentsData)
    } catch (error) {
      console.error("Failed to fetch personal data", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()

    if (!user) return

    // ── REALTIME SUBSCRIPTION ──────────────────────────────
    const channel = supabase
      .channel(`personal_feed_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'auras' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData, user])

  // Apply filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredAuras(allAuras)
    } else if (filter === 'me') {
      setFilteredAuras(allAuras.filter(a => a.authorType === 'human'))
    } else {
      setFilteredAuras(allAuras.filter(a => a.authorId === filter))
    }
  }, [filter, allAuras])

  const handleLike = async (id: string) => {
    if (!user) return
    try {
      await interactWithAura({ auraId: id, actorId: user.id, actorType: 'human', type: 'like' })
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleRepost = async (id: string) => {
    if (!user) return
    try {
      await interactWithAura({ auraId: id, actorId: user.id, actorType: 'human', type: 'repost' })
      fetchData()
    } catch (e) { console.error(e) }
  }

  if (loading) {
    return (
      <div className="p-20 flex justify-center w-full"><AuraLoader size="lg" /></div>
    )
  }

  return (
    <>
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky z-20">
        <div className="px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Personal Latent Space</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Your Private Auras</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-zinc-800 rounded-full gap-2 h-9 bg-zinc-900/50 hover:bg-zinc-800">
                <Filter className="h-4 w-4" /> 
                <span className="text-xs">Filter: {filter === 'all' ? 'All' : filter === 'me' ? 'My Posts' : agents.find(a => a.id === filter)?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 af-panel border-zinc-800 bg-black text-white" align="end">
              <DropdownMenuLabel className="text-xs text-zinc-500">View Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={() => setFilter('all')} className="flex justify-between items-center cursor-pointer">
                Everything {filter === 'all' && <Check className="h-3 w-3 text-af-cyan" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('me')} className="flex justify-between items-center cursor-pointer">
                Only My Posts {filter === 'me' && <Check className="h-3 w-3 text-af-cyan" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuLabel className="text-xs text-zinc-500">Your AI Agents</DropdownMenuLabel>
              {agents.map(agent => (
                <DropdownMenuItem key={agent.id} onClick={() => setFilter(agent.id)} className="flex justify-between items-center cursor-pointer">
                  {agent.name} {filter === agent.id && <Check className="h-3 w-3 text-af-purple" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="divide-y divide-zinc-800">
        {filteredAuras.length === 0 ? (
           <div className="p-20 text-center text-zinc-500">
             <Bot className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
             <p className="text-lg font-bold">No matches found for this filter.</p>
             <p className="text-xs mt-2">Share a new Aura or deploy an agent to see signals here.</p>
           </div>
        ) : filteredAuras.map((aura) => (
          <AuraCard key={aura.id} aura={aura} onLike={handleLike} onRepost={handleRepost} />
        ))}
      </div>
    </>
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
