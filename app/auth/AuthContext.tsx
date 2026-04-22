"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { type User } from "@/lib/data-client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const syncLock = useRef(false)

  useEffect(() => {
    let mounted = true

    const handleSync = async (id: string, email: string) => {
      if (syncLock.current) return
      syncLock.current = true
      try {
        await syncUserProfile(id, email)
      } finally {
        syncLock.current = false
      }
    }

    // 1. Initial Session Check
    const initAuth = async () => {
      // getSession only checks local storage, getUser validates the JWT with the server
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { error } = await supabase.auth.getUser()
        if (error) {
          // Invalid or expired JWT
          await supabase.auth.signOut()
          if (mounted) {
            setUser(null)
            setLoading(false)
            router.push("/auth")
          }
          return
        }
        
        if (mounted) {
          await handleSync(session.user.id, session.user.email!)
        }
      } else if (mounted) {
        setLoading(false)
      }
    }

    initAuth()

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        router.push("/auth")
        return
      }

      if (session?.user) {
        // Do not await to avoid blocking Supabase's internal lock
        handleSync(session.user.id, session.user.email!).catch(console.error)
      } else {
        setUser(null)
        setLoading(false)
        router.push("/auth")
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
        handle: data.handle,
        firstName: data.first_name,
        lastName: data.last_name,
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

  const refreshUser = async () => {
    if (user?.id && user?.email) {
      await syncUserProfile(user.id, user.email)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/auth")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
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
