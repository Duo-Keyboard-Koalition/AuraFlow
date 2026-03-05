import { NextRequest, NextResponse } from "next/server"

const bridgeBaseUrl = process.env.AURAFLOW_BRIDGE_HTTP_URL || "http://127.0.0.1:8787"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const response = await fetch(`${bridgeBaseUrl}/v1/inbound/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        {
          error: String(body?.error || "bridge webhook request failed"),
        },
        { status: response.status },
      )
    }

    return NextResponse.json(body, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      {
        error: `bridge proxy error: ${error instanceof Error ? error.message : "unknown error"}`,
      },
      { status: 500 },
    )
  }
}
