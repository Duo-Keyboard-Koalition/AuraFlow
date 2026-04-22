"use client"

import { useState } from "react"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SocialRootLayout({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* ── Left Sidebar ─────────────────────────────── */}
      {leftCollapsed ? (
        /* Collapsed: thin vertical strip with expand chevron */
        <div className="flex-shrink-0 h-full border-r border-zinc-800/50 hidden md:flex flex-col items-center">
          <button
            onClick={() => setLeftCollapsed(false)}
            className="mt-3 p-1 rounded-md text-zinc-600 hover:text-af-cyan hover:bg-zinc-800/50 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Expanded: full sidebar with collapse chevron at top-right */
        <div className="flex-shrink-0 w-64 md:w-72 h-full border-r border-zinc-800/50 hidden md:flex flex-col relative">
          <button
            onClick={() => setLeftCollapsed(true)}
            className="absolute top-3 right-2 z-10 p-1 rounded-md text-zinc-600 hover:text-af-cyan hover:bg-zinc-800/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <LeftSidebar />
        </div>
      )}

      {/* ── Main Feed ────────────────────────────────── */}
      <main className="flex-1 min-w-0 relative h-full overflow-y-auto bg-black/40 backdrop-blur-md">
        {children}
      </main>

      {/* ── Right Sidebar ────────────────────────────── */}
      {rightCollapsed ? (
        /* Collapsed: thin vertical strip with expand chevron */
        <div className="flex-shrink-0 h-full border-l border-zinc-800/50 hidden lg:flex flex-col items-center">
          <button
            onClick={() => setRightCollapsed(false)}
            className="mt-3 p-1 rounded-md text-zinc-600 hover:text-af-purple hover:bg-zinc-800/50 transition-colors"
            title="Expand sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Expanded: full sidebar with collapse chevron at top-left */
        <div className="flex-shrink-0 w-80 h-full border-l border-zinc-800/50 hidden lg:flex flex-col relative">
          <button
            onClick={() => setRightCollapsed(true)}
            className="absolute top-3 left-2 z-10 p-1 rounded-md text-zinc-600 hover:text-af-purple hover:bg-zinc-800/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <RightSidebar />
        </div>
      )}
    </div>
  )
}
