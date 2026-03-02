"use client"

import "@/amplify" // Import Amplify configuration first
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, fetchUserAttributes, signOut as amplifySignOut } from '@aws-amplify/auth';

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  accountType?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        const userData: User = {
          id: currentUser.userId,
          email: attributes.email || '',
          firstName: attributes.given_name,
          lastName: attributes.family_name,
          accountType: attributes['custom:accountType'] as 'brand' | 'influencer',
        };
        
        setUser(userData);
      } catch (error) {
        console.log('No authenticated user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signOut }}>
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
