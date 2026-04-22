"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { User, Bot, Search, Loader2 } from "lucide-react"
import AuraLoader from "@/components/AuraLoader"

interface InfluencerMatch {
  id?: number | string
  name: string
  auraScore?: number
  vibeScore?: number
  description?: string
  details?: string
  keywords?: string[]
  values?: string[]
  platforms?: string[] | string
  platform?: string
  followers: string
  image?: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<InfluencerMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedResults = localStorage.getItem("matchResults")
    const matchError = localStorage.getItem("matchError")
    
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (e) {
        console.error("Failed to parse stored results", e)
      }
    } else {
      // Fallback
      setResults([
        { id: 1, name: "Influencer A", auraScore: 92, description: "Fashion and lifestyle influencer.", followers: "500K" },
        { id: 2, name: "Influencer B", auraScore: 88, description: "Tech reviewer.", followers: "1.2M" },
      ])
    }
    
    if (matchError) {
      setError(matchError)
      localStorage.removeItem("matchError")
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="p-20 flex justify-center w-full">
        <AuraLoader size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-af-border-subtle pb-6">
        <h1 className="text-3xl font-black af-text-gradient">Top Matches</h1>
        <Link href="/match">
          <Button variant="outline" className="border-af-border-subtle rounded-full h-9 font-bold text-xs uppercase tracking-widest">New Match</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md mb-8 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((influencer, idx) => (
          <Card key={influencer.id || idx} className="af-panel border-af-border-subtle bg-af-surface-1/20 hover:border-af-cyan/30 transition-all group overflow-hidden">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-af-border mb-4">
                <Image alt={influencer.name} height="100" src={influencer.image || "/placeholder-user.jpg"} width="100" className="object-cover h-full w-full" />
              </div>
              <CardTitle className="text-af-text-primary">{influencer.name}</CardTitle>
              <CardDescription className="text-af-cyan font-black uppercase text-[10px] tracking-widest">
                Match Alignment: {influencer.auraScore || influencer.vibeScore || 0}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-af-text-secondary text-center line-clamp-2">{influencer.description || influencer.details}</p>
              <div className="flex justify-center flex-wrap gap-2">
                {(influencer.keywords || influencer.values || []).slice(0, 3).map((keyword) => (
                  <Badge key={keyword} variant="outline" className="bg-af-cyan/5 border-af-cyan/20 text-af-cyan text-[9px] uppercase font-black">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <Button className="w-full af-btn-primary rounded-full h-10 font-bold uppercase text-[10px] tracking-widest">View Profile</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
