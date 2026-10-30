import { fileURLToPath } from 'node:url'
import path from 'node:path'
import knex, { type Knex } from 'knex'
import { env } from '../config/env.js'
import * as createUsers from './migrations/create_users.js'
import * as createPosts from './migrations/create_posts.js'
import * as addSessionVersion from './migrations/add_session_version.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isMemoryDatabase = env.DB_FILENAME === ':memory:'

export const db: Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: isMemoryDatabase ? ':memory:' : path.resolve(process.cwd(), env.DB_FILENAME),
  },
  useNullAsDefault: true,
  ...(isMemoryDatabase ? { pool: { min: 1, max: 1 } } : {}),
})

// Static migration source: the same code runs in dev (tsx) and production
// (tsc build) without depending on migration file extensions on disk.
const migrations: Record<
  string,
  { up: (knex: Knex) => Promise<void>; down: (knex: Knex) => Promise<void> }
> = {
  '20260926000001_create_users': createUsers,
  '20260926000002_create_posts': createPosts,
  '20261030000003_add_session_version': addSessionVersion,
}

class StaticMigrationSource {
  getMigrations(): Promise<string[]> {
    return Promise.resolve(Object.keys(migrations).sort())
  }

  getMigrationName(migration: string): string {
    return migration
  }

  getMigration(
    migration: string,
  ): Promise<{ up: (knex: Knex) => Promise<void>; down: (knex: Knex) => Promise<void> }> {
    return Promise.resolve(migrations[migration])
  }
}

export async function runMigrations(): Promise<void> {
  await db.migrate.latest({
    migrationSource: new StaticMigrationSource(),
  })
}
