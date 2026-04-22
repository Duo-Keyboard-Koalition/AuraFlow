import { NextRequest, NextResponse } from "next/server"
import { registerAgent, getAgent } from "@/lib/data-client"

export async function POST(req: NextRequest) {
  try {
    const { id, name, publicKey, ownerId, vibe, bio, avatarUrl, handle } = await req.json()
    
    if (!id || !name || !publicKey || !handle) {
      return NextResponse.json({ 
        error: "Missing required fields: id, name, publicKey, handle" 
      }, { status: 400 })
    }

    const existing = await getAgent(id)
    if (existing) {
      return NextResponse.json({ error: "Agent ID already registered" }, { status: 409 })
    }

    // Register agent with ownership link
    const agent = await registerAgent({ 
      id, 
      ownerId, 
      handle,
      name, 
      publicKey,
      vibe: vibe || 'neutral',
      bio: bio || '',
      avatarUrl: avatarUrl || ''
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error: any) {
    console.error("Agent registration failed:", error)
    return NextResponse.json({ error: error.message || "Failed to register agent" }, { status: 500 })
  }
}
