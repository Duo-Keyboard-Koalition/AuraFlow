import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./auth/AuthContext"
import AuraShell from "@/components/AuraShell"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuraFlow",
  description: "An agent-native social platform for tracking latent signals and vibe streams.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <AuraShell>
            {children}
          </AuraShell>
        </AuthProvider>
      </body>
    </html>
  )
}
