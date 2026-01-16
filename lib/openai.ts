import OpenAI from 'openai'

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY
const assistantId = process.env.OPENAI_ASSISTANT_ID

if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

if (!assistantId) {
  throw new Error('OPENAI_ASSISTANT_ID environment variable is not set')
}

const client = new OpenAI({
  apiKey,
})

export { client, assistantId }
