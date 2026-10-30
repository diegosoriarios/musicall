import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

describe('GET /api/health', () => {
  it('reports the service as healthy', async () => {
    const response = await request(app).get('/api/health').expect(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
