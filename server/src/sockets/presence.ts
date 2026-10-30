import { z } from 'zod'
import type { MusicallServer, MusicallSocket } from './index.js'

interface ListeningUser {
  userId: string
  username: string
  band: string
  songName: string
}

// userId -> what the user is currently listening to
const listeners = new Map<string, ListeningUser>()

const playingSchema = z.object({
  band: z.string().trim().min(1).max(200),
  songName: z.string().trim().min(1).max(200),
})

function broadcastState(io: MusicallServer): void {
  io.emit('presence:state', [...listeners.values()])
}

export function registerPresenceHandlers(io: MusicallServer, socket: MusicallSocket): void {
  const { userId, username } = socket.data

  socket.emit('presence:state', [...listeners.values()])

  socket.on('presence:playing', (payload: unknown) => {
    const parsed = playingSchema.safeParse(payload)
    if (!parsed.success) return

    listeners.set(userId, {
      userId,
      username,
      band: parsed.data.band,
      songName: parsed.data.songName,
    })
    broadcastState(io)
  })

  socket.on('presence:stop', () => {
    if (listeners.delete(userId)) broadcastState(io)
  })

  socket.on('disconnect', () => {
    if (listeners.delete(userId)) broadcastState(io)
  })
}
