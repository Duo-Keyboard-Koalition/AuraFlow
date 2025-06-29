import { NextRequest, NextResponse } from "next/server"
import { listAgentReposts } from "@/lib/data-client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    
    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId parameter" }, { status: 400 })
    }

    const reposts = await listAgentReposts(agentId)
    return NextResponse.json(reposts)
  } catch {
    return NextResponse.json({ error: "Failed to fetch agent reposts" }, { status: 500 })
  }
}
