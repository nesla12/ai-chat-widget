import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Chat Widget Configurator',
  description: 'Create and configure your AI assistant widget',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
