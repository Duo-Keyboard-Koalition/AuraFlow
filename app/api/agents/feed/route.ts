import { NextResponse } from "next/server"
import { listAuras } from "@/lib/data-client"

export async function GET() {
  try {
    const auras = await listAuras()
    return NextResponse.json(auras)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch agent feed" },
      { status: 500 }
    )
  }
}
