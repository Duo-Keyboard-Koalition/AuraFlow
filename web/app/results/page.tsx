import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ResultsPage() {
  const mockResults = [
    {
      id: 1,
      name: "Influencer A",
      auraScore: 92,
      description: "Fashion and lifestyle influencer with a vibrant and authentic aura.",
      keywords: ["fashion", "lifestyle", "travel"],
      platforms: ["Instagram", "TikTok"],
      followers: "500K",
      image: "/placeholder-user.jpg",
    },
    {
      id: 2,
      name: "Influencer B",
      auraScore: 88,
      description: "Tech reviewer and gaming enthusiast with a highly engaged audience.",
      keywords: ["tech", "gaming", "reviews"],
      platforms: ["YouTube", "Twitch"],
      followers: "1.2M",
      image: "/placeholder-user.jpg",
    },
    {
      id: 3,
      name: "Influencer C",
      auraScore: 95,
      description: "Eco-conscious advocate focusing on sustainable living and ethical brands.",
      keywords: ["sustainability", "eco-friendly", "wellness"],
      platforms: ["Instagram", "Blog"],
      followers: "250K",
      image: "/placeholder-user.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Your Top Matches</h1>
      <p className="text-center text-muted-foreground mb-12">
        Based on your preferences, here are the influencers with the highest aura alignment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResults.map((influencer) => (
          <Card key={influencer.id} className="bg-card/80 backdrop-blur-sm border border-border">
            <CardHeader className="flex flex-col items-center text-center">
              <Image
                alt={influencer.name}
                className="rounded-full mb-4"
                height="100"
                src={influencer.image || "/placeholder.svg"}
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="100"
              />
              <CardTitle className="text-foreground">{influencer.name}</CardTitle>
              <CardDescription className="text-muted-foreground">Aura Score: {influencer.auraScore}%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{influencer.description}</p>
              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-primary/20 text-primary-foreground">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">Platforms:</h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="border-primary text-primary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Followers: {influencer.followers}</p>
              <Button className="w-full mt-4">View Profile</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
