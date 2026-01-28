'use client'

import { useState } from 'react'
import ConfigForm, { WidgetConfig } from '@/components/ConfigForm'
import Preview from '@/components/Preview'
import EmbedCodeGenerator from '@/components/EmbedCodeGenerator'

const defaultConfig: WidgetConfig = {
  widgetName: 'Social Coach by Tristan',
  logoUrl: '',
  primaryColor: '#806429',
  secondaryColor: '#e8dcc8',
  welcomeMessage: 'Hello! How can I help you today?',
  subtitle: 'Dein persönlicher KI-Assistent',
}

export default function Home() {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'embed'>(
    'config'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AI Chat Widget Configurator
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Create and customize your AI assistant widget in minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 bg-white rounded-t-lg px-4">
          {[
            { id: 'config', label: '⚙️ Configure', icon: '⚙️' },
            { id: 'preview', label: '👁️ Preview', icon: '👁️' },
            { id: 'embed', label: '📋 Embed Code', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="p-6 sm:p-8">
              <ConfigForm config={config} onConfigChange={setConfig} />
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="p-6 sm:p-8">
              <div className="max-w-sm mx-auto">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Widget Preview
                </h2>
                <Preview config={config} />
              </div>
            </div>
          )}

          {/* Embed Code Tab */}
          {activeTab === 'embed' && (
            <div className="p-6 sm:p-8">
              <EmbedCodeGenerator config={config} />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure by Default</h3>
            <p className="text-sm text-gray-600">
              Your API key stays server-side. The widget communicates securely with your deployment.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Ready to Deploy</h3>
            <p className="text-sm text-gray-600">
              Deploy to Vercel in minutes. Your OpenAI costs scale with your usage.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Fully Customizable</h3>
            <p className="text-sm text-gray-600">
              Customize colors, branding, welcome message, and more with your assistant.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 pb-8">
          <p>
            Made with ❤️ for creators and businesses. Questions?{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Check the docs
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
