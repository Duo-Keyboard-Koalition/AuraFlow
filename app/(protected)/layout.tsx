"use client"

import { useAuth } from "@/app/auth/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-af-cyan/20 blur-xl rounded-full animate-pulse"></div>
          <img src="/logo.png" alt="AuraFlow" className="h-20 w-20 relative z-10 animate-pulse" />
        </div>
        <p className="text-af-cyan font-bold tracking-widest animate-pulse text-xs uppercase">Authorizing...</p>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
