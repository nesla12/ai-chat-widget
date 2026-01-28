# AI Chat Widget - Embed Guide

## Overview

The AI Chat Widget is a self-contained JavaScript embed that adds an AI-powered chat interface to any website. It's built with security, performance, and ease of use in mind.

**Current Version:** 1.0.0

## Quick Start

### 1. Get Your Embed Code

1. Go to the AI Chat Widget Configurator
2. Configure your widget (title, colors, messages)
3. Click the "Embed Code" tab
4. Copy the script tag

### 2. Install on Your Website

Paste the following before the closing `</body>` tag of your website:

```html
<script src="https://your-domain.com/embed-enhanced.js?config=..."></script>
```

That's it! The widget will appear in the bottom-right corner.

### 3. Test It

Refresh your website and look for a purple chat button in the bottom-right corner.

## Configuration Options

The embed script accepts a configuration object encoded as a URL parameter:

```javascript
const config = {
  widgetTitle: "Support Agent",           // Widget header title
  primaryColor: "#9333ea",                 // Button and header color
  secondaryColor: "#f3e8ff",               // Background accents
  textColor: "#ffffff",                    // Text color in header
  placeholderText: "Ask me...",            // Input field placeholder
  footerText: "Powered by AI",             // Footer text
  theme: "light",                          // "light" or "dark"
  apiUrl: "https://your-domain.com",       // Your API endpoint
  enableLogging: false                     // Console logs (dev only)
};
```

## Installation on Popular Platforms

### Systeme.io

1. Go to your page settings
2. Find "Custom Code" or "Footer Code" section
3. Paste the embed script
4. Save and publish

### WordPress

1. Use a code injection plugin (e.g., Insert Headers and Footers)
2. Paste the script in the footer
3. Save changes

### Webflow

1. Go to Page Settings → Custom Code
2. Paste in Footer Code
3. Publish

### Your Own Website

Simply add the script before `</body>`:

```html
<body>
  <!-- Your content -->
  
  <script src="https://your-domain.com/embed-enhanced.js?config=..."></script>
</body>
```

## Features

✅ **Lightweight** - Only 12KB (gzipped ~4KB)
✅ **No Dependencies** - Pure JavaScript
✅ **Secure** - Configuration encoded in URL, no API keys exposed
✅ **Responsive** - Mobile-friendly design
✅ **Customizable** - Colors, text, and theme
✅ **Persistent** - Saves conversation thread ID locally
✅ **Error Handling** - Gracefully handles network failures

## API Endpoints

### POST /api/threads

Creates a new conversation thread.

**Response:**
```json
{
  "threadId": "thread_1234567890_abc123"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### POST /api/messages

Sends a message and gets a response.

**Request:**
```json
{
  "threadId": "thread_1234567890_abc123",
  "message": "Hello, how can I help?"
}
```

**Response:**
```json
{
  "message": "Hi! I'm here to help...",
  "threadId": "thread_1234567890_abc123"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Data Storage

The widget stores one item in localStorage:

```
Key: ai_chat_thread_{hash}
Value: thread_1234567890_abc123
```

This ensures the conversation continues when the user returns.

## Security

✅ **API Key Protection** - Your OpenAI API key stays on the server
✅ **XSS Prevention** - All user messages are sanitized
✅ **CORS Configured** - Cross-origin requests allowed only for widget
✅ **Content-Type Headers** - Prevents MIME-sniffing attacks
✅ **Timeout Protection** - 30-second timeout on API calls

## Troubleshooting

### Widget not appearing?

1. Check browser console for errors (Press F12)
2. Verify the script URL is correct
3. Check if JavaScript is enabled
4. Clear browser cache

### Messages not sending?

1. Verify API endpoint is correct
2. Check OpenAI API key configuration
3. Look for CORS errors in browser console
4. Check network tab for failed requests

### Theme not applying?

1. Verify color format is valid hex (e.g., #9333ea)
2. Ensure theme is "light" or "dark"
3. Hard refresh browser (Ctrl+Shift+R)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

### Vercel (Recommended)

```bash
npm run build
git push origin main
```

The embed script will be automatically served from `/public/embed-enhanced.js`

### Self-Hosted

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Ensure `/public/embed-enhanced.js` is accessible at your domain

### Environment Variables

Required:
```
OPENAI_API_KEY=sk_your_key_here
OPENAI_ASSISTANT_ID=asst_your_id_here
```

## Performance

- **Initial Load:** ~4KB gzipped
- **Message Send:** ~100-500ms (with network)
- **First Paint:** < 200ms
- **CSS-in-JS:** Inline styles, no external sheets

## Development

### Local Testing

1. Run `npm run dev`
2. Open `http://localhost:3000/public/test.html` for Phase 1 tests
3. Open `http://localhost:3000/public/embed-test.html` for Phase 2 tests

### Debug Mode

Enable logging by adding `enableLogging: true` to config:

```javascript
const config = {
  // ... other config
  enableLogging: true
};
```

## Version History

### 1.0.0 (Current)
- Initial production release
- Basic chat functionality
- Thread persistence
- Dark/light theme toggle
- Mobile responsive design
- Comprehensive error handling

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Check documentation at `/docs`

## License

Proprietary - All rights reserved
