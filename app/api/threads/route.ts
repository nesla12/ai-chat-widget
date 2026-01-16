import { NextRequest, NextResponse } from 'next/server'
import { client as getClient } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const client = getClient()
    // Create a new thread
    const thread = await client.beta.threads.create()

    return NextResponse.json({
      threadId: thread.id,
    })
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    )
  }
}
