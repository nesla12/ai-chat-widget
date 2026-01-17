/**
 * AI Chat Widget Embed Script - Production
 * Version: 1.0.0
 * Built for security, stability, and performance
 */

(function() {
  'use strict';

  const CONFIG = {
    version: '1.0.0',
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    maxMessageLength: 4000,
  };

  const DEFAULT_CONFIG = {
    widgetTitle: 'Chat Assistant',
    primaryColor: '#9333ea',
    textColor: '#ffffff',
    placeholderText: 'Ask me anything...',
    footerText: 'Powered by AI Chat Widget',
    theme: 'light',
    apiUrl: window.location.origin,
    enableLogging: false,
  };

  const STATE = {
    config: null,
    threadId: null,
    isLoading: false,
    theme: 'light',
    mounted: false,
    root: null,
  };

  // Logging utility (silent in production)
  const logger = {
    enabled: false,
    success: function(msg, data) {
      if (!this.enabled) return;
      console.log('[✓] ' + msg, data || '');
    },
    error: function(msg, err) {
      if (!this.enabled) return;
      console.error('[✗] ' + msg, err || '');
    },
    warn: function(msg, data) {
      if (!this.enabled) return;
      console.warn('[⚠] ' + msg, data || '');
    },
    info: function(msg, data) {
      if (!this.enabled) return;
      console.log('[ℹ] ' + msg, data || '');
    }
  };

  /**
   * Safely decompress config from URL parameter
   */
  function decompressConfig(encoded) {
    try {
      if (!encoded || typeof encoded !== 'string') {
        return DEFAULT_CONFIG;
      }
      
      var decoded = atob(encoded);
      var config = JSON.parse(decodeURIComponent(decoded));
      
      // Validate required fields
      if (!config.widgetTitle || typeof config.primaryColor !== 'string') {
        return DEFAULT_CONFIG;
      }
      
      logger.success('Config decompressed');
      return Object.assign({}, DEFAULT_CONFIG, config);
    } catch (err) {
      logger.error('Config decompression failed', err);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Get config from URL parameters
   */
  function getConfig() {
    try {
      var params = new URLSearchParams(window.location.search);
      var configParam = params.get('config');
      return decompressConfig(configParam);
    } catch (err) {
      logger.error('Failed to parse URL', err);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Sanitize text to prevent XSS
   */
  function sanitizeText(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get or create thread ID
   */
  function getThreadId() {
    try {
      var key = 'ai_chat_thread_' + btoa(STATE.config.apiUrl).substring(0, 12);
      var threadId = localStorage.getItem(key);
      
      if (!threadId) {
        threadId = 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(key, threadId);
        logger.success('Thread created', threadId);
      }
      
      STATE.threadId = threadId;
      return threadId;
    } catch (err) {
      logger.warn('LocalStorage unavailable', err);
      STATE.threadId = 'thread_' + Date.now();
      return STATE.threadId;
    }
  }

  /**
   * Fetch with timeout and retry logic
   */
  function fetchWithRetry(url, options, attempt) {
    attempt = attempt || 0;
    
    return Promise.race([
      fetch(url, options),
      new Promise(function(_, reject) {
        setTimeout(function() {
          reject(new Error('Request timeout'));
        }, CONFIG.timeout);
      })
    ]).catch(function(err) {
      if (attempt < CONFIG.maxRetries) {
        logger.warn('Retrying request (' + (attempt + 1) + '/' + CONFIG.maxRetries + ')', err.message);
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve(fetchWithRetry(url, options, attempt + 1));
          }, CONFIG.retryDelay * (attempt + 1));
        });
      }
      throw err;
    });
  }

  /**
   * Send message to API
   */
  async function sendMessage(message) {
    try {
      if (!message || message.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }
      
      if (message.length > CONFIG.maxMessageLength) {
        throw new Error('Message is too long (max ' + CONFIG.maxMessageLength + ' chars)');
      }

      STATE.isLoading = true;
      logger.info('Sending message');

      var response = await fetchWithRetry(
        STATE.config.apiUrl + '/api/messages',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId: STATE.threadId,
            message: message.substring(0, CONFIG.maxMessageLength)
          })
        }
      );

      if (!response.ok) {
        throw new Error('API error: ' + response.status);
      }

      var data = await response.json();
      STATE.isLoading = false;
      logger.success('Message sent');
      return data.message || null;

    } catch (err) {
      STATE.isLoading = false;
      logger.error('Send message failed', err.message);
      return null;
    }
  }

  /**
   * Initialize thread with API
   */
  async function initializeThread() {
    try {
      logger.info('Initializing thread');

      var response = await fetchWithRetry(
        STATE.config.apiUrl + '/api/threads',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error('Thread init failed: ' + response.status);
      }

      var data = await response.json();
      if (data.threadId) {
        var key = 'ai_chat_thread_' + btoa(STATE.config.apiUrl).substring(0, 12);
        localStorage.setItem(key, data.threadId);
        STATE.threadId = data.threadId;
        logger.success('Thread initialized', STATE.threadId);
      }

    } catch (err) {
      logger.warn('Thread init failed, using fallback', err.message);
      getThreadId();
    }
  }

  /**
   * Add message to display
   */
  function addMessageToChat(content, isUser) {
    try {
      var container = document.getElementById('ai-chat-messages');
      if (!container) return;

      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'display: flex; margin-bottom: 12px; animation: slideIn 0.3s ease; ' +
        (isUser ? 'justify-content: flex-end;' : '');

      var contentDiv = document.createElement('div');
      var bgColor = isUser ? STATE.config.primaryColor :
        (STATE.theme === 'dark' ? '#2d3748' : '#f3f4f6');
      var textColor = isUser ? 'white' : (STATE.theme === 'dark' ? '#e2e8f0' : '#1f2937');
      var borderRadius = isUser ? '12px 0 12px 12px' : '0 12px 12px 12px';

      contentDiv.style.cssText = 'max-width: 70%; padding: 12px 16px; border-radius: ' + borderRadius +
        '; word-wrap: break-word; font-size: 14px; line-height: 1.4; background: ' + bgColor +
        '; color: ' + textColor;

      contentDiv.textContent = content;
      msgDiv.appendChild(contentDiv);
      container.appendChild(msgDiv);

      setTimeout(function() {
        if (container) container.scrollTop = container.scrollHeight;
      }, 0);

    } catch (err) {
      logger.error('Failed to add message', err.message);
    }
  }

  /**
   * Handle sending message
   */
  async function handleSendMessage() {
    try {
      var input = document.getElementById('ai-chat-input');
      var button = document.getElementById('ai-chat-send');

      if (!input || !input.value.trim()) return;

      var message = input.value.trim();
      input.value = '';
      input.disabled = true;
      button.disabled = true;

      addMessageToChat(message, true);

      var response = await sendMessage(message);

      if (response) {
        addMessageToChat(response, false);
      } else {
        addMessageToChat('Sorry, I encountered an error. Please try again.', false);
      }

      input.disabled = false;
      button.disabled = false;
      input.focus();

    } catch (err) {
      logger.error('Send message handler failed', err.message);
      var input = document.getElementById('ai-chat-input');
      if (input) {
        input.disabled = false;
        var button = document.getElementById('ai-chat-send');
        if (button) button.disabled = false;
      }
    }
  }

  /**
   * Toggle theme
   */
  function toggleTheme() {
    try {
      STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
      var window_ = document.getElementById('ai-chat-window');
      if (!window_) return;

      if (STATE.theme === 'dark') {
        window_.style.backgroundColor = '#1f2937';
        window_.style.color = '#e2e8f0';
      } else {
        window_.style.backgroundColor = '#ffffff';
        window_.style.color = '#000000';
      }

      logger.success('Theme toggled');
    } catch (err) {
      logger.error('Theme toggle failed', err.message);
    }
  }

  /**
   * Safely create and render widget
   */
  function render() {
    try {
      if (STATE.mounted) {
        logger.warn('Widget already mounted');
        return;
      }

      STATE.config = getConfig();
      STATE.theme = STATE.config.theme || 'light';
      logger.enabled = STATE.config.enableLogging === true;

      logger.success('Rendering widget', CONFIG.version);

      var root = document.createElement('div');
      root.id = 'ai-chat-widget-root';
      root.setAttribute('data-version', CONFIG.version);
      root.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: system-ui, -apple-system, sans-serif;';

      var isDark = STATE.theme === 'dark';
      var bgColor = isDark ? '#1f2937' : '#ffffff';
      var textColor = isDark ? '#e2e8f0' : '#000000';
      var msgBg = isDark ? '#111827' : '#f9fafb';
      var borderColor = isDark ? '#374151' : '#e5e7eb';

      root.innerHTML = '<style>' +
        '@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }' +
        '#ai-chat-window button:focus, #ai-chat-window input:focus { outline: 2px solid ' + STATE.config.primaryColor + '; }' +
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
        '<span>' + sanitizeText(STATE.config.widgetTitle) + '</span>' +
        '<button id="ai-chat-theme-toggle" style="background: rgba(255, 255, 255, 0.2); border: none; color: ' + STATE.config.textColor +
        '; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">🌙</button>' +
        '</div>' +
        '<div id="ai-chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; background: ' + msgBg +
        '; display: flex; flex-direction: column;"></div>' +
        '<div style="padding: 12px; border-top: 1px solid ' + borderColor + '; background: ' + bgColor + '; display: flex; gap: 8px;">' +
        '<input id="ai-chat-input" type="text" placeholder="' + sanitizeText(STATE.config.placeholderText) +
        '" style="flex: 1; padding: 10px 12px; border: 1px solid ' + borderColor + '; border-radius: 6px; font-size: 14px; background: ' +
        msgBg + '; color: ' + textColor + '; font-family: inherit;" />' +
        '<button id="ai-chat-send" style="padding: 10px 16px; background: ' + STATE.config.primaryColor + '; color: ' +
        STATE.config.textColor + '; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Send</button>' +
        '</div>' +
        '<div style="padding: 12px; border-top: 1px solid ' + borderColor + '; font-size: 11px; color: ' +
        (isDark ? '#9ca3af' : '#6b7280') + '; text-align: center; background: ' + msgBg + ';">' + sanitizeText(STATE.config.footerText) + '</div>' +
        '</div>';

      document.body.appendChild(root);
      STATE.root = root;
      STATE.mounted = true;
      logger.success('Widget DOM injected');

      var toggleBtn = document.getElementById('ai-chat-toggle');
      var chatWindow = document.getElementById('ai-chat-window');
      var sendBtn = document.getElementById('ai-chat-send');
      var input = document.getElementById('ai-chat-input');
      var themeBtn = document.getElementById('ai-chat-theme-toggle');

      if (toggleBtn && chatWindow) {
        toggleBtn.addEventListener('click', function() {
          var isOpen = chatWindow.style.display === 'flex';
          chatWindow.style.display = isOpen ? 'none' : 'flex';
          if (!isOpen) {
            setTimeout(function() { if (input) input.focus(); }, 100);
            if (!STATE.threadId) {
              getThreadId();
              initializeThread();
            }
          }
        });

        toggleBtn.addEventListener('mouseenter', function() {
          toggleBtn.style.transform = 'scale(1.1)';
        });

        toggleBtn.addEventListener('mouseleave', function() {
          toggleBtn.style.transform = 'scale(1)';
        });
      }

      if (sendBtn && input) {
        sendBtn.addEventListener('click', handleSendMessage);
        input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        });
      }

      if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
      }

      if (chatWindow) {
        chatWindow.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }

      setTimeout(function() {
        addMessageToChat('Hi! I\'m ' + STATE.config.widgetTitle + '. How can I help you today?', false);
      }, 300);

    } catch (err) {
      logger.error('Render failed', err.message);
    }
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    try {
      if (STATE.mounted) return;
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
      } else {
        render();
      }
    } catch (err) {
      logger.error('Initialization failed', err.message);
    }
  }

  // Initialize on script load
  init();

})();
