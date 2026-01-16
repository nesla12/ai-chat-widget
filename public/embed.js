// AI Chat Widget Embed Script
(function () {
  'use strict'

  const AIWidget = {
    config: {
      primaryColor: '#0066CC',
      secondaryColor: '#F0F4FF',
      widgetName: 'AI Assistant',
      logoUrl: '',
      welcomeMessage: 'Hello! How can I help you?',
      subtitle: 'Online',
      apiUrl: 'http://localhost:3000/api',
    },

    init: function (userConfig) {
      // Merge user config with defaults
      this.config = { ...this.config, ...userConfig }

      // Create widget container
      this.createWidget()
    },

    createWidget: function () {
      // Create styles
      const styleElement = document.createElement('style')
      styleElement.textContent = this.getStyles()
      document.head.appendChild(styleElement)

      // Create widget HTML
      const widgetContainer = document.createElement('div')
      widgetContainer.id = 'ai-widget-container'
      widgetContainer.innerHTML = this.getWidgetHTML()

      document.body.appendChild(widgetContainer)

      // Initialize event listeners
      this.attachEventListeners()

      // Initialize thread
      this.initializeThread()
    },

    getStyles: function () {
      return `
        #ai-widget-container {
          --primary-color: ${this.config.primaryColor};
          --secondary-color: ${this.config.secondaryColor};
        }

        #ai-widget-container * {
          box-sizing: border-box;
        }

        .ai-widget-bubble {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .ai-widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          transition: all 0.3s ease;
        }

        .ai-widget-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .ai-widget-button.open {
          display: none;
        }

        .ai-widget-window {
          display: none;
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        .ai-widget-window.open {
          display: flex;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ai-widget-header {
          background-color: var(--primary-color);
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .ai-widget-header-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.2);
        }

        .ai-widget-header-text h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .ai-widget-header-text p {
          margin: 2px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .ai-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background-color: var(--secondary-color);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-widget-message {
          display: flex;
          font-size: 14px;
          line-height: 1.4;
        }

        .ai-widget-message.user {
          justify-content: flex-end;
        }

        .ai-widget-message.assistant {
          justify-content: flex-start;
        }

        .ai-widget-message-content {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 12px;
          word-wrap: break-word;
        }

        .ai-widget-message.user .ai-widget-message-content {
          background-color: var(--primary-color);
          color: white;
          border-bottom-right-radius: 2px;
        }

        .ai-widget-message.assistant .ai-widget-message-content {
          background-color: #e5e7eb;
          color: #1f2937;
          border-bottom-left-radius: 2px;
        }

        .ai-widget-loading {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
        }

        .ai-widget-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          animation: bounce 1.4s infinite;
        }

        .ai-widget-loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .ai-widget-loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        .ai-widget-input-area {
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          background: white;
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .ai-widget-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .ai-widget-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
        }

        .ai-widget-input:disabled {
          background-color: #f3f4f6;
        }

        .ai-widget-send-btn {
          padding: 8px 16px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: opacity 0.2s;
        }

        .ai-widget-send-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .ai-widget-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ai-widget-empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 20px;
          color: #6b7280;
        }

        .ai-widget-empty-state h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .ai-widget-empty-state p {
          margin: 0;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .ai-widget-window {
            width: calc(100vw - 24px);
            height: 70vh;
          }
        }
      `
    },

    getWidgetHTML: function () {
      return `
        <div class="ai-widget-bubble">
          <button class="ai-widget-button open" id="ai-widget-toggle">
            💬
          </button>

          <div class="ai-widget-window" id="ai-widget-window">
            <div class="ai-widget-header">
              ${
                this.config.logoUrl
                  ? `<img src="${this.config.logoUrl}" alt="Logo" class="ai-widget-header-logo">`
                  : ''
              }
              <div class="ai-widget-header-text">
                <h3>${this.config.widgetName}</h3>
                <p>${this.config.subtitle}</p>
              </div>
            </div>

            <div class="ai-widget-messages" id="ai-widget-messages">
              <div class="ai-widget-empty-state">
                <div>
                  <h4>${this.config.welcomeMessage}</h4>
                  <p>${this.config.subtitle}</p>
                </div>
              </div>
            </div>

            <div class="ai-widget-input-area">
              <input
                type="text"
                id="ai-widget-input"
                class="ai-widget-input"
                placeholder="Type your message..."
              />
              <button class="ai-widget-send-btn" id="ai-widget-send">
                Send
              </button>
            </div>
          </div>
        </div>
      `
    },

    attachEventListeners: function () {
      const toggle = document.getElementById('ai-widget-toggle')
      const window = document.getElementById('ai-widget-window')
      const input = document.getElementById('ai-widget-input')
      const sendBtn = document.getElementById('ai-widget-send')

      toggle.addEventListener('click', () => {
        const isOpen = window.classList.contains('open')
        window.classList.toggle('open')
        toggle.classList.toggle('open')
      })

      sendBtn.addEventListener('click', () => this.sendMessage())
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })
    },

    initializeThread: function () {
      fetch(`${this.config.apiUrl}/threads`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          this.threadId = data.threadId
        })
        .catch((err) => {
          console.error('Failed to initialize chat thread:', err)
        })
    },

    sendMessage: function () {
      const input = document.getElementById('ai-widget-input')
      const message = input.value.trim()

      if (!message || !this.threadId) return

      const messagesDiv = document.getElementById('ai-widget-messages')

      // Clear empty state if present
      const emptyState = messagesDiv.querySelector('.ai-widget-empty-state')
      if (emptyState) {
        emptyState.remove()
      }

      // Add user message
      const userMsgDiv = document.createElement('div')
      userMsgDiv.className = 'ai-widget-message user'
      userMsgDiv.innerHTML = `<div class="ai-widget-message-content">${this.escapeHtml(message)}</div>`
      messagesDiv.appendChild(userMsgDiv)

      input.value = ''
      input.disabled = true

      // Add loading indicator
      const loadingDiv = document.createElement('div')
      loadingDiv.className = 'ai-widget-message assistant'
      loadingDiv.id = 'ai-widget-loading'
      loadingDiv.innerHTML = `
        <div class="ai-widget-loading">
          <div class="ai-widget-loading-dot"></div>
          <div class="ai-widget-loading-dot"></div>
          <div class="ai-widget-loading-dot"></div>
        </div>
      `
      messagesDiv.appendChild(loadingDiv)
      messagesDiv.scrollTop = messagesDiv.scrollHeight

      // Send message to API
      fetch(`${this.config.apiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: this.threadId, message }),
      })
        .then((res) => res.json())
        .then((data) => {
          const loading = document.getElementById('ai-widget-loading')
          if (loading) loading.remove()

          const assistantMsgDiv = document.createElement('div')
          assistantMsgDiv.className = 'ai-widget-message assistant'
          assistantMsgDiv.innerHTML = `<div class="ai-widget-message-content">${this.escapeHtml(data.message)}</div>`
          messagesDiv.appendChild(assistantMsgDiv)
          messagesDiv.scrollTop = messagesDiv.scrollHeight
          input.disabled = false
          input.focus()
        })
        .catch((err) => {
          const loading = document.getElementById('ai-widget-loading')
          if (loading) loading.remove()

          const errorDiv = document.createElement('div')
          errorDiv.className = 'ai-widget-message assistant'
          errorDiv.innerHTML = `<div class="ai-widget-message-content">Sorry, there was an error. Please try again.</div>`
          messagesDiv.appendChild(errorDiv)
          messagesDiv.scrollTop = messagesDiv.scrollHeight
          input.disabled = false
          input.focus()

          console.error('Error sending message:', err)
        })
    },

    escapeHtml: function (text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }
      return text.replace(/[&<>"']/g, (m) => map[m])
    },
  }

  // Expose to global scope
  if (typeof window !== 'undefined') {
    window.AIWidget = AIWidget
  }
})()
