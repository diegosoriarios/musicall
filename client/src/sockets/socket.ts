import { io, type Socket } from 'socket.io-client'
import { API_URL } from '../api/client'

/**
 * Singleton Socket.IO connection. The httpOnly session cookie is attached
 * automatically by the browser; the server rejects unauthenticated sockets.
 */
export const socket: Socket = io(API_URL || '/', {
  withCredentials: true,
  autoConnect: true,
})
