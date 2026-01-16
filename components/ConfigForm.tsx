'use client'

import { useState } from 'react'

export interface WidgetConfig {
  widgetName: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  welcomeMessage: string
  subtitle: string
}

interface ConfigFormProps {
  onConfigChange: (config: WidgetConfig) => void
  config: WidgetConfig
}

export default function ConfigForm({ onConfigChange, config }: ConfigFormProps) {
  const handleChange = (
    field: keyof WidgetConfig,
    value: string
  ) => {
    onConfigChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Widget Configuration
        </h2>

        <div className="space-y-4">
          {/* Widget Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Widget Name
            </label>
            <input
              type="text"
              value={config.widgetName}
              onChange={(e) => handleChange('widgetName', e.target.value)}
              placeholder="My AI Assistant"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="text"
              value={config.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {config.logoUrl && (
              <div className="mt-2">
                <img
                  src={config.logoUrl}
                  alt="Logo preview"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                placeholder="#0066CC"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={config.secondaryColor}
                onChange={(e) =>
                  handleChange('secondaryColor', e.target.value)
                }
                placeholder="#F0F4FF"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Message
            </label>
            <input
              type="text"
              value={config.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              placeholder="Hello! How can I help you?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Ask me anything about our services"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
