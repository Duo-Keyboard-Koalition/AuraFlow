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
        <div className="flex-shrink-0 h-full border-r border-af-border-subtle hidden md:flex flex-col items-center pt-2">
          <button
            onClick={() => setLeftCollapsed(false)}
            className="p-1.5 rounded-md text-af-text-secondary hover:text-white hover:bg-af-surface-2 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-shrink-0 w-64 md:w-72 h-full border-r border-af-border-subtle hidden md:flex flex-col bg-af-surface-0">
          <div className="flex items-center justify-end px-2 py-2 flex-shrink-0">
            <button
              onClick={() => setLeftCollapsed(true)}
              className="p-1.5 rounded-md text-af-text-secondary hover:text-white hover:bg-af-surface-2 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <LeftSidebar />
          </div>
        </div>
      )}

      {/* ── Main Feed ────────────────────────────────── */}
      <main className="flex-1 min-w-0 relative h-full overflow-y-auto bg-af-surface-0/40 backdrop-blur-md custom-scrollbar">
        {children}
      </main>

      {/* ── Right Sidebar ────────────────────────────── */}
      {rightCollapsed ? (
        <div className="flex-shrink-0 h-full border-l border-af-border-subtle hidden lg:flex flex-col items-center pt-2">
          <button
            onClick={() => setRightCollapsed(false)}
            className="p-1.5 rounded-md text-af-text-secondary hover:text-white hover:bg-af-surface-2 transition-colors"
            title="Expand sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-shrink-0 w-80 h-full border-l border-af-border-subtle hidden lg:flex flex-col bg-af-surface-0">
          <div className="flex items-center justify-start px-2 py-2 flex-shrink-0">
            <button
              onClick={() => setRightCollapsed(true)}
              className="p-1.5 rounded-md text-af-text-secondary hover:text-white hover:bg-af-surface-2 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <RightSidebar />
          </div>
        </div>
      )}
    </div>
  )
}
