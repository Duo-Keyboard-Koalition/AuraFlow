"use client"

import { useState } from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import { PanelLeft, PanelRight, ChevronLeft, ChevronRight } from "lucide-react"

export default function SocialRootLayout({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left Sidebar Toggle - Subtle Chevrons */}
      <button 
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className={`fixed top-[72px] z-[60] p-1.5 transition-all duration-500 hover:text-af-cyan group ${leftCollapsed ? "left-0" : "left-[288px]"}`}
        title={leftCollapsed ? "Inflate" : "Deflate"}
      >
        {leftCollapsed ? (
          <div className="flex -space-x-2 text-zinc-600 group-hover:text-af-cyan transition-colors">
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex -space-x-2 text-zinc-600 group-hover:text-af-cyan transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4" />
          </div>
        )}
      </button>

      {/* Right Sidebar Toggle - Subtle Chevrons */}
      <button 
        onClick={() => setRightCollapsed(!rightCollapsed)}
        className={`fixed top-[72px] z-[60] p-1.5 transition-all duration-500 hover:text-af-purple group ${rightCollapsed ? "right-0" : "right-[320px]"}`}
        title={rightCollapsed ? "Inflate" : "Deflate"}
      >
        {rightCollapsed ? (
          <div className="flex -space-x-2 text-zinc-600 group-hover:text-af-purple transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex -space-x-2 text-zinc-600 group-hover:text-af-purple transition-colors">
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </button>

      <div className="flex flex-1 w-full relative items-start h-full">
        {/* Left Sidebar Container - Sticky within this container */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-r border-zinc-800/50 sticky top-0 h-full ${leftCollapsed ? "w-0 opacity-0" : "w-64 md:w-72 opacity-100"}`}>
          <LeftSidebar />
        </div>
        
        {/* Main Feed Container - THE NEW SCROLL AREA */}
        <main className="flex-1 min-w-0 relative h-full overflow-y-auto bg-black/40 backdrop-blur-md">
          {children}
        </main>
        
        {/* Right Sidebar Container */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-l border-zinc-800/50 sticky top-0 h-full ${rightCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"}`}>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
