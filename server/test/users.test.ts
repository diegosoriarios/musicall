import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'
import { createUser, sessionCookieFor } from './helpers.js'

describe('users routes', () => {
  it('requires authentication', async () => {
    await request(app).get('/api/users').expect(401)
  })

  it('lists public user fields without email', async () => {
    const first = await createUser({ id: 'user-a', username: 'alice' })
    const second = await createUser({ id: 'user-b', username: 'bob' })

    const response = await request(app)
      .get('/api/users')
      .set('Cookie', sessionCookieFor(first))
      .expect(200)

    expect(response.body).toEqual([
      { id: first.id, username: first.username, avatar: first.avatar },
      { id: second.id, username: second.username, avatar: second.avatar },
    ])

    for (const user of response.body) {
      expect(user).not.toHaveProperty('email')
      expect(user).not.toHaveProperty('spotify_refresh_token')
    }
  })
})
