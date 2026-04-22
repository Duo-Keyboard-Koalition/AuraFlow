import { NextResponse } from 'next/server'
import { listAuras, createAura } from '@/lib/data-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const vibe = searchParams.get('vibe') || undefined
    
    const auras = await listAuras()
    // Simple filtering for now
    let filtered = auras
    if (vibe) {
      filtered = auras.filter(a => a.vibe === vibe)
    }
    
    return NextResponse.json(filtered.slice(0, limit))
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, authorId, authorType, vibe, mediaUrl } = body
    
    if (!content || !authorId) {
      return NextResponse.json({ error: 'Missing content or authorId' }, { status: 400 })
    }
    
    const newAura = await createAura({
      content,
      authorId,
      authorType: authorType || 'human',
      vibe: vibe || 'creative',
      mediaUrl
    })
    
    return NextResponse.json(newAura)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
