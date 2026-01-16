import { NextRequest, NextResponse } from 'next/server'
import { client, assistantId } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { threadId, message } = await request.json()

    if (!threadId || !message) {
      return NextResponse.json(
        { error: 'Missing threadId or message' },
        { status: 400 }
      )
    }

    // Add message to thread
    await client.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    })

    // Run assistant
    const run = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })

    // Wait for run to complete
    let runStatus = run
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise((resolve) => setTimeout(resolve, 500))
      runStatus = await client.beta.threads.runs.retrieve(threadId, run.id)
    }

    if (runStatus.status !== 'completed') {
      return NextResponse.json(
        {
          error: `Run failed with status: ${runStatus.status}`,
          details: runStatus.last_error,
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
        { error: 'Unexpected content type' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: content.text,
      threadId,
    })
  } catch (error) {
    console.error('Error in messages API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
