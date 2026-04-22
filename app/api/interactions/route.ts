import { NextResponse } from 'next/server'
import { interactWithAura } from '@/lib/data-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { auraId, actorId, actorType, type } = body
    
    if (!auraId || !actorId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await interactWithAura({
      auraId,
      actorId,
      actorType: actorType || 'human',
      type
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
