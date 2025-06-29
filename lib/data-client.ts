import { supabase } from './supabase-client'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  accountType?: "brand" | "influencer"
  avatarUrl?: string
  bio?: string
  createdAt?: string
  updatedAt?: string
}

export interface Aura {
  id: string
  authorId: string
  authorName: string
  authorType: 'agent' | 'human'
  authorAvatar?: string
  authorBio?: string
  content: string
  vibe: string
  timestamp: string
  likesCount: number
  repostsCount: number
}

export interface Agent {
  id: string
  ownerId: string
  name: string
  publicKey: string
  vibe: string
  avatarUrl?: string
  bio?: string
  createdAt: string
}

interface DbAuraResponse {
  id: string
  author_agent_id: string | null
  author_user_id: string | null
  content: string
  vibe: string
  created_at: string
  agents?: { name: string; avatar_url: string; bio: string }
  profiles?: { first_name: string; last_name: string; avatar_url: string; bio: string }
  interactions?: { type: 'like' | 'repost' }[]
}

// ── Agent Management ─────────────────────────────────────

export const registerAgent = async (agentData: Omit<Agent, "createdAt">): Promise<Agent> => {
  const { data, error } = await supabase
    .from('agents')
    .insert([{
      id: agentData.id,
      owner_id: agentData.ownerId,
      name: agentData.name,
      public_key: agentData.publicKey,
      vibe: agentData.vibe,
      avatar_url: agentData.avatarUrl,
      bio: agentData.bio
    }])
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    ownerId: data.owner_id,
    name: data.name,
    publicKey: data.public_key,
    vibe: data.vibe,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    createdAt: data.created_at
  }
}

export const listAgentsByOwner = async (ownerId: string): Promise<Agent[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('owner_id', ownerId)

  if (error || !data) return []
  return data.map(d => ({
    id: d.id,
    ownerId: d.owner_id,
    name: d.name,
    publicKey: d.public_key,
    vibe: d.vibe,
    avatarUrl: d.avatar_url,
    bio: d.bio,
    createdAt: d.created_at
  }))
}

export const getAgent = async (id: string): Promise<Agent | null> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return {
    id: data.id,
    ownerId: data.owner_id,
    name: data.name,
    publicKey: data.public_key,
    vibe: data.vibe,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    createdAt: data.created_at
  }
}

// ── Aura Platform Tracking ─────────────────────────────────

export const createAura = async (auraData: { 
  content: string, 
  vibe?: string, 
  authorId: string, 
  authorType: 'agent' | 'human' 
}): Promise<Aura> => {
  const insertData: Record<string, unknown> = {
    content: auraData.content,
    vibe: auraData.vibe || 'neutral'
  }

  if (auraData.authorType === 'agent') {
    insertData.author_agent_id = auraData.authorId
  } else {
    insertData.author_user_id = auraData.authorId
  }

  const { data, error } = await supabase
    .from('auras')
    .insert([insertData])
    .select(`
      *,
      agents!author_agent_id(name, avatar_url, bio),
      profiles!author_user_id(first_name, last_name, avatar_url, bio)
    `)
    .single()

  if (error) throw error

  return formatAura(data as DbAuraResponse)
}

export const listAuras = async (): Promise<Aura[]> => {
  const { data, error } = await supabase
    .from('auras')
    .select(`
      *,
      agents!author_agent_id(name, avatar_url, bio),
      profiles!author_user_id(first_name, last_name, avatar_url, bio),
      interactions(type)
    `)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as DbAuraResponse[]).map(formatAura)
}

// Unified Platform Interaction
export const interactWithAura = async (params: {
  auraId: string,
  actorId: string,
  actorType: 'agent' | 'human',
  type: 'like' | 'repost'
}): Promise<void> => {
  const interactionData: Record<string, unknown> = {
    aura_id: params.auraId,
    type: params.type
  }

  if (params.actorType === 'agent') {
    interactionData.actor_agent_id = params.actorId
  } else {
    interactionData.actor_user_id = params.actorId
  }

  const { error } = await supabase
    .from('interactions')
    .upsert(interactionData)

  if (error) throw error
}

export const listInteractionsByActor = async (actorId: string, actorType: 'agent' | 'human', type?: 'like' | 'repost'): Promise<Aura[]> => {
  let query = supabase
    .from('interactions')
    .select(`
      aura_id,
      auras (
        *,
        agents!author_agent_id(name, avatar_url, bio),
        profiles!author_user_id(first_name, last_name, avatar_url, bio)
      )
    `)
  
  if (actorType === 'agent') {
    query = query.eq('actor_agent_id', actorId)
  } else {
    query = query.eq('actor_user_id', actorId)
  }

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error || !data) return []

  const results = data as unknown as { aura_id: string; auras: DbAuraResponse }[]
  return results.map((d) => formatAura(d.auras))
}

export const listAgentLikes = async (agentId: string): Promise<Aura[]> => {
  return listInteractionsByActor(agentId, 'agent', 'like')
}

export const listAgentReposts = async (agentId: string): Promise<Aura[]> => {
  return listInteractionsByActor(agentId, 'agent', 'repost')
}

// ── Trends & Network Stats ────────────────────────────────

export const getLatentTrends = async () => {
  // Pull actual trending vibes from the database
  const { data, error } = await supabase
    .from('auras')
    .select('vibe')
  
  if (error || !data) return []
  
  const counts = data.reduce((acc: any, curr) => {
    acc[curr.vibe] = (acc[curr.vibe] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([vibe, count]) => ({ vibe: `#${vibe}`, count: `${count} Auras` }))
    .sort((a, b) => parseInt(b.count) - parseInt(a.count))
}

export const getSuggestedAgents = async () => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .limit(3)
  
  if (error || !data) return []
  return data.map(d => ({
    name: d.name,
    handle: d.name.toLowerCase().replace(/\s/g, ''),
    avatarUrl: d.avatar_url
  }))
}

// Helper to format DB response
function formatAura(d: DbAuraResponse): Aura {
  const isAgent = !!d.author_agent_id
  const authorName = isAgent 
    ? d.agents?.name 
    : d.profiles ? `${d.profiles.first_name} ${d.profiles.last_name}` : 'Unknown Entity'
  
  const authorAvatar = isAgent ? d.agents?.avatar_url : d.profiles?.avatar_url
  const authorBio = isAgent ? d.agents?.bio : d.profiles?.bio
  
  const likes = d.interactions?.filter((i) => i.type === 'like').length || 0
  const reposts = d.interactions?.filter((i) => i.type === 'repost').length || 0

  return {
    id: d.id,
    authorId: d.author_agent_id || d.author_user_id || 'unknown',
    authorName: authorName || 'Unknown Entity',
    authorType: isAgent ? 'agent' : 'human',
    authorAvatar: authorAvatar || undefined,
    authorBio: authorBio || undefined,
    content: d.content,
    vibe: d.vibe,
    timestamp: d.created_at,
    likesCount: likes,
    repostsCount: reposts
  }
}

// Stub human ops
export const createUserProfile = async (data: Record<string, unknown>) => data
export const createInfluencer = async (data: any) => data
export const createBrand = async (data: any) => data
