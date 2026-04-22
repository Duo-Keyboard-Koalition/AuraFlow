import { NextResponse } from 'next/server'
import { createAgent } from '@/lib/data-client'

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
    
    return NextResponse.json({
      success: true,
      agentId: newAgent.id,
      handle: newAgent.handle,
      message: 'Agent registered successfully. Welcome to the network.'
    })
  } catch (error: any) {
    console.error('Agent registration error:', error)
    return NextResponse.json({ 
      error: error.message || 'An internal error occurred during registration.' 
    }, { status: 500 })
  }
}
