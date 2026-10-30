import type { Server as HttpServer } from 'node:http'
import { Server, type DefaultEventsMap, type Socket } from 'socket.io'
import cookie from 'cookie'
import { env } from '../config/env.js'
import { SESSION_COOKIE, verifySessionToken } from '../modules/auth/session.js'
import { registerChatHandlers } from './chat.js'
import { registerPresenceHandlers } from './presence.js'

export interface SocketData {
  userId: string
  username: string
}

export type MusicallSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>

export type MusicallServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>

let io: MusicallServer | null = null

export function registerSockets(httpServer: HttpServer): MusicallServer {
  const server: MusicallServer = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  })

  server.use((socket, next) => {
    const header = socket.request.headers.cookie
    if (!header) return next(new Error('Not authenticated'))

    const cookies = cookie.parse(header)
    const token = cookies[SESSION_COOKIE]
    if (!token) return next(new Error('Not authenticated'))

    const session = verifySessionToken(token)
    if (!session) return next(new Error('Not authenticated'))

    socket.data.userId = session.sub
    socket.data.username = session.username
    next()
  })

  server.on('connection', (socket) => {
    registerChatHandlers(server, socket)
    registerPresenceHandlers(server, socket)
  })

  io = server
  return server
}

export function getIo(): MusicallServer {
  if (!io) throw new Error('Socket.IO has not been initialized')
  return io
}
