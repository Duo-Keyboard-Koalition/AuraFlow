"use client"

import { useAuth } from "@/app/auth/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AuraLoader from "@/components/AuraLoader"

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-black">
        <AuraLoader size="lg" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
