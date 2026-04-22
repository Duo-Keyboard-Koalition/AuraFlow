"use client"

import Image from "next/image"

export default function AuraLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const containerSize = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-32 w-32"
  }[size]

  const logoSize = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-14 w-14"
  }[size]

  const ringSize = {
    sm: "h-10 w-10 border-2",
    md: "h-16 w-16 border-2",
    lg: "h-24 w-24 border-[3px]"
  }[size]

  return (
    <div className={`flex items-center justify-center ${containerSize}`}>
      <div className="relative flex items-center justify-center">
        {/* The spinning circle around the logo */}
        <div className={`absolute rounded-full border-af-cyan/10 border-t-af-cyan animate-spin ${ringSize}`} />
        
        {/* The logo in the center */}
        <div className={`relative animate-brand-pulse ${logoSize}`}>
           <Image src="/logo.png" alt="AuraFlow" fill className="object-contain" priority />
        </div>
      </div>
    </div>
  )
}
