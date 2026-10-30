export interface User {
  id: string
  username: string
  email: string
  avatar: string
}

export interface Post {
  id: number
  content: string
  likes: number
  created_at: string
  user_id: string
  username: string
  avatar: string
}

export interface ChatMessage {
  user: string
  text: string
  at: number
}

export interface PresenceEntry {
  userId: string
  username: string
  band: string
  songName: string
}
