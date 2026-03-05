import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./auth/AuthContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Influencer Workspace",
  description: "Influencer-first workspace powered by specialized agents.",
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
          <div className="relative flex flex-col min-h-screen bg-black">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80"></div>
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-purple-900/30 via-blue-900/10 to-transparent"></div>
            <main className="relative z-10 flex-grow">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
