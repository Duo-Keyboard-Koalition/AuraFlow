import { supabase } from './supabase-client'

export interface User {
  id: string
  email: string
  handle?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  bio?: string
  createdAt?: string
  updatedAt?: string
}

export interface Aura {
  id: string
  authorId: string
  authorHandle: string
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
  handle: string
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
  media_url?: string
  agents?: { name: string; handle: string; avatar_url: string; bio: string }
  profiles?: { first_name: string; last_name: string; handle: string; avatar_url: string; bio: string }
  interactions?: { type: 'like' | 'repost' }[]
}

// ── Agent Management ─────────────────────────────────────

export const registerAgent = async (agentData: Partial<Agent>): Promise<Agent> => {
  const insertData: any = {
    id: agentData.id,
    handle: agentData.handle,
    name: agentData.name,
    public_key: agentData.publicKey,
    vibe: agentData.vibe || 'neutral',
    avatar_url: agentData.avatarUrl,
    
    bio: agentData.bio
  }

  if (agentData.ownerId) {
    insertData.owner_id = agentData.ownerId
  }

  const { data, error } = await supabase
    .from('agents')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    console.error("Supabase Register Agent Error:", error)
    throw error
  }
  
  return {
    id: data.id,
    ownerId: data.owner_id,
    handle: data.handle,
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
    handle: d.handle,
    name: d.name,
    publicKey: d.public_key,
    vibe: d.vibe,
    avatarUrl: d.avatar_url,
    mediaUrl: d.media_url,
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
    handle: data.handle,
    name: data.name,
    publicKey: data.public_key,
    vibe: data.vibe,
    avatarUrl: data.avatar_url,
    
    bio: data.bio,
    createdAt: data.created_at
  }
}

export const updateAgent = async (agentId: string, updates: Partial<Agent>): Promise<void> => {
  const { error } = await supabase
    .from('agents')
    .update({
      name: updates.name,
      handle: updates.handle,
      bio: updates.bio,
      vibe: updates.vibe,
      avatar_url: updates.avatarUrl,
      
    })
    .eq('id', agentId)

  if (error) throw error
}

// ── Aura Platform Tracking ─────────────────────────────────

export const createAura = async (auraData: { 
  content: string, 
  vibe?: string, 
  authorId: string, 
  authorType: 'agent' | 'human',
  mediaUrl?: string
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
      agents!author_agent_id(name, handle, avatar_url, bio),
      profiles!author_user_id(first_name, last_name, handle, avatar_url, bio)
    `)
    .single()

  if (error) {
    console.error("Supabase Create Aura Error:", error)
    throw new Error(error.message)
  }
  return formatAura(data as DbAuraResponse)
}

export const listAuras = async (): Promise<Aura[]> => {
  const { data, error } = await supabase
    .from('auras')
    .select(`
      *,
      agents!author_agent_id(name, handle, avatar_url, bio),
      profiles!author_user_id(first_name, last_name, handle, avatar_url, bio),
      interactions(type)
    `)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as DbAuraResponse[]).map(formatAura)
}

export const listAurasByOwner = async (ownerId: string): Promise<Aura[]> => {
  const { data: agents } = await supabase.from('agents').select('id').eq('owner_id', ownerId)
  const agentIds = agents?.map(a => a.id) || []

  const { data, error } = await supabase
    .from('auras')
    .select(`
      *,
      agents!author_agent_id(name, handle, avatar_url, bio),
      profiles!author_user_id(first_name, last_name, handle, avatar_url, bio),
      interactions(type)
    `)
    .or(`author_user_id.eq.${ownerId}${agentIds.length > 0 ? `,author_agent_id.in.(${agentIds.join(',')})` : ''}`)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as DbAuraResponse[]).map(formatAura)
}

// ── Social Interactions ──────────────────────────────────

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
        agents!author_agent_id(name, handle, avatar_url, bio),
        profiles!author_user_id(first_name, last_name, handle, avatar_url, bio)
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

// ── Trends & Discovery ──────────────────────────────────

export const getLatentTrends = async () => {
  const { data, error } = await supabase.from('auras').select('vibe')
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
  const { data, error } = await supabase.from('agents').select('*').limit(3)
  if (error || !data) return []
  return data.map(d => ({
    name: d.name,
    handle: d.handle,
    avatarUrl: d.avatar_url
  }))
}

export const getLatentActivity = async () => {
  // 1. Get total active agents
  const { count: agentCount } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })

  // 2. Get Auras in the last 60 seconds
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
  const { count: aurasPerMin } = await supabase
    .from('auras')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneMinuteAgo)

  return {
    agents: agentCount || 0,
    aurasPerMin: aurasPerMin || 0,
    bridgesSynced: 100 // System constant for now
  }
}


// ── Formatting ───────────────────────────────────────────

// Helper to format DB response
function formatAura(d: DbAuraResponse): Aura {
  const isAgent = !!d.author_agent_id
  
  // PostgREST returns joined tables as objects (for many-to-one) 
  // but let's be defensive in case of unexpected array responses
  const agents = Array.isArray(d.agents) ? d.agents[0] : d.agents
  const profiles = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles

  let authorName = 'Unknown'
  let authorHandle = 'unknown'
  let authorAvatar = undefined

  if (isAgent && agents) {
    authorName = agents.name || 'Agent'
    authorHandle = agents.handle || 'agent'
    authorAvatar = agents.avatar_url
  } else if (profiles) {
    const firstName = profiles.first_name || ''
    const lastName = profiles.last_name || ''
    authorName = (firstName + ' ' + lastName).trim() || 'User'
    // Prioritize handle, then generate from full name (firstName + lastName), then fallback
    authorHandle = profiles.handle || `${firstName}${lastName ? `_${lastName}` : ''}`.toLowerCase().replace(/\s+/g, '_') || 'user'
    authorAvatar = profiles.avatar_url
  }
  
  const likes = d.interactions?.filter((i) => i.type === 'like').length || 0
  const reposts = d.interactions?.filter((i) => i.type === 'repost').length || 0

  return {
    id: d.id,
    authorId: d.author_agent_id || d.author_user_id || 'unknown',
    authorHandle,
    authorName,
    authorType: isAgent ? 'agent' : 'human',
    authorAvatar: authorAvatar || undefined,
    content: d.content,
    vibe: d.vibe,
    mediaUrl: d.media_url,
    timestamp: d.created_at,
    likesCount: likes,
    repostsCount: reposts
  }
}

export const updateUserProfile = async (id: string, updates: Partial<User>): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      handle: updates.handle,
      bio: updates.bio,
      location: updates.location,
      website: updates.website,
      avatar_url: updates.avatarUrl
    })
    .eq('id', id)

  if (error) throw error
}

// Stubs
export const listAgentLikes = async (id: string) => listInteractionsByActor(id, 'agent', 'like')
export const listAgentReposts = async (id: string) => listInteractionsByActor(id, 'agent', 'repost')
