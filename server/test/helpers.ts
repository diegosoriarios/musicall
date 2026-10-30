import type { Response } from 'supertest'
import { db } from '../src/database/connection.js'
import { signSessionToken } from '../src/modules/auth/session.js'

export interface TestUser {
  id: string
  username: string
  email: string
  avatar: string
  spotify_refresh_token: string | null
  session_version: number
}

export async function createUser(overrides: Partial<TestUser> = {}): Promise<TestUser> {
  const user: TestUser = {
    id: 'user-1',
    username: 'user1',
    email: 'user1@example.com',
    avatar: 'https://example.com/avatar.png',
    spotify_refresh_token: null,
    session_version: 0,
    ...overrides,
  }

  await db('users').insert(user)
  return user
}

export function sessionCookieFor(
  user: Pick<TestUser, 'id' | 'username' | 'session_version'>,
): string {
  const token = signSessionToken({
    sub: user.id,
    username: user.username,
    sv: user.session_version,
  })
  return `musicall_session=${token}`
}

export function readCookie(response: Response, name: string): string | undefined {
  const header = response.headers['set-cookie']
  if (!header) return undefined

  const cookies = Array.isArray(header) ? header : [header]
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  return match?.split(';')[0]?.split('=')[1]
}
