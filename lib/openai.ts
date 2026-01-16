import OpenAI from 'openai'

// Lazy initialization to allow builds without env vars
let client: OpenAI | null = null

const getClient = (): OpenAI => {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    client = new OpenAI({ apiKey })
  }
  return client
}

export const getAssistantId = (): string => {
  const assistantId = process.env.OPENAI_ASSISTANT_ID
  if (!assistantId) {
    throw new Error('OPENAI_ASSISTANT_ID environment variable is not set')
  }
  return assistantId
}

export { getClient as client }
