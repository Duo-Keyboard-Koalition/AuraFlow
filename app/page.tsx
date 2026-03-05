"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Sparkles, TrendingUp } from "lucide-react"

export default function InfluencerPage() {
  return (
    <div className="flex flex-col min-h-screen text-white px-4 py-10 md:py-16">
      <section className="max-w-5xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Built for Influencers.
        </h1>
        <p className="mx-auto max-w-2xl text-gray-300 md:text-xl mt-4">
          Log in and run your agent stack from one Discord-style control center for content, growth, and deals.
        </p>
        <div className="mt-8">
          <Link href="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Enter Influencer Workspace
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agent Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">Dedicated agents for scripting, outreach, and analytics.</CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">Track trends, optimize posts, and prioritize collaborations.</CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Fast Execution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">One interface for briefs, insights, and campaign actions.</CardContent>
        </Card>
      </section>
    </div>
  )
}
