import { env } from '../config/env.js'

const sensitiveValues = [env.SPOTIFY_CLIENT_SECRET, env.JWT_SECRET].filter(
  (value) => value.length > 0,
)

const sensitivePatterns: Array<[RegExp, string]> = [
  [/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer [REDACTED]'],
  [/\bBasic\s+[A-Za-z0-9+/=-]+/gi, 'Basic [REDACTED]'],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]'],
]

export function redact(value: string): string {
  let output = value
  for (const secret of sensitiveValues) {
    output = output.split(secret).join('[REDACTED]')
  }
  for (const [pattern, replacement] of sensitivePatterns) {
    output = output.replace(pattern, replacement)
  }
  return output
}

const maxLogDepth = 6
const maxLogArrayLength = 50

function isSensitiveKey(key: string): boolean {
  return /authorization|cookie|password|passphrase|secret|token/i.test(key)
}

export function redactValue(value: unknown, depth = 0): unknown {
  if (depth > maxLogDepth) return '[TRUNCATED]'
  if (typeof value === 'string') return redact(value)
  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.slice(0, maxLogArrayLength).map((item) => redactValue(item, depth + 1))
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveKey(key) ? '[REDACTED]' : redactValue(entry, depth + 1),
    ]),
  )
}

function errorDetails(err: Error): unknown {
  if (!('details' in err)) return undefined
  return redactValue(err.details)
}

export function logError(context: string, err: unknown): void {
  if (err instanceof Error) {
    console.error(context, {
      name: err.name,
      message: redact(err.message),
      details: errorDetails(err),
      stack: err.stack ? redact(err.stack) : undefined,
    })
    return
  }

  console.error(context, { message: redact(String(err)) })
}
