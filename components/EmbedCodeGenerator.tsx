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

  const embedCode = `<!-- AI Chat Widget -->
<script src="${domain}/embed.js"></script>
<script>
  AIWidget.init({
    primaryColor: '${config.primaryColor}',
    secondaryColor: '${config.secondaryColor}',
    widgetName: '${config.widgetName}',
    logoUrl: '${config.logoUrl}',
    welcomeMessage: '${config.welcomeMessage}',
    subtitle: '${config.subtitle}',
    apiUrl: '${domain}/api',
  });
</script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Embed Code
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Copy this code and paste it into your website or Systeme.io:
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
          <li>Go to your website or Systeme.io page</li>
          <li>Paste the code before the closing &lt;/body&gt; tag</li>
          <li>The widget will appear in the bottom-right corner</li>
        </ol>
      </div>
    </div>
  )
}
