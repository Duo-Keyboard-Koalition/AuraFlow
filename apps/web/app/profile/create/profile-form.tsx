"use client"
import { useState } from "react"
import { createProfile } from "@/app/actions/profile"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileData {
  userId: string
  displayName: string
  bio?: string
  location?: string
  website?: string
  accountType: 'brand' | 'influencer' | string
  companyName?: string
  industry?: string
  companySize?: string
  brandValues?: string[]
  missionStatement?: string
  targetAudience?: string
  platforms?: string[]
  followerCount?: string
  contentCategories?: string[]
  personalValues?: string[]
  contentStyle?: string
  audienceAge?: string
  audienceGender?: string
}

export default function ProfileForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [accountType, setAccountType] = useState<'brand' | 'influencer'>('influencer')

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await createProfile(null, formData)
      if (result?.errors) {
        const errorMessages = Object.values(result.errors).flat()
        setError(errorMessages.join(", "))
      } else if (result?.success) {
        setSuccess(result.message || "Profile created successfully!")
      } else if (result?.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your {accountType === 'brand' ? 'Brand' : 'Influencer'} Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="accountType" value={accountType} />

            {/* Account Type Selection */}
            <div>
              <Label htmlFor="accountType" className="text-muted-foreground">
                Account Type
              </Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={accountType === 'influencer' ? 'default' : 'outline'}
                  onClick={() => setAccountType('influencer')}
                >
                  Influencer
                </Button>
                <Button
                  type="button"
                  variant={accountType === 'brand' ? 'default' : 'outline'}
                  onClick={() => setAccountType('brand')}
                >
                  Brand
                </Button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-muted-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-muted-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                className="min-h-[100px] bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-muted-foreground">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, Country"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-muted-foreground">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Brand-specific fields */}
            {accountType === 'brand' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-muted-foreground">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter your company name"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-muted-foreground">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder="e.g., Technology, Fashion, Food"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companySize" className="text-muted-foreground">
                    Company Size
                  </Label>
                  <Input
                    id="companySize"
                    name="companySize"
                    placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="brandValues" className="text-muted-foreground">
                    Brand Values (comma-separated)
                  </Label>
                  <Input
                    id="brandValues"
                    name="brandValues"
                    placeholder="e.g., Sustainability, Innovation, Community"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="missionStatement" className="text-muted-foreground">
                    Mission Statement
                  </Label>
                  <Textarea
                    id="missionStatement"
                    name="missionStatement"
                    placeholder="Describe your brand's mission and purpose"
                    className="min-h-[100px] bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience" className="text-muted-foreground">
                    Target Audience
                  </Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    placeholder="e.g., Young professionals, Parents, Tech enthusiasts"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </>
            )}

            {/* Influencer-specific fields */}
            {accountType === 'influencer' && (
              <>
                <div>
                  <Label htmlFor="platforms" className="text-muted-foreground">
                    Platforms (comma-separated)
                  </Label>
                  <Input
                    id="platforms"
                    name="platforms"
                    placeholder="e.g., Instagram, TikTok, YouTube, Twitter"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="followerCount" className="text-muted-foreground">
                      Follower Count
                    </Label>
                    <Input
                      id="followerCount"
                      name="followerCount"
                      placeholder="e.g., 10K, 100K, 1M+"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentStyle" className="text-muted-foreground">
                      Content Style
                    </Label>
                    <Input
                      id="contentStyle"
                      name="contentStyle"
                      placeholder="e.g., Educational, Entertaining, Lifestyle"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contentCategories" className="text-muted-foreground">
                    Content Categories (comma-separated)
                  </Label>
                  <Input
                    id="contentCategories"
                    name="contentCategories"
                    placeholder="e.g., Fashion, Beauty, Travel, Food, Tech"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="personalValues" className="text-muted-foreground">
                    Personal Values (comma-separated)
                  </Label>
                  <Input
                    id="personalValues"
                    name="personalValues"
                    placeholder="e.g., Authenticity, Creativity, Sustainability"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audienceAge" className="text-muted-foreground">
                      Primary Audience Age
                    </Label>
                    <Input
                      id="audienceAge"
                      name="audienceAge"
                      placeholder="e.g., 18-24, 25-34, 35-44"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audienceGender" className="text-muted-foreground">
                      Primary Audience Gender
                    </Label>
                    <Input
                      id="audienceGender"
                      name="audienceGender"
                      placeholder="e.g., Female, Male, All"
                      className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>

            {success && (
              <div className="bg-green-900 border border-green-600 text-green-200 p-4 rounded-md">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-900 border border-red-600 text-red-200 p-4 rounded-md">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
