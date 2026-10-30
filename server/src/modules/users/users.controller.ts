import type { Request, Response } from 'express'
import { db } from '../../database/connection.js'

export interface PublicUser {
  id: string
  username: string
  avatar: string
}

// Users are listed for the social features. Email is intentionally excluded (PII).
export async function listUsers(req: Request, res: Response): Promise<void> {
  const users = await db('users')
    .select<PublicUser[]>(['id', 'username', 'avatar'])
    .orderBy('username', 'asc')

  res.json(users)
}
