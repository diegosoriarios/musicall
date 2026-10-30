import { describe, expect, it } from 'vitest'
import { isRoomAuthorized } from '../src/sockets/chat.js'

describe('chat room authorization', () => {
  it('allows public rooms', () => {
    expect(isRoomAuthorized('jazz', 'user-a')).toBe(true)
    expect(isRoomAuthorized('lo-fi beats', 'user-b')).toBe(true)
  })

  it('allows a canonical DM for either participant', () => {
    expect(isRoomAuthorized('dm:alice:bob', 'alice')).toBe(true)
    expect(isRoomAuthorized('dm:alice:bob', 'bob')).toBe(true)
  })

  it('rejects a DM for non-participants', () => {
    expect(isRoomAuthorized('dm:alice:bob', 'eve')).toBe(false)
  })

  it('rejects malformed or non-canonical DM rooms', () => {
    expect(isRoomAuthorized('dm:alice', 'alice')).toBe(false)
    expect(isRoomAuthorized('dm:alice:bob:charlie', 'alice')).toBe(false)
    expect(isRoomAuthorized('dm:alice:alice', 'alice')).toBe(false)
    expect(isRoomAuthorized('dm:bob:alice', 'alice')).toBe(false)
  })
})
