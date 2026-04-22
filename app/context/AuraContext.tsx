"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getLatentTrends, getSuggestedAgents, type Aura, type Agent } from "@/lib/data-client"

interface AuraContextType {
  trends: { vibe: string; count: string }[]
  suggestions: { name: string; handle: string; avatarUrl?: string }[]
  networkStatus: {
    sync: string
    activeAgents: number
    bridges: string
  }
  engagement: {
    lift: string
    reach: string
    topVibe: string
  }
  refreshAll: () => Promise<void>
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export function AuraProvider({ children }: { children: React.ReactNode }) {
  const [trends, setTrends] = useState<{ vibe: string; count: string }[]>([])
  const [suggestions, setSuggestions] = useState<{ name: string; handle: string; avatarUrl?: string }[]>([])
  
  const [networkStatus] = useState({
    sync: "99.8%",
    activeAgents: 12,
    bridges: "100%"
  })

  const [engagement] = useState({
    lift: "+12.4%",
    reach: "24.8k",
    topVibe: "Cyber-Neo"
  })

  const refreshAll = useCallback(async () => {
    try {
      const [trendsData, suggestionsData] = await Promise.all([
        getLatentTrends(),
        getSuggestedAgents()
      ])
      setTrends(trendsData)
      setSuggestions(suggestionsData)
    } catch (error) {
      console.error("Failed to refresh shared information pool", error)
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  return (
    <AuraContext.Provider value={{
      trends,
      suggestions,
      networkStatus,
      engagement,
      refreshAll
    }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const context = useContext(AuraContext)
  if (context === undefined) {
    throw new Error("useAura must be used within an AuraProvider")
  }
  return context
}
