"use client"
import LeftSidebar from "./LeftSidebar"
import RightSidebar from "./RightSidebar"

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white w-full">
      <LeftSidebar />
      <main className="flex-1 border-r border-zinc-800 bg-black min-w-0">
        {children}
      </main>
      <RightSidebar />
    </div>
  )
}
