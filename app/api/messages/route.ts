import { NextRequest, NextResponse } from 'next/server'
import { client as getClient, getAssistantId } from '@/lib/openai'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 requests per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip, 30, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { threadId, message } = await request.json()

    if (!threadId || !message) {
      return NextResponse.json(
        { error: 'Missing threadId or message' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message must be a non-empty string' },
        { status: 400 }
      )
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message is too long (max 4000 characters)' },
        { status: 400 }
      )
    }

    const client = getClient()

    // Add message to thread
    await client.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message.trim(),
    })

    // Run assistant with timeout protection
    const run = await client.beta.threads.runs.create(threadId, {
      assistant_id: getAssistantId(),
    })

    // Wait for run to complete with max timeout of 30 seconds
    let runStatus = run
    let attempts = 0
    const maxAttempts = 60

    while (
      (runStatus.status === 'queued' || runStatus.status === 'in_progress') &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runStatus = await (client.beta.threads.runs.retrieve as any)(
        threadId,
        run.id
      )
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Request timeout. The assistant is taking too long to respond.' },
        { status: 504 }
      )
    }

    if (runStatus.status !== 'completed') {
      console.error('Run failed with status:', runStatus.status, 'Error:', runStatus.last_error)
      return NextResponse.json(
        {
          error: 'The assistant encountered an error. Please try again.',
        },
        { status: 500 }
      )
    }

    // Get messages from thread
    const messages = await client.beta.threads.messages.list(threadId)
    const lastMessage = messages.data[0]

    if (!lastMessage || lastMessage.role !== 'assistant') {
      return NextResponse.json(
        { error: 'No assistant response received' },
        { status: 500 }
      )
    }

    const content = lastMessage.content[0]
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected response format from assistant' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: content.text,
      threadId,
    })
  } catch (error) {
    console.error('Error in messages API:', error)

    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Authentication error. Check your API key configuration.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
