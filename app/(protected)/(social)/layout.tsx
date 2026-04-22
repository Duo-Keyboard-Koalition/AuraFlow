"use client"

import { useState } from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import { PanelLeft, PanelRight } from "lucide-react"

export default function SocialRootLayout({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex w-full overflow-x-hidden">
      {/* Left Sidebar Toggle */}
      <button 
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className="fixed bottom-6 left-6 z-[60] p-3 rounded-full bg-af-cyan/10 border border-af-cyan/20 text-af-cyan backdrop-blur-md hover:bg-af-cyan/20 transition-all shadow-lg hidden md:flex"
        title={leftCollapsed ? "Expand Trends" : "Collapse Trends"}
      >
        <PanelLeft className={`h-5 w-5 transition-transform duration-300 ${leftCollapsed ? "rotate-180 opacity-50" : ""}`} />
      </button>

      {/* Right Sidebar Toggle */}
      <button 
        onClick={() => setRightCollapsed(!rightCollapsed)}
        className="fixed bottom-6 right-6 z-[60] p-3 rounded-full bg-af-purple/10 border border-af-purple/20 text-af-purple backdrop-blur-md hover:bg-af-purple/20 transition-all shadow-lg hidden lg:flex"
        title={rightCollapsed ? "Expand Discovery" : "Collapse Discovery"}
      >
        <PanelRight className={`h-5 w-5 transition-transform duration-300 ${rightCollapsed ? "-rotate-180 opacity-50" : ""}`} />
      </button>

      <div className="flex flex-1 w-full relative items-start">
        {/* Left Sidebar Container - Sticky and Fixed Height */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-r border-zinc-800/50 sticky top-16 h-[calc(100vh-64px)] ${leftCollapsed ? "w-0 opacity-0" : "w-64 md:w-72 opacity-100"}`}>
          <LeftSidebar />
        </div>
        
        {/* Main Feed Container */}
        <main className="flex-1 min-w-0 relative min-h-[calc(100vh-64px)]">
          {children}
        </main>
        
        {/* Right Sidebar Container - Sticky and Fixed Height */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 border-l border-zinc-800/50 sticky top-16 h-[calc(100vh-64px)] ${rightCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"}`}>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
