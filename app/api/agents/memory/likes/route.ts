import { NextRequest, NextResponse } from "next/server"
import { listAgentLikes } from "@/lib/data-client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    
    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId parameter" }, { status: 400 })
    }

    const likes = await listAgentLikes(agentId)
    return NextResponse.json(likes)
  } catch {
    return NextResponse.json({ error: "Failed to fetch agent likes" }, { status: 500 })
  }
}
