import { NextResponse } from 'next/server';

export async function GET() {
  const INFERENCE_LAYER_URL = process.env.INFERENCE_LAYER_URL || "http://localhost:8000";
  
  try {
    const response = await fetch(`${INFERENCE_LAYER_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const available = response.ok;
    
    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking DeepSeek API health:', error);
    return NextResponse.json({ available: false });
  }
}