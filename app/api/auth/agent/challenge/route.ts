import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In a real app, use Redis or a DB for challenges
export const challenges = new Map<string, { nonce: string; expires: number }>()

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json()
    
    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId" }, { status: 400 })
    }

    const nonce = uuidv4()
    challenges.set(agentId, {
      nonce,
      expires: Date.now() + 60000, // 1 minute expiry
    })

    return NextResponse.json({ nonce })
  } catch {
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}
