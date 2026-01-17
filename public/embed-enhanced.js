/**
 * AI Chat Widget Embed Script - Enhanced
 * Version: 2.0.0 (Phase 2 - Full Features)
 * Pure JavaScript, no dependencies
 */

(function() {
  // Configuration defaults
  const DEFAULT_CONFIG = {
    widgetTitle: 'Chat Assistant',
    primaryColor: '#9333ea',
    secondaryColor: '#f3e8ff',
    textColor: '#ffffff',
    placeholderText: 'Ask me anything...',
    footerText: 'Powered by AI Chat Widget',
    theme: 'light',
    apiUrl: window.location.origin,
    enableLogging: true
  };

  // Global state
  const STATE = {
    config: null,
    threadId: null,
    isLoading: false,
    theme: 'light'
  };

  const logger = {
    enabled: true,
    success(message, data) {
      if (!this.enabled) return;
      console.log('✓ ' + message, data || '');
    },
    error(message, error) {
      if (!this.enabled) return;
      console.error('✗ ' + message, error || '');
    },
    warn(message, data) {
      if (!this.enabled) return;
      console.warn('⚠ ' + message, data || '');
    },
    info(message, data) {
      if (!this.enabled) return;
      console.log('ℹ ' + message, data || '');
    }
  };

  function decompressConfig(encodedConfig) {
    try {
      if (!encodedConfig) return DEFAULT_CONFIG;
      const decoded = atob(encodedConfig);
      const config = JSON.parse(decodeURIComponent(decoded));
      logger.success('Configuration decompressed', config);
      return Object.assign({}, DEFAULT_CONFIG, config);
    } catch (error) {
      logger.error('Failed to decompress config, using defaults', error);
      return DEFAULT_CONFIG;
    }
  }

  function getConfig() {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    return decompressConfig(configParam);
  }

  function getThreadId() {
    const key = 'ai_chat_widget_thread_' + btoa(STATE.config.apiUrl);
    let threadId = localStorage.getItem(key);
    if (!threadId) {
      logger.info('Creating new thread');
      threadId = 'thread_' + Date.now();
      localStorage.setItem(key, threadId);
    }
    STATE.threadId = threadId;
    logger.success('Thread ID retrieved', threadId);
    return threadId;
  }

  async function sendMessage(message) {
    try {
      STATE.isLoading = true;
      logger.info('Sending message', message);
      const response = await fetch(STATE.config.apiUrl + '/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: STATE.threadId, message: message })
      });
      if (!response.ok) throw new Error('API error: ' + response.status);
      const data = await response.json();
      logger.success('Message sent successfully', data);
      STATE.isLoading = false;
      return data.message;
    } catch (error) {
      logger.error('Failed to send message', error);
      STATE.isLoading = false;
      return null;
    }
  }

  async function initializeThread() {
    try {
      logger.info('Initializing thread with API');
      const response = await fetch(STATE.config.apiUrl + '/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Thread creation failed: ' + response.status);
      const data = await response.json();
      const newThreadId = data.threadId;
      const key = 'ai_chat_widget_thread_' + btoa(STATE.config.apiUrl);
      localStorage.setItem(key, newThreadId);
      STATE.threadId = newThreadId;
      logger.success('Thread initialized', newThreadId);
    } catch (error) {
      logger.warn('Failed to initialize thread with API', error);
      getThreadId();
    }
  }

  function addMessageToChat(content, isUser) {
    const chatMessages = document.getElementById('ai-chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'assistant-message';
    messageDiv.style.cssText = 'display: flex; margin-bottom: 12px; animation: slideIn 0.3s ease;' + 
      (isUser ? 'justify-content: flex-end;' : '');

    const contentDiv = document.createElement('div');
    const bgColor = isUser ? STATE.config.primaryColor : 
      (STATE.theme === 'dark' ? '#2d3748' : '#f3f4f6');
    const textColor = isUser ? 'white' : (STATE.theme === 'dark' ? '#e2e8f0' : '#1f2937');
    const borderRadius = isUser ? '12px 0 12px 12px' : '0 12px 12px 12px';
    
    contentDiv.style.cssText = 'max-width: 70%; padding: 12px 16px; border-radius: ' + borderRadius + 
      '; word-wrap: break-word; font-size: 14px; line-height: 1.4; background: ' + bgColor + 
      '; color: ' + textColor;
    contentDiv.textContent = content;
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    setTimeout(function() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 0);
  }

  async function handleSendMessage() {
    const input = document.getElementById('ai-chat-input');
    const button = document.getElementById('ai-chat-send');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    input.value = '';
    input.disabled = true;
    button.disabled = true;
    
    addMessageToChat(message, true);
    const response = await sendMessage(message);
    
    if (response) {
      addMessageToChat(response, false);
    } else {
      addMessageToChat('Sorry, I encountered an error. Please try again.', false);
    }
    
    input.disabled = false;
    button.disabled = false;
    input.focus();
  }

  function applyTheme() {
    const window_ = document.getElementById('ai-chat-window');
    if (!window_) return;
    if (STATE.theme === 'dark') {
      window_.style.backgroundColor = '#1f2937';
      window_.style.color = '#e2e8f0';
    } else {
      window_.style.backgroundColor = '#ffffff';
      window_.style.color = '#000000';
    }
  }

  function toggleTheme() {
    STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    logger.success('Theme toggled', STATE.theme);
  }

  function render() {
    STATE.config = getConfig();
    STATE.theme = STATE.config.theme || 'light';
    logger.enabled = STATE.config.enableLogging !== false;
    logger.success('Rendering widget', STATE.config);
    
    const root = document.createElement('div');
    root.id = 'ai-chat-widget-root';
    root.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: system-ui, -apple-system, sans-serif';

    const isDark = STATE.theme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#e2e8f0' : '#000000';
    const msgBg = isDark ? '#111827' : '#f9fafb';
    const borderColor = isDark ? '#374151' : '#e5e7eb';
    
    root.innerHTML = '<style>' +
      '#ai-chat-widget-root button:focus { outline: 2px solid ' + STATE.config.primaryColor + '; }' +
      '#ai-chat-widget-root input:focus { outline: 2px solid ' + STATE.config.primaryColor + '; }' +
      '@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }' +
      '@media (max-width: 480px) { #ai-chat-window { width: calc(100vw - 40px) !important; height: calc(100vh - 100px) !important; bottom: 80px !important; } }' +
      '</style>' +
      '<button id="ai-chat-toggle" style="width: 60px; height: 60px; border-radius: 50%; border: none; background: ' + 
      STATE.config.primaryColor + '; color: ' + STATE.config.textColor + 
      '; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); font-size: 24px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; font-weight: bold;">💬</button>' +
      '<div id="ai-chat-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 400px; height: 500px; background: ' + 
      bgColor + '; border-radius: 12px; box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16); flex-direction: column; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; color: ' + 
      textColor + '">' +
      '<div style="background: ' + STATE.config.primaryColor + '; color: ' + STATE.config.textColor + 
      '; padding: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">' +
      '<span>' + STATE.config.widgetTitle + '</span>' +
      '<button id="ai-chat-theme-toggle" style="background: rgba(255, 255, 255, 0.2); border: none; color: ' + STATE.config.textColor + 
      '; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;" title="Toggle theme">🌙</button>' +
      '</div>' +
      '<div id="ai-chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; background: ' + msgBg + 
      '; display: flex; flex-direction: column;"></div>' +
      '<div style="padding: 12px; border-top: 1px solid ' + borderColor + '; background: ' + bgColor + '; display: flex; gap: 8px;">' +
      '<input id="ai-chat-input" type="text" placeholder="' + STATE.config.placeholderText + 
      '" style="flex: 1; padding: 10px 12px; border: 1px solid ' + borderColor + '; border-radius: 6px; font-size: 14px; background: ' + 
      msgBg + '; color: ' + textColor + '; font-family: inherit;" />' +
      '<button id="ai-chat-send" style="padding: 10px 16px; background: ' + STATE.config.primaryColor + '; color: ' + 
      STATE.config.textColor + '; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Send</button>' +
      '</div>' +
      '<div style="padding: 12px; border-top: 1px solid ' + borderColor + '; font-size: 11px; color: ' + 
      (isDark ? '#9ca3af' : '#6b7280') + '; text-align: center; background: ' + msgBg + ';">' + STATE.config.footerText + '</div>' +
      '</div>';

    try {
      document.body.appendChild(root);
      logger.success('Widget DOM injected');
    } catch (error) {
      logger.error('Failed to inject widget DOM', error);
      return;
    }

    const toggleButton = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const sendButton = document.getElementById('ai-chat-send');
    const input = document.getElementById('ai-chat-input');
    const themeButton = document.getElementById('ai-chat-theme-toggle');

    if (toggleButton && chatWindow) {
      toggleButton.addEventListener('click', function() {
        const isOpen = chatWindow.style.display === 'flex';
        chatWindow.style.display = isOpen ? 'none' : 'flex';
        logger.info('Chat window toggled', { isOpen: !isOpen });
        if (!isOpen) {
          setTimeout(function() { input.focus(); }, 100);
          if (!STATE.threadId) {
            getThreadId();
            initializeThread();
          }
        }
      });

      toggleButton.addEventListener('mouseenter', function() {
        toggleButton.style.transform = 'scale(1.1)';
      });

      toggleButton.addEventListener('mouseleave', function() {
        toggleButton.style.transform = 'scale(1)';
      });
    }

    if (sendButton && input) {
      sendButton.addEventListener('click', handleSendMessage);
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      });
    }

    if (themeButton) {
      themeButton.addEventListener('click', toggleTheme);
    }

    if (chatWindow) {
      chatWindow.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    setTimeout(function() {
      addMessageToChat('Hi! I\'m ' + STATE.config.widgetTitle + '. How can I help you today?', false);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  logger.success('AI Chat Widget Enhanced loaded');
})();
