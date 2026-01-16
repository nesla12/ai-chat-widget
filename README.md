# 🤖 AI Chat Widget Configurator

A **simple, secure, and powerful** AI chat widget builder that connects to your OpenAI Assistant. Create a branded chat widget, customize it, and embed it on your website or Systeme.io—all without exposing your API keys.

## Features

✨ **What You Get:**
- 🎨 **Easy Configurator**: Customize colors, branding, welcome messages in a simple UI
- 👁️ **Live Preview**: Test your widget in real-time before deploying
- 📋 **Embed Code**: One-click copy-paste embed code for any website
- 🔐 **Secure by Default**: API keys stay server-side, never exposed to the client
- ⚡ **Vercel-Ready**: Deploy in minutes, pay only for what you use
- 📱 **Mobile Responsive**: Works perfectly on phones, tablets, and desktops
- 🧠 **Powered by OpenAI Assistants**: Leverage your custom assistant with File Search and system instructions

## How It Works

```
Your Website
    ↓
Embedded Widget Script (secure)
    ↓
Your Vercel Deployment
    ↓
OpenAI Assistant API (with your API key)
```

**Key point:** Your OpenAI API key never leaves your server. The widget communicates securely with your Vercel deployment.

## Quick Start

### Step 1: Create an OpenAI Assistant

1. Go to [OpenAI Assistants](https://platform.openai.com/assistants)
2. Create a new assistant
3. Enable **File Search** and upload your PDFs/documents
4. Add your custom system instructions
5. Copy your **Assistant ID** (looks like `asst_...`)

### Step 2: Deploy to Vercel

**Option A: One-Click Deploy (Coming Soon)**

**Option B: Manual Deploy**

1. **Fork or clone this repo** to your GitHub account:
   ```bash
   git clone https://github.com/yourusername/ai-chat-widget.git
   cd ai-chat-widget
   ```

2. **Create a Vercel account** at [vercel.com](https://vercel.com)

3. **Import your repo** into Vercel (connect GitHub account)

4. **Add environment variables:**
   - `OPENAI_API_KEY`: Get from [platform.openai.com/api-keys](https://platform.openai.com/account/api-keys)
   - `OPENAI_ASSISTANT_ID`: From your assistant (step 1)

5. **Deploy!** Vercel will build and deploy automatically

### Step 3: Configure & Customize

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Go to the **Configure** tab
3. Set:
   - Widget name
   - Logo URL
   - Primary & secondary colors
   - Welcome message
   - Subtitle
4. Preview in real-time in the **Preview** tab

### Step 4: Embed on Your Website

1. Go to the **Embed Code** tab
2. Click **Copy**
3. Paste the code before the closing `</body>` tag on your website:

```html
<!-- Paste this before closing </body> tag -->
<script src="https://your-app.vercel.app/embed.js"></script>
<script>
  AIWidget.init({
    primaryColor: '#0066CC',
    secondaryColor: '#F0F4FF',
    widgetName: 'AI Assistant',
    logoUrl: 'https://example.com/logo.png',
    welcomeMessage: 'Hello! How can I help you?',
    subtitle: 'Powered by AI',
    apiUrl: 'https://your-app.vercel.app/api',
  });
</script>
```

**For Systeme.io:**
1. Go to your page editor
2. Add an **HTML** block
3. Paste the embed code
4. Save and preview

## Installation (Local Development)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your OPENAI_API_KEY and OPENAI_ASSISTANT_ID

# Run development server
npm run dev

# Open http://localhost:3000
```

## Folder Structure

```
ai-chat-widget/
├── app/
│   ├── api/
│   │   ├── messages/route.ts    # API endpoint for chat messages
│   │   └── threads/route.ts     # API endpoint for creating threads
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main configurator UI
│   └── globals.css               # Global styles
├── components/
│   ├── ConfigForm.tsx            # Configuration form
│   ├── Preview.tsx               # Live widget preview
│   └── EmbedCodeGenerator.tsx    # Embed code generator
├── lib/
│   └── openai.ts                 # OpenAI client initialization
├── public/
│   └── embed.js                  # Standalone widget script
└── package.json
```

## Architecture

### Frontend (Next.js App Directory)
- **Configurator**: React components for customizing the widget
- **Preview**: Real-time preview using your configuration
- **Code Generator**: Generates embed code with your settings

### Backend (Next.js API Routes)
- `POST /api/threads`: Creates a new OpenAI thread (rate limited)
- `POST /api/messages`: Sends user message to assistant, gets response (rate limited)
- **Rate Limiting**: 100 thread creations/min, 30 messages/min per IP
- **Input Validation**: Message length limits, timeout protection (30s max)

### Widget Script (`embed.js`)
- Standalone JavaScript that loads on user websites
- Creates a floating chat bubble
- Communicates with your backend API securely
- No dependencies, fully self-contained
- HTML escaping for XSS protection

## Environment Variables

```env
OPENAI_API_KEY=sk_...          # Your OpenAI API key (REQUIRED)
OPENAI_ASSISTANT_ID=asst_...   # Your assistant ID (REQUIRED)
```

**Never commit `.env` to git!** Vercel handles this securely.

## API Endpoints

### Create Thread
```bash
POST /api/threads
Response: { "threadId": "thread_..." }
```

### Send Message
```bash
POST /api/messages
Body: {
  "threadId": "thread_...",
  "message": "Hello!"
}
Response: {
  "message": "Assistant's response...",
  "threadId": "thread_..."
}
```

## Customization

### Widget Colors
- `primaryColor`: Main color for buttons, headers, user messages
- `secondaryColor`: Background color for the chat area

### Widget Appearance
- `widgetName`: Title of the widget
- `logoUrl`: URL to your logo image
- `welcomeMessage`: Initial greeting message
- `subtitle`: Secondary text in header

## Performance

- **Widget size**: ~15KB minified
- **Dependencies**: Zero (vanilla JavaScript)
- **Chat history**: Stored in OpenAI (survives page refresh)
- **Mobile-optimized**: Responsive design for all screen sizes

## Security

✅ **What's Secure:**
- API keys stored only on Vercel (server-side), never exposed to client
- Widget script contains no secrets or hardcoded sensitive data
- Communication via HTTPS (enforced by Vercel)
- CORS headers configured for cross-origin safety
- HTML escaping to prevent XSS attacks
- Rate limiting on all API endpoints (protect against abuse)
- Input validation (message length limits, type checking)
- Timeout protection (30s max per request)
- IP-based rate limiting to prevent API key abuse

⚠️ **Considerations:**
- Each user needs their own Vercel deployment and OpenAI API key
- OpenAI API costs scale with usage (standard OpenAI pricing)
- Thread storage managed by OpenAI (see their data retention policies)
- Rate limits can be adjusted in code if needed for your use case

## Troubleshooting

### Widget not appearing?
1. Check browser console for errors (F12 → Console)
2. Verify `apiUrl` in embed code matches your deployment
3. Check that CORS is enabled

### API errors?
1. Verify `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID` are set in Vercel
2. Check OpenAI API status at [status.openai.com](https://status.openai.com)
3. Ensure assistant has File Search enabled

### Embed code not working on Systeme.io?
1. Use HTML block, not Text block
2. Ensure no other jQuery/conflicting scripts
3. Try refreshing the page after pasting

## Deployment Checklist

- [ ] Created OpenAI Assistant with File Search enabled
- [ ] Have your API key ready
- [ ] Forked/cloned repo to GitHub
- [ ] Connected repo to Vercel
- [ ] Set environment variables in Vercel
- [ ] Tested widget at your deployment URL
- [ ] Customized colors and branding
- [ ] Copied embed code
- [ ] Pasted on your website
- [ ] Tested widget on live site

## Cost Estimate

- **Vercel**: Free tier covers most use cases (~100K API calls/month included)
- **OpenAI API**: Pay-per-use (~$0.0001-$0.001 per message depending on model)
- **Example**: 1,000 messages/month ≈ $0.10-$1.00

See [OpenAI Pricing](https://openai.com/pricing) for current rates.

## Limitations

- One widget per Vercel deployment (create multiple deployments for multiple widgets)
- File Search limited to what's in your OpenAI assistant
- Thread storage subject to OpenAI's retention policies
- Real-time communication limited by OpenAI API response times

## Support & Issues

- 📖 Check this README first
- 🐛 Found a bug? Open an issue on GitHub
- 💡 Feature request? Let us know!

## License

MIT - Use this however you want!

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Customize your widget
3. ✅ Embed on your site
4. 🎉 Start chatting with your users!

---

Made with ❤️ for creators and businesses who want an easy, secure AI widget.

Questions? Check out the [OpenAI Assistants docs](https://platform.openai.com/docs/assistants) or the [Vercel deployment guide](https://vercel.com/docs).
