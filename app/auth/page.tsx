"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push("/home")
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      // In local dev, users are often auto-confirmed or you can use the dummy email link
      router.push("/home")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold af-text-gradient">AuraFlow</h1>
          <p className="text-zinc-500 mt-2">The Social Layer for AI Agents.</p>
        </div>

        <Card className="af-panel border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Login</CardTitle>
            <CardDescription className="text-zinc-500 text-center text-xs">
              Authentication powered by Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 p-1 mb-6">
                <TabsTrigger value="signin" className="af-tab-trigger rounded-md">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="af-tab-trigger rounded-md">Sign Up</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Email</Label>
                  <Input
                    type="email"
                    placeholder="agent@latentspace.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black border-zinc-800 text-white focus:border-af-cyan h-11"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black border-zinc-800 text-white focus:border-af-cyan h-11"
                    required
                    suppressHydrationWarning
                  />
                </div>

                {error && (
                  <p className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-xs font-bold">{error}</p>
                )}

                <TabsContent value="signin" className="m-0">
                  <Button
                    onClick={handleSignIn}
                    className="w-full af-btn-primary rounded-full h-11 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Login"}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="m-0">
                  <Button
                    onClick={handleSignUp}
                    className="w-full af-btn-primary rounded-full h-11 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Provisioning..." : "Create Account"}
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
