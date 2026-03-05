"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  accountType?: "brand" | "influencer"
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, firstName: string, lastName: string, accountType: "brand" | "influencer") => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded demo users for UI testing
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "demo-brand-1",
    email: "brand@example.com",
    password: "password123",
    firstName: "Demo",
    lastName: "Brand",
    accountType: "brand",
  },
  {
    id: "demo-influencer-1",
    email: "influencer@example.com",
    password: "password123",
    firstName: "Demo",
    lastName: "Influencer",
    accountType: "influencer",
  },
]

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("auth_user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check against demo users
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    // Allow any email/password for UI testing (mock success)
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName: email.split("@")[0],
      lastName: "",
      accountType: "brand", // default
    }
    setUser(mockUser)
    localStorage.setItem("auth_user", JSON.stringify(mockUser))
    return { success: true }
  }

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    accountType: "brand" | "influencer"
  ) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      accountType,
    }
    setUser(newUser)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    return { success: true }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut }}>
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
