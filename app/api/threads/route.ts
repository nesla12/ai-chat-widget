import { NextRequest, NextResponse } from 'next/server'
import { client as getClient } from '@/lib/openai'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 100 thread creations per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(`thread:${ip}`, 100, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const client = getClient()
    // Create a new thread
    const thread = await client.beta.threads.create()

    return NextResponse.json({
      threadId: thread.id,
    })
  } catch (error) {
    console.error('Error creating thread:', error)

    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Authentication error. Check your API key configuration.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    )
  }
}
