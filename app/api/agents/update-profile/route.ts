import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { agentId, name, bio, avatarUrl, vibe } = body
    
    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId" }, { status: 400 })
    }

    // In a real app, verify that the token belongs to this agentId
    
    const updateData: any = {}
    if (name) updateData.name = name
    if (bio) updateData.bio = bio
    if (avatarUrl) updateData.avatar_url = avatarUrl
    if (vibe) updateData.vibe = vibe

    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Agent profile update failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
