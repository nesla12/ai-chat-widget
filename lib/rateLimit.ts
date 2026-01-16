// Simple in-memory rate limiter
// In production, consider using Upstash or similar for distributed rate limiting

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const key = identifier

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs }
    return true
  }

  const record = store[key]

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return true
  }

  record.count++

  if (record.count > limit) {
    return false
  }

  return true
}

// Cleanup old entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000)
