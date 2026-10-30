import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'
import { isProduction } from '../config/env.js'

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' })
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  console.error(`Unhandled error on ${req.method} ${req.path}:`, err)
  res.status(500).json({
    error: isProduction ? 'Internal server error' : String(err),
  })
}
