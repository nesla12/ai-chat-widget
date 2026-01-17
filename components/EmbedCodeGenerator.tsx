'use client'

import { useState } from 'react'
import { WidgetConfig } from './ConfigForm'

interface EmbedCodeGeneratorProps {
  config: WidgetConfig
  domain?: string
}

export default function EmbedCodeGenerator({
  config,
  domain = typeof window !== 'undefined' ? window.location.origin : 'YOUR_DOMAIN',
}: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false)

  // Encode config to base64 for URL parameter
  const encodeConfig = () => {
    const configObj = {
      widgetTitle: config.widgetName,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      textColor: '#ffffff',
      placeholderText: 'Ask me anything...',
      footerText: config.subtitle,
      theme: 'light',
      apiUrl: domain,
      enableLogging: true,
    }
    const json = JSON.stringify(configObj)
    const encoded = encodeURIComponent(json)
    const base64 = typeof window !== 'undefined' ? btoa(encoded) : Buffer.from(encoded).toString('base64')
    return base64
  }

  const encodedConfig = encodeConfig()
  const embedCode = `<!-- AI Chat Widget -->
<script src="${domain}/embed-enhanced.js?config=${encodedConfig}"></script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Embed Code Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Embed Code
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Copy this code and paste it into your website or Systeme.io before the closing <code className="bg-gray-100 px-2 py-1 rounded text-xs">&lt;/body&gt;</code> tag:
        </p>

        <div className="relative bg-gray-900 rounded-lg p-4 text-gray-100 text-xs font-mono overflow-x-auto mb-4">
          <pre className="whitespace-pre-wrap break-words">{embedCode}</pre>
          <button
            onClick={copyToClipboard}
            className={`absolute top-3 right-3 px-3 py-1 rounded text-sm font-medium transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-medium mb-2">📋 Installation Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Copy the code above</li>
            <li>Go to your website, blog, or Systeme.io page</li>
            <li>Paste the code before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
            <li>Save and refresh the page</li>
            <li>The widget will appear in the bottom-right corner</li>
          </ol>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <p className="font-semibold text-purple-900 mb-3">⚙️ Current Configuration:</p>
        <div className="space-y-2 text-sm text-purple-800">
          <p><span className="font-medium">Title:</span> {config.widgetName}</p>
          <p><span className="font-medium">Primary Color:</span> <span className="inline-block w-4 h-4 rounded" style={{backgroundColor: config.primaryColor}}></span> {config.primaryColor}</p>
          <p><span className="font-medium">Subtitle:</span> {config.subtitle}</p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-medium mb-2">💡 Important Notes:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>The widget will load from <code className="bg-amber-100 px-1 rounded">{domain}/embed-enhanced.js</code></li>
          <li>All configuration is encoded in the script URL</li>
          <li>No additional setup needed on the target website</li>
          <li>The widget communicates securely with your API backend</li>
        </ul>
      </div>
    </div>
  )
}
