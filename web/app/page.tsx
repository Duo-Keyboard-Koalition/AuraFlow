"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Sparkles, TrendingUp } from "lucide-react"

export default function InfluencerPage() {
  return (
    <div className="flex flex-col min-h-screen text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-sm bg-black/30 border-b border-gray-800">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <span className="text-2xl font-bold">AuraFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#workflows" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Workflows
          </Link>
          <Link href="#bridge" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Bridge
          </Link>
        </nav>
        <div className="ml-6">
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto w-full text-center px-4 py-10 md:py-16">
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

      <section id="features" className="max-w-5xl mx-auto w-full mt-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <section id="workflows" className="max-w-5xl mx-auto w-full px-4 py-12 text-center text-gray-300">
        <p>Use Discord-style servers and channels to organize creator workflows, while connecting external agents through the bridge layer.</p>
      </section>

      <section id="bridge" className="max-w-5xl mx-auto w-full px-4 pb-16 text-center text-gray-400">
        <p>AuraFlow Bridge is agent-agnostic: connect scorpion, nanobot, openclaw, and other runtimes without hardwiring AuraFlow into their cores.</p>
      </section>
    </div>
  )
}
