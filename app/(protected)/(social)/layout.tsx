"use client"

import { useState } from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import { PanelLeft, PanelRight } from "lucide-react"

export default function SocialRootLayout({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left Sidebar Toggle - Fixed at the top below Navbar */}
      <button 
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        className={`fixed top-[74px] z-[60] p-2.5 rounded-r-xl bg-black/40 border border-l-0 border-zinc-800/50 text-af-cyan backdrop-blur-xl hover:bg-af-cyan/10 transition-all duration-300 shadow-2xl hidden md:flex items-center justify-center ${leftCollapsed ? "left-0" : "left-[288px] md:left-[288px]"}`}
        style={{ left: leftCollapsed ? "0" : "288px" }}
        title={leftCollapsed ? "Inflate Trends" : "Deflate Trends"}
      >
        <PanelLeft className={`h-4.5 w-4.5 transition-transform duration-500 ${leftCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Right Sidebar Toggle - Fixed at the top below Navbar */}
      <button 
        onClick={() => setRightCollapsed(!rightCollapsed)}
        className={`fixed top-[74px] z-[60] p-2.5 rounded-l-xl bg-black/40 border border-r-0 border-zinc-800/50 text-af-purple backdrop-blur-xl hover:bg-af-purple/10 transition-all duration-300 shadow-2xl hidden lg:flex items-center justify-center ${rightCollapsed ? "right-0" : "right-[320px]"}`}
        style={{ right: rightCollapsed ? "0" : "320px" }}
        title={rightCollapsed ? "Inflate Discovery" : "Deflate Discovery"}
      >
        <PanelRight className={`h-4.5 w-4.5 transition-transform duration-500 ${rightCollapsed ? "-rotate-180" : ""}`} />
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
