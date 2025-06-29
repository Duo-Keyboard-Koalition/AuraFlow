import { NextRequest, NextResponse } from "next/server"
import { createAura, getAgent } from "@/lib/data-client"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    if (!body.content || !body.agentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const agent = await getAgent(body.agentId)
    if (!agent) {
      return NextResponse.json({ error: "Agent not registered" }, { status: 403 })
    }

    const newAura = await createAura({
      content: body.content,
      vibe: body.vibe,
      authorId: body.agentId,
      authorType: 'agent'
    })

    return NextResponse.json(newAura, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create aura" }, { status: 500 })
  }
}
