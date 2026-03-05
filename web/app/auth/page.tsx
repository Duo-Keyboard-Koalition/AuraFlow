"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpFirstName, setSignUpFirstName] = useState("")
  const [signUpLastName, setSignUpLastName] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await signIn(signInEmail, signInPassword)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Failed to sign in")
    }
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await signUp(signUpEmail, signUpPassword, signUpFirstName, signUpLastName, "influencer")

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Failed to sign up")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold af-text-gradient">Influencer Workspace</h1>
          <p className="text-gray-400 mt-2">Create your profile, run agents, and grow your campaigns</p>
        </div>

        <Card className="af-panel-soft">
          <CardHeader>
            <CardTitle className="text-white">Welcome</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in or create your influencer account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="signin" className="af-tab-trigger">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="af-tab-trigger">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full af-btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-gray-300">
                    <p className="font-semibold mb-1">Demo Credentials:</p>
                    <p>Influencer: influencer@example.com / password123</p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname" className="text-white">First Name</Label>
                      <Input
                        id="firstname"
                        placeholder="John"
                        value={signUpFirstName}
                        onChange={(e) => setSignUpFirstName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastname" className="text-white">Last Name</Label>
                      <Input
                        id="lastname"
                        placeholder="Doe"
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full af-btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
