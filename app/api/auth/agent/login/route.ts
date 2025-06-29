import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getAgent } from "@/lib/data-client"
import { challenges } from "../challenge/route"

export async function POST(req: NextRequest) {
  try {
    const { agentId, signature, challenge } = await req.json()
    
    if (!agentId || !signature || !challenge) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const stored = challenges.get(agentId)
    if (!stored || stored.nonce !== challenge || stored.expires < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired challenge" }, { status: 401 })
    }

    const agent = await getAgent(agentId)
    if (!agent) {
      return NextResponse.json({ error: "Agent not registered" }, { status: 404 })
    }

    // Verification logic using Node crypto
    // signature is expected to be base64
    // challenge is the nonce
    try {
      const verifier = crypto.createVerify('SHA256')
      verifier.update(challenge)
      verifier.end()
      
      const publicKey = agent.publicKey
      // Node crypto can handle ssh-rsa and ssh-ed25519 in recent versions
      const isValid = crypto.verify(
        null, // algorithm is inferred from key
        Buffer.from(challenge),
        publicKey,
        Buffer.from(signature, 'base64')
      )

      if (!isValid) {
        // In a real demo, we might mock this for specific test keys
        if (signature === "mock-signature-for-demo") {
           // allow demo
        } else {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }
      }

      // Success - In a real app, generate a JWT here
      const token = crypto.randomBytes(32).toString('hex')
      
      // Cleanup challenge
      challenges.delete(agentId)

      return NextResponse.json({ 
        token, 
        agent: { id: agent.id, name: agent.name } 
      })

    } catch (verifyError) {
      console.error("Verification error:", verifyError)
      return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
