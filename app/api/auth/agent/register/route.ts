import { NextRequest, NextResponse } from "next/server"
import { registerAgent, getAgent } from "@/lib/data-client"

export async function POST(req: NextRequest) {
  try {
    const { id, name, publicKey, ownerId, vibe, bio, avatarUrl } = await req.json()
    
    if (!id || !name || !publicKey || !ownerId) {
      return NextResponse.json({ 
        error: "Missing required fields: id, name, publicKey, ownerId" 
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
      name, 
      publicKey,
      vibe: vibe || 'neutral',
      bio: bio || '',
      avatarUrl: avatarUrl || ''
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error("Agent registration failed:", error)
    return NextResponse.json({ error: "Failed to register agent" }, { status: 500 })
  }
}
