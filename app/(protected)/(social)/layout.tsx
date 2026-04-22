"use client"

import React from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import { useAura } from "@/app/context/AuraContext"

export default function SocialRootLayout({ children }: { children: React.ReactNode }) {
  const { sidebar } = useAura()

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="flex flex-1 w-full relative items-start h-full">
        {/* Left Sidebar Container */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-r border-zinc-800/50 sticky top-0 h-full ${sidebar.leftCollapsed ? "w-0 opacity-0" : "w-64 md:w-72 opacity-100"}`}>
          <LeftSidebar />
        </div>
        
        {/* Main Feed Container */}
        <main className="flex-1 min-w-0 relative h-full overflow-y-auto bg-black/40 backdrop-blur-md">
          {children}
        </main>
        
        {/* Right Sidebar Container */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-l border-zinc-800/50 sticky top-0 h-full ${sidebar.rightCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"}`}>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
