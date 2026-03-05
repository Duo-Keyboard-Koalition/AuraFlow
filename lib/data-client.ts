"use client"

// Stub data client for UI development
// This is a placeholder until backend integration

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  accountType?: "brand" | "influencer"
  createdAt?: string
  updatedAt?: string
}

export interface Influencer {
  id: string
  userId: string
  displayName: string
  bio?: string
  location?: string
  website?: string
  platforms?: string
  followerCount?: string
  contentCategories?: string
  personalValues?: string
  contentStyle?: string
  audienceAge?: string
  audienceGender?: string
  profileImage?: string
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Brand {
  id: string
  userId: string
  companyName: string
  displayName: string
  bio?: string
  location?: string
  website?: string
  industry?: string
  companySize?: string
  brandValues?: string
  missionStatement?: string
  targetAudience?: string
  logo?: string
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MatchRequest {
  id: string
  userId: string
  brandId: string
  influencerId: string
  status?: "pending" | "processing" | "completed" | "failed"
  brandValues?: string
  missionStatement?: string
  targetEmotion?: string
  results?: string
  createdAt?: string
  updatedAt?: string
}

// Mock data for UI development
const mockUsers: User[] = []
const mockInfluencers: Influencer[] = []
const mockBrands: Brand[] = []
const mockMatchRequests: MatchRequest[] = []

// Helper functions for User operations
export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  const user: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockUsers.push(user)
  return user
}

export const getUser = async (id: string): Promise<User | null> => {
  return mockUsers.find(u => u.id === id) || null
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) return null
  mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date().toISOString() }
  return mockUsers[index]
}

// Helper functions for Influencer operations
export const createInfluencer = async (influencerData: Omit<Influencer, "id" | "createdAt" | "updatedAt">): Promise<Influencer> => {
  const influencer: Influencer = {
    ...influencerData,
    id: `influencer-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockInfluencers.push(influencer)
  return influencer
}

export const getInfluencer = async (id: string): Promise<Influencer | null> => {
  return mockInfluencers.find(i => i.id === id) || null
}

export const listInfluencers = async (): Promise<Influencer[]> => {
  return mockInfluencers
}

export const updateInfluencer = async (id: string, updates: Partial<Influencer>): Promise<Influencer | null> => {
  const index = mockInfluencers.findIndex(i => i.id === id)
  if (index === -1) return null
  mockInfluencers[index] = { ...mockInfluencers[index], ...updates, updatedAt: new Date().toISOString() }
  return mockInfluencers[index]
}

// Helper functions for Brand operations
export const createBrand = async (brandData: Omit<Brand, "id" | "createdAt" | "updatedAt">): Promise<Brand> => {
  const brand: Brand = {
    ...brandData,
    id: `brand-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockBrands.push(brand)
  return brand
}

export const getBrand = async (id: string): Promise<Brand | null> => {
  return mockBrands.find(b => b.id === id) || null
}

export const listBrands = async (): Promise<Brand[]> => {
  return mockBrands
}

export const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand | null> => {
  const index = mockBrands.findIndex(b => b.id === id)
  if (index === -1) return null
  mockBrands[index] = { ...mockBrands[index], ...updates, updatedAt: new Date().toISOString() }
  return mockBrands[index]
}

// Helper functions for MatchRequest operations
export const createMatchRequest = async (matchData: Omit<MatchRequest, "id" | "createdAt" | "updatedAt">): Promise<MatchRequest> => {
  const matchRequest: MatchRequest = {
    ...matchData,
    id: `match-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockMatchRequests.push(matchRequest)
  return matchRequest
}

export const getMatchRequest = async (id: string): Promise<MatchRequest | null> => {
  return mockMatchRequests.find(m => m.id === id) || null
}

export const listMatchRequests = async (): Promise<MatchRequest[]> => {
  return mockMatchRequests
}

export const updateMatchRequest = async (id: string, updates: Partial<MatchRequest>): Promise<MatchRequest | null> => {
  const index = mockMatchRequests.findIndex(m => m.id === id)
  if (index === -1) return null
  mockMatchRequests[index] = { ...mockMatchRequests[index], ...updates, updatedAt: new Date().toISOString() }
  return mockMatchRequests[index]
}
