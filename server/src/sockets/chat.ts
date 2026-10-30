import { z } from 'zod'
import type { MusicallServer, MusicallSocket } from './index.js'

interface ChatUser {
  username: string
  room: string
}

// socketId -> chat user
const usersBySocket = new Map<string, ChatUser>()

const joinSchema = z.object({
  room: z.string().trim().min(1).max(64),
})

const messageSchema = z.object({
  text: z.string().trim().min(1).max(500),
})

function getUsersInRoom(room: string): string[] {
  return [...usersBySocket.values()]
    .filter((user) => user.room === room)
    .map((user) => user.username)
    .filter((username, index, all) => all.indexOf(username) === index)
}

export function isRoomAuthorized(room: string, userId: string): boolean {
  if (!room.startsWith('dm:')) return true

  const parts = room.split(':')
  if (parts.length !== 3) return false

  const [, first, second] = parts
  if (!first || !second || first === second) return false

  const canonical = first < second ? `${first}:${second}` : `${second}:${first}`
  if (`dm:${canonical}` !== room) return false

  return first === userId || second === userId
}

export function registerChatHandlers(io: MusicallServer, socket: MusicallSocket): void {
  const { userId, username } = socket.data

  socket.on('chat:join', (payload: unknown, callback?: (response: unknown) => void) => {
    const parsed = joinSchema.safeParse(payload)
    if (!parsed.success) {
      callback?.({ error: 'Invalid room' })
      return
    }

    const room = parsed.data.room

    if (!isRoomAuthorized(room, userId)) {
      callback?.({ error: 'Room not available' })
      return
    }

    // Leave any previous chat room before joining a new one
    const previous = usersBySocket.get(socket.id)
    if (previous) socket.leave(`chat:${previous.room}`)

    usersBySocket.set(socket.id, { username, room })
    socket.join(`chat:${room}`)

    socket.emit('chat:message', {
      user: 'admin',
      text: `${username}, welcome to the room ${room}`,
      at: Date.now(),
    })

    socket.broadcast.to(`chat:${room}`).emit('chat:message', {
      user: 'admin',
      text: `${username} has joined!`,
      at: Date.now(),
    })

    io.to(`chat:${room}`).emit('chat:users', getUsersInRoom(room))
    callback?.({ room, users: getUsersInRoom(room) })
  })

  socket.on('chat:message', (payload: unknown, callback?: (response: unknown) => void) => {
    const parsed = messageSchema.safeParse(payload)
    const user = usersBySocket.get(socket.id)
    if (!parsed.success || !user) {
      callback?.({ error: 'Cannot send message' })
      return
    }

    io.to(`chat:${user.room}`).emit('chat:message', {
      user: username,
      text: parsed.data.text,
      at: Date.now(),
    })
    callback?.({ ok: true })
  })

  socket.on('disconnect', () => {
    const user = usersBySocket.get(socket.id)
    if (!user) return
    usersBySocket.delete(socket.id)

    socket.broadcast.to(`chat:${user.room}`).emit('chat:message', {
      user: 'admin',
      text: `${username} has left.`,
      at: Date.now(),
    })
    io.to(`chat:${user.room}`).emit('chat:users', getUsersInRoom(user.room))

    // userId is reserved for future per-user cleanup (e.g. persisted history)
    void userId
  })
}
