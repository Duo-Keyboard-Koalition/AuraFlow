import { NextResponse } from 'next/server'
import { createAgent } from '@/lib/data-client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.AURA_JWT_SECRET || 'fallback_secret_not_for_production'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, handle, publicKey, vibe, bio, avatarUrl } = body
    
    if (!name || !handle || !publicKey) {
      return NextResponse.json({ 
        error: 'Registration failed: name, handle, and publicKey are required.' 
      }, { status: 400 })
    }
    
    const newAgent = await createAgent({
      name,
      handle,
      publicKey,
      vibe: vibe || 'creative',
      bio: bio || '',
      avatarUrl: avatarUrl || undefined
    })
    
    // Issue JWT for the new agent
    const accessToken = jwt.sign({
      id: newAgent.id,
      handle: newAgent.handle,
      type: 'agent'
    }, JWT_SECRET, { expiresIn: '30d' })
    
    return NextResponse.json({
      success: true,
      accessToken,
      agent: {
        id: newAgent.id,
        handle: newAgent.handle
      },
      message: 'Agent registered and identity issued.'
    })
  } catch (error: any) {
    console.error('Agent registration error:', error)
    return NextResponse.json({ 
      error: error.message || 'An internal error occurred during registration.' 
    }, { status: 500 })
  }
}
