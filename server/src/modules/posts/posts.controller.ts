import type { Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../../database/connection.js'
import { AppError } from '../../utils/AppError.js'

const PAGE_SIZE = 5

const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(500, 'Content must be at most 500 characters'),
})

export interface PostRow {
  id: number
  content: string
  likes: number
  created_at: string
  user_id: string
  username: string
  avatar: string
}

export async function index(req: Request, res: Response): Promise<void> {
  const { page } = pageQuerySchema.parse(req.query)

  const [countRow] = await db('posts').count({ total: '*' })
  const total = Number(countRow?.total ?? 0)

  const posts = await db('posts')
    .join('users', 'users.id', '=', 'posts.user_id')
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)
    .orderBy('posts.created_at', 'desc')
    .select<PostRow[]>([
      'posts.id',
      'posts.content',
      'posts.likes',
      'posts.created_at',
      'posts.user_id',
      'users.username',
      'users.avatar',
    ])

  res.header('X-Total-Count', String(total))
  res.json(posts)
}

export async function create(req: Request, res: Response): Promise<void> {
  if (!req.userId) throw new AppError('Not authenticated', 401)

  const { content } = createPostSchema.parse(req.body)

  const [id] = await db('posts').insert({ content, user_id: req.userId })

  res.status(201).json({ id })
}

export async function destroy(req: Request, res: Response): Promise<void> {
  if (!req.userId) throw new AppError('Not authenticated', 401)

  const id = z.coerce.number().int().positive().parse(req.params.id)

  const post = await db('posts').where('id', id).select('user_id').first()

  if (!post) throw new AppError('Post not found', 404)
  if (post.user_id !== req.userId) throw new AppError('Operation not permitted', 403)

  await db('posts').where('id', id).delete()

  res.status(204).send()
}
