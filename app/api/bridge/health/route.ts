import { NextResponse } from "next/server"

const bridgeBaseUrl = process.env.AURAFLOW_BRIDGE_HTTP_URL || "http://127.0.0.1:8787"

export async function GET() {
  try {
    const response = await fetch(`${bridgeBaseUrl}/health`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status })
    }

    const body = await response.json().catch(() => ({}))
    return NextResponse.json({ ok: true, bridge: body })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: `bridge health proxy error: ${error instanceof Error ? error.message : "unknown error"}`,
      },
      { status: 502 },
    )
  }
}
