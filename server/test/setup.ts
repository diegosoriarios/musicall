import { afterAll, afterEach, beforeAll } from 'vitest'
import { db, runMigrations } from '../src/database/connection.js'

beforeAll(async () => {
  await runMigrations()
})

afterEach(async () => {
  await db('posts').del()
  await db('users').del()
})

afterAll(async () => {
  await db.destroy()
})
