import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./auth/AuthContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Influencer Workspace",
  description: "Influencer-first workspace powered by specialized agents.",
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
          <div className="relative flex flex-col min-h-screen af-shell">
            <div className="absolute top-0 left-0 w-full h-full af-bg-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-[50vh] af-top-glow"></div>
            <main className="relative z-10 flex-grow">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
