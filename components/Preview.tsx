'use client'

import { useState, useRef, useEffect } from 'react'
import { WidgetConfig } from './ConfigForm'

interface PreviewProps {
  config: WidgetConfig
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function Preview({ config }: PreviewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize thread on mount
  useEffect(() => {
    const initThread = async () => {
      try {
        const response = await fetch('/api/threads', { method: 'POST' })
        const data = await response.json()
        setThreadId(data.threadId)
      } catch (err) {
        setError('Failed to initialize chat')
        console.error(err)
      }
    }

    initThread()
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !threadId || loading) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userMessage },
    ])
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: userMessage }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to send message')
        return
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message },
      ])
    } catch (err) {
      setError('Failed to send message')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col h-96 bg-white"
      style={{ backgroundColor: config.secondaryColor || '#F0F4FF' }}
    >
      {/* Header */}
      <div
        className="p-4 text-white flex items-center gap-3"
        style={{ backgroundColor: config.primaryColor || '#0066CC' }}
      >
        {config.logoUrl && (
          <img
            src={config.logoUrl}
            alt="Logo"
            className="h-8 w-8 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div>
          <h3 className="font-semibold text-sm">{config.widgetName || 'AI Assistant'}</h3>
          <p className="text-xs opacity-90">{config.subtitle || 'Online'}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-500">
              <p className="font-medium mb-1">{config.welcomeMessage || 'Hello!'}</p>
              <p className="text-xs">{config.subtitle || 'Start a conversation'}</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: config.primaryColor || '#0066CC' }
                  : {}
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {error && (
          <div className="text-red-500 text-xs bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 p-3 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading || !threadId}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !threadId}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300"
            style={
              !loading && threadId
                ? { backgroundColor: config.primaryColor || '#0066CC' }
                : {}
            }
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
