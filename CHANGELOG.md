# Changelog

All notable changes to the AI Chat Widget project will be documented in this file.

## [1.0.0] - 2026-01-17

### Added
- **Embed Script - Production Version (embed.prod.js)**
  - Comprehensive error handling with try-catch blocks
  - Timeout protection (30-second max for API calls)
  - Retry logic with exponential backoff (up to 3 retries)
  - XSS prevention through text sanitization
  - Input validation (message length, content type)
  - LocalStorage fallback when unavailable
  - Console logging with version tracking

- **Configuration Encoding**
  - Base64 URL parameter configuration
  - Secure config decompression with fallbacks
  - Config validation before rendering

- **Security Features**
  - X-Content-Type-Options: nosniff headers
  - X-Frame-Options: DENY for API endpoints
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - CORS properly configured for cross-origin requests
  - API key stays server-side only

- **Performance Optimizations**
  - Lazy widget rendering (creates DOM only on first click)
  - Lightweight script: 2.5KB (Phase 1) → 12KB (Phase 2) → 15KB (Phase 3)
  - Gzipped size: ~4KB
  - Inline CSS (no external stylesheets)
  - Efficient DOM manipulation
  - requestIdleCallback for non-critical work

- **Features**
  - Real-time chat with streaming support
  - Message sending to /api/messages endpoint
  - Thread creation via /api/threads endpoint
  - LocalStorage persistence for thread IDs
  - Dark/light theme toggle
  - Mobile responsive design (tested at 480px)
  - Hover effects and smooth animations
  - Keyboard support (Enter to send)

- **Configuration Options**
  - Widget title
  - Primary color (for button and header)
  - Secondary color (for backgrounds)
  - Text color (for header)
  - Placeholder text (for input field)
  - Footer text
  - Theme selection (light/dark)
  - API URL configuration
  - Logging toggle for development

- **Testing & Documentation**
  - Phase 1 Test (test.html): Minimal embed validation
  - Phase 2 Test (embed-test.html): Full feature testing
  - Comprehensive Embed Guide (EMBED_GUIDE.md)
  - API endpoint documentation
  - Platform-specific installation instructions
  - Troubleshooting guide
  - Security documentation

### Enhanced
- **EmbedCodeGenerator Component**
  - Updated to use new base64 config encoding
  - Shows current configuration details
  - Improved installation instructions
  - Added important notes about deployment

- **next.config.js**
  - Enhanced CORS headers for API routes
  - Security headers for embed scripts
  - Cache control headers
  - MIME-type sniffing prevention

### Fixed
- Proper error handling in DOM injection
- Graceful fallback when localStorage unavailable
- Validation of configuration parameters
- Safe message sanitization

### Technical Details

#### File Structure
```
/public/
├── embed.js           (2.5KB - Minimal production version)
├── embed-dev.js       (4.1KB - Development version with comments)
├── embed-enhanced.js  (12KB - Full feature version)
├── embed.prod.js      (15KB - Production hardened version)
├── test.html          (8.9KB - Phase 1 test suite)
├── embed-test.html    (14KB - Phase 2 test suite)
```

#### Bundle Size Metrics
- **Phase 1 (Minimal):** 2.5KB
- **Phase 2 (Enhanced):** 12KB  
- **Phase 3 (Production):** 15KB (includes comprehensive error handling)
- **Gzipped Size:** ~4KB
- **All under 25KB limit** ✓

#### Browser Compatibility
- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Mobile browsers (iOS/Android)

#### Accessibility
- ✓ Keyboard support (Enter to send)
- ✓ Focus indicators on buttons/inputs
- ✓ ARIA-friendly semantic HTML
- ✓ Color contrast compliant

### Security Checklist
- ✓ API keys kept server-side only
- ✓ XSS prevention through sanitization
- ✓ CORS properly configured
- ✓ Content-Type headers prevent MIME sniffing
- ✓ Timeout protection on API calls
- ✓ Input validation (max 4000 chars)
- ✓ No eval() or dangerous functions
- ✓ CSP compatible configuration

### Performance Checklist
- ✓ Script under 25KB
- ✓ Gzipped under 8KB
- ✓ No render-blocking resources
- ✓ Inline CSS (no external files)
- ✓ Lazy DOM creation
- ✓ Efficient event handlers
- ✓ Minimal repaint/reflow

## Deployment Notes

### Production Deployment
1. Use `embed.prod.js` for security and stability
2. Verify `X-Content-Type-Options: nosniff` header
3. Test CORS on target domains
4. Monitor API error rates
5. Set up error logging/tracking

### Staging Environment
Test on https://staging.yourdomain.com before production

### Monitoring
- Monitor `/api/threads` endpoint rate limiting (100 req/min)
- Monitor `/api/messages` endpoint rate limiting (30 req/min)
- Track API response times
- Monitor error rates and logs

## Future Enhancements
- Streaming response support
- File upload support
- Custom themes preset library
- Analytics and usage tracking
- Webhook support for integrations
- A/B testing framework
- Custom prompt templates
