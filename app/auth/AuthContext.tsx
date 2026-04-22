"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { type User } from "@/lib/data-client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1. Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          await syncUserProfile(session.user.id, session.user.email!)
        } else {
          setLoading(false)
        }
      } catch (err: any) {
        // If session is invalid (e.g. after DB reset), clear it
        if (err.message?.includes("Refresh Token Not Found") || err.status === 400) {
          await supabase.auth.signOut()
          setUser(null)
        }
        setLoading(false)
      }
    }

    initAuth()

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        return
      }

      if (session?.user) {
        await syncUserProfile(session.user.id, session.user.email!)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Helper to fetch the extended profile data from our 'profiles' table
  const syncUserProfile = async (id: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        accountType: data.account_type,
        avatarUrl: data.avatar_url,
        bio: data.bio
      })
    } else {
      // Fallback/Self-healing: if profile doesn't exist, try to create it
      // This handles cases where the DB trigger might have failed (e.g. handle collision)
      const handle = email.split('@')[0]
      const { data: newData, error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id, 
          email, 
          handle: `${handle}_${Math.floor(Math.random() * 1000)}`, // Simple unique handle fallback
          first_name: handle
        }])
        .select()
        .single()

      if (!insertError && newData) {
        setUser({
          id: newData.id,
          email: newData.email,
          firstName: newData.first_name,
          handle: newData.handle
        })
      } else {
        setUser({ id, email })
      }
    }
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
