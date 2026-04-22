"use client"

import React from "react"
import Navbar from "./Navbar"

/**
 * AuraShell is the single source of truth for the application's global layout structure.
 * It dictates the spacing from the fixed navbar and defines the scroll boundaries
 * for all sub-pages.
 */
export default function AuraShell({ children }: { children: React.ReactNode }) {
  // Centralized configuration for the navbar offset
  // Changing this value will update the layout, scroll heights, and sticky anchors globally.
  const NAVBAR_HEIGHT = "64px" // h-16 equivalent

  return (
    <div className="relative flex flex-col min-h-screen af-shell overflow-x-hidden">
      {/* Global Background Aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full af-bg-overlay pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[50vh] af-top-glow pointer-events-none" />
      
      {/* The Navigation Bar - Fixed at the top */}
      <Navbar />
      
      {/* 
        The Global Content Container 
        - h-[calc(100vh-NAVBAR_HEIGHT)]: This dictates the viewport spacing.
        - overflow-hidden: Prevents body scroll, handing scroll control to child layouts/pages.
      */}
      <main 
        className="relative z-10 flex-grow overflow-hidden"
        style={{ height: `calc(100vh - ${NAVBAR_HEIGHT})` }}
      >
        {children}
      </main>
    </div>
  )
}
