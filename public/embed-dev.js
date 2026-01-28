/**
 * AI Chat Widget Embed Script
 * Version: 1.0.0 (Phase 1 - Minimal)
 * Pure JavaScript, no dependencies
 */

(function() {
  // Default configuration
  const DEFAULT_CONFIG = {
    widgetTitle: 'Chat Assistant',
    primaryColor: '#9333ea',
    placeholderText: 'Ask me anything...',
    footerText: 'Powered by AI Chat Widget'
  };

  /**
   * Decompress configuration from base64 encoded string
   * Falls back to defaults if decompression fails
   */
  function decompressConfig(encodedConfig) {
    try {
      if (!encodedConfig) return DEFAULT_CONFIG;
      
      // Base64 decode
      const decoded = atob(encodedConfig);
      
      // Try to parse as JSON
      return JSON.parse(decodeURIComponent(decoded));
    } catch (error) {
      console.warn('Failed to decompress config:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Parse configuration from URL query parameters
   */
  function getConfig() {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    return decompressConfig(configParam);
  }

  /**
   * Render the widget UI
   */
  function render() {
    const config = getConfig();
    
    // Create root container
    const root = document.createElement('div');
    root.id = 'ai-chat-widget-root';
    root.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Create HTML structure
    root.innerHTML = `
      <button id="ai-chat-toggle" style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: ${config.primaryColor};
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 24px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      ">💬</button>
      
      <div id="ai-chat-window" style="
        display: none;
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 400px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        flex-direction: column;
        overflow: hidden;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: ${config.primaryColor};
          color: white;
          padding: 16px;
          font-weight: 600;
        ">${config.widgetTitle}</div>
        
        <div style="
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        ">Chat Widget Ready ✓</div>
        
        <div style="
          padding: 12px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
          text-align: center;
        ">${config.footerText}</div>
      </div>
    `;

    // Append to body
    document.body.appendChild(root);

    // Get references to elements
    const toggleButton = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');

    // Toggle window visibility
    toggleButton.addEventListener('click', function() {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    // Button hover effects
    toggleButton.addEventListener('mouseenter', function() {
      toggleButton.style.transform = 'scale(1.1)';
    });

    toggleButton.addEventListener('mouseleave', function() {
      toggleButton.style.transform = 'scale(1)';
    });

    // Prevent window click from closing widget
    chatWindow.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  /**
   * Initialize widget when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  console.log('✓ AI Chat Widget loaded successfully');
})();
