import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { env } from '../../config/env.js'

const VERSION = 'v1'
const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const KEY = createHash('sha256').update(`musicall:spotify-refresh-token:${env.JWT_SECRET}`).digest()

export function isEncryptedToken(value: string): boolean {
  return value.startsWith(`${VERSION}.`)
}

export function encryptToken(token: string): string {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return [
    VERSION,
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.')
}

export function decryptToken(stored: string): string | null {
  if (!isEncryptedToken(stored)) return stored

  const [, ivValue, tagValue, ciphertextValue] = stored.split('.')
  if (!ivValue || !tagValue || !ciphertextValue) return null

  try {
    const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivValue, 'base64url'))
    decipher.setAuthTag(Buffer.from(tagValue, 'base64url'))
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue, 'base64url')),
      decipher.final(),
    ])
    return plaintext.toString('utf8')
  } catch {
    return null
  }
}
