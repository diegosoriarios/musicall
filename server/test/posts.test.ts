import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import app from '../src/app.js'
import { createUser, sessionCookieFor, type TestUser } from './helpers.js'

function createPost(user: TestUser, content: string) {
  return request(app).post('/api/posts').set('Cookie', sessionCookieFor(user)).send({ content })
}

describe('posts routes', () => {
  let user: TestUser

  beforeEach(async () => {
    user = await createUser({ id: 'posts-user', username: 'poster' })
  })

  it('requires authentication', async () => {
    await request(app).get('/api/posts').expect(401)
    await request(app).post('/api/posts').send({ content: 'hello' }).expect(401)
    await request(app).delete('/api/posts/1').expect(401)
  })

  it('creates a post and returns its id', async () => {
    const response = await createPost(user, 'Hello music').expect(201)
    expect(response.body).toEqual({ id: expect.any(Number) })
  })

  it('rejects empty content', async () => {
    const response = await createPost(user, '   ').expect(400)
    expect(response.body).toMatchObject({ error: 'Validation failed' })
  })

  it('rejects content over 500 characters', async () => {
    await createPost(user, 'a'.repeat(501)).expect(400)
  })

  it('lists posts with pagination and a total count header', async () => {
    for (let index = 0; index < 6; index += 1) {
      await createPost(user, `Post ${index}`).expect(201)
    }

    const firstPage = await request(app)
      .get('/api/posts?page=1')
      .set('Cookie', sessionCookieFor(user))
      .expect(200)

    expect(firstPage.body).toHaveLength(5)
    expect(firstPage.headers['x-total-count']).toBe('6')
    expect(firstPage.body[0]).toMatchObject({
      user_id: user.id,
      username: user.username,
      avatar: user.avatar,
    })

    const secondPage = await request(app)
      .get('/api/posts?page=2')
      .set('Cookie', sessionCookieFor(user))
      .expect(200)

    expect(secondPage.body).toHaveLength(1)
    expect(secondPage.headers['x-total-count']).toBe('6')
  })

  it('rejects an invalid page number', async () => {
    await request(app).get('/api/posts?page=0').set('Cookie', sessionCookieFor(user)).expect(400)
  })

  it('prevents deleting another user post', async () => {
    const otherUser = await createUser({ id: 'other-user', username: 'other' })
    const created = await createPost(otherUser, 'Not yours').expect(201)

    const response = await request(app)
      .delete(`/api/posts/${created.body.id}`)
      .set('Cookie', sessionCookieFor(user))
      .expect(403)

    expect(response.body).toEqual({ error: 'Operation not permitted' })
  })

  it('deletes an own post', async () => {
    const created = await createPost(user, 'Delete me').expect(201)

    await request(app)
      .delete(`/api/posts/${created.body.id}`)
      .set('Cookie', sessionCookieFor(user))
      .expect(204)

    const feed = await request(app)
      .get('/api/posts')
      .set('Cookie', sessionCookieFor(user))
      .expect(200)

    expect(feed.body).toEqual([])
    expect(feed.headers['x-total-count']).toBe('0')
  })

  it('returns 404 when deleting a missing post', async () => {
    const response = await request(app)
      .delete('/api/posts/9999')
      .set('Cookie', sessionCookieFor(user))
      .expect(404)

    expect(response.body).toEqual({ error: 'Post not found' })
  })
})
