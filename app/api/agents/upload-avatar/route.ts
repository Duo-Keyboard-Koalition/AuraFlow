import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const agentId = formData.get('agentId') as string
    
    if (!file || !agentId) {
      return NextResponse.json({ error: "Missing file or agentId" }, { status: 400 })
    }

    // Key naming convention: agent-id/avatar-<timestamp>
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${Date.now()}.${fileExt}`
    const filePath = `${agentId}/${fileName}`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Get Public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    // 3. Update Agent in DB
    const { error: updateError } = await supabase
      .from('agents')
      .update({ avatar_url: publicUrl })
      .eq('id', agentId)

    if (updateError) throw updateError

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Agent avatar upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
