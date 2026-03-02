"use client"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, Zap } from "lucide-react"

export default function AuraSightPage() {
  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-sm bg-black/30">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Image src="/logo.png" alt="AuraSight Logo" width={40} height={40} />
          <span className="ml-3 text-2xl font-bold">AuraSight</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            For Brands
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            For Influencers
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
        </nav>
        <div className="ml-6">
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Unlock Authentic Connections.
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl mt-4">
            AuraSight is the revolutionary platform that matches brands and influencers based on their true vibe and
            audience synergy. Go beyond metrics, and connect on a deeper level.
          </p>
          <div className="mt-8">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Find Your Perfect Match
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How AuraSight Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-500/20 rounded-full mb-4">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Define Your Aura</h3>
              <p className="text-gray-400">
                Brands define their core identity and values. Influencers showcase their unique personality and content
                vibe.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-purple-500/20 rounded-full mb-4">
                <BarChart className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI-Powered Vibe Analysis</h3>
              <p className="text-gray-400">
                Our advanced AI analyzes content, audience sentiment, and aesthetic to create a unique "Aura Profile"
                for each user.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-500/20 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Discover Synergistic Matches</h3>
              <p className="text-gray-400">
                Receive a curated list of potential partners whose auras align perfectly with yours, ensuring authentic
                collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Features Designed for Authentic Partnerships
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Move beyond follower counts and vanity metrics. Focus on what truly matters: genuine connection.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Deep Vibe Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our AI understands the nuances of content style, tone, and audience perception.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Audience Synergy Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We predict how well an influencer's audience will resonate with your brand's message.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Authenticity Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our matching algorithm prioritizes genuine alignment to prevent inauthentic partnerships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Find Your Vibe?</h2>
            <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join AuraSight today and start building partnerships that are not just effective, but also authentic and
              meaningful.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-gray-800 border-gray-700"
              />
              <Button type="submit">Get Early Access</Button>
            </form>
            <p className="text-xs text-gray-500">Sign up to get notified when we launch.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">&copy; 2024 AuraSight. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
