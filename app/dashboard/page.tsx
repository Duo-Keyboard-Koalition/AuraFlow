"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Brand {
  id: string
  userId: string
  companyName: string
  displayName: string
  industry: string
  brandValues: string
}

interface Influencer {
  id: string
  userId: string
  displayName: string
  contentCategories: string
  personalValues: string
}

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const [profileType, setProfileType] = useState("brand")
  const [displayName, setDisplayName] = useState("")
  const [details, setDetails] = useState("")
  const [aura, setAura] = useState("")

  // Mock data for UI demonstration
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: "1",
      userId: "demo",
      companyName: "TechFlow",
      displayName: "TechFlow",
      industry: "Technology",
      brandValues: "Innovative, Modern, Trustworthy",
    },
  ])
  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: "1",
      userId: "demo",
      displayName: "Alex Creator",
      contentCategories: "Tech Reviews, Lifestyle",
      personalValues: "Authentic, Energetic, Educational",
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const createProfile = async () => {
    if (!displayName || !details || !aura) return

    if (profileType === "brand") {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        userId: user?.id || "demo",
        companyName: displayName,
        displayName,
        industry: details,
        brandValues: aura,
      }
      setBrands([...brands, newBrand])
    } else {
      const newInfluencer: Influencer = {
        id: `influencer-${Date.now()}`,
        userId: user?.id || "demo",
        displayName,
        contentCategories: details,
        personalValues: aura,
      }
      setInfluencers([...influencers, newInfluencer])
    }
    setDisplayName("")
    setDetails("")
    setAura("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-sm bg-black/30">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Image src="/logo.png" alt="AuraSight Logo" width={40} height={40} />
          <span className="ml-3 text-2xl font-bold">AuraSight</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/match" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Find Matches
          </Link>
          <Link href="/results" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            View Results
          </Link>
        </nav>
        <div className="ml-6">
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24 md:px-6 flex-grow">
        <h1 className="text-4xl font-bold mb-4">
          Welcome, {user?.firstName || user?.email?.split("@")[0]}!
        </h1>
        <p className="text-gray-400 mb-8">Manage your profiles and find your perfect match.</p>

        <Tabs defaultValue="brand" className="w-full" onValueChange={setProfileType}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="brand" className="data-[state=active]:bg-purple-600">I am a Brand</TabsTrigger>
            <TabsTrigger value="influencer" className="data-[state=active]:bg-purple-600">I am an Influencer</TabsTrigger>
          </TabsList>
          <TabsContent value="brand">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Create Your Brand Profile</CardTitle>
                <CardDescription className="text-gray-400">Let influencers know what your brand is all about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand-name" className="text-white">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-white">Industry</Label>
                  <Input
                    id="industry"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="brand-aura" className="text-white">Brand Aura</Label>
                  <Input
                    id="brand-aura"
                    placeholder="e.g., Energetic, Minimalist, Luxurious"
                    value={aura}
                    onChange={(e) => setAura(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button onClick={createProfile} className="bg-purple-600 hover:bg-purple-700">
                  Create Brand Profile
                </Button>
              </CardContent>
            </Card>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Your Brands</h3>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <div key={brand.id} className="p-4 border border-gray-700 rounded-md mb-2 bg-gray-800">
                    <p className="font-bold text-lg">{brand.displayName}</p>
                    <p className="text-sm text-gray-400">Industry: {brand.industry}</p>
                    <p className="text-sm text-gray-400">Aura: {brand.brandValues}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No brand profiles yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="influencer">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Create Your Influencer Profile</CardTitle>
                <CardDescription className="text-gray-400">Showcase your unique vibe to brands.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="influencer-name" className="text-white">Your Name</Label>
                  <Input
                    id="influencer-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="niche" className="text-white">Niche</Label>
                  <Input
                    id="niche"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="influencer-aura" className="text-white">Your Vibe</Label>
                  <Input
                    id="influencer-aura"
                    placeholder="e.g., Quirky, Adventurous, Calming"
                    value={aura}
                    onChange={(e) => setAura(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button onClick={createProfile} className="bg-purple-600 hover:bg-purple-700">
                  Create Influencer Profile
                </Button>
              </CardContent>
            </Card>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Your Influencer Profiles</h3>
              {influencers.length > 0 ? (
                influencers.map((influencer) => (
                  <div key={influencer.id} className="p-4 border border-gray-700 rounded-md mb-2 bg-gray-800">
                    <p className="font-bold text-lg">{influencer.displayName}</p>
                    <p className="text-sm text-gray-400">Niche: {influencer.contentCategories}</p>
                    <p className="text-sm text-gray-400">Vibe: {influencer.personalValues}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No influencer profiles yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
