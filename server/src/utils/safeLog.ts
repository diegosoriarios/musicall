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

export function logError(context: string, err: unknown): void {
  if (err instanceof Error) {
    console.error(context, {
      name: err.name,
      message: redact(err.message),
      stack: err.stack ? redact(err.stack) : undefined,
    })
    return
  }

  console.error(context, { message: redact(String(err)) })
}
