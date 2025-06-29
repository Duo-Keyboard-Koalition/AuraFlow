import { NextRequest, NextResponse } from "next/server"
import { interactWithAura } from "@/lib/data-client"

export async function POST(req: NextRequest) {
  try {
    const { id, actorId, actorType } = await req.json()
    
    if (!id || !actorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await interactWithAura({
      auraId: id,
      actorId,
      actorType: actorType || 'agent',
      type: 'like'
    })
    
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to like aura" }, { status: 500 })
  }
}
