import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Post } from '../../types'
import { server } from '../../test/server'
import Feed from './index'

const authMocks = vi.hoisted(() => ({
  user: {
    id: 'user-1',
    username: 'Diego',
    email: 'diego@example.com',
    avatar: 'https://example.com/avatar.png',
  },
}))

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({ user: authMocks.user }),
}))

const currentUser = authMocks.user

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    content: 'A post',
    likes: 0,
    created_at: '2026-01-01T00:00:00.000Z',
    user_id: currentUser.id,
    username: currentUser.username,
    avatar: currentUser.avatar,
    ...overrides,
  }
}

describe('Feed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads the first page and appends more posts', async () => {
    const user = userEvent.setup()
    const firstPage = Array.from({ length: 5 }, (_, index) =>
      makePost({ id: index + 1, content: `Post ${index + 1}` }),
    )
    const secondPage = [makePost({ id: 6, content: 'Post 6' })]

    server.use(
      http.get('*/api/posts', ({ request }) => {
        const page = new URL(request.url).searchParams.get('page')
        return HttpResponse.json(page === '2' ? secondPage : firstPage, {
          headers: { 'X-Total-Count': '6' },
        })
      }),
    )

    render(<Feed />)

    expect(await screen.findByText('Post 1')).toBeInTheDocument()
    expect(screen.getAllByText(/^Post \d$/)).toHaveLength(5)

    await user.click(screen.getByRole('button', { name: 'Load more' }))

    expect(await screen.findByText('Post 6')).toBeInTheDocument()
    expect(screen.getAllByText(/^Post \d$/)).toHaveLength(6)
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('creates a post and reloads the feed', async () => {
    const user = userEvent.setup()
    let posts: Post[] = []

    server.use(
      http.get('*/api/posts', () =>
        HttpResponse.json(posts, {
          headers: { 'X-Total-Count': String(posts.length) },
        }),
      ),
      http.post('*/api/posts', async ({ request }) => {
        const body = (await request.json()) as { content: string }
        const post = makePost({ id: posts.length + 1, content: body.content })
        posts = [post, ...posts]
        return HttpResponse.json({ id: post.id }, { status: 201 })
      }),
    )

    render(<Feed />)

    const input = await screen.findByPlaceholderText('Share something about music...')
    await user.type(input, 'Great song')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(await screen.findByText('Great song')).toBeInTheDocument()
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('deletes only posts owned by the current user', async () => {
    const user = userEvent.setup()
    let posts = [
      makePost({ id: 1, content: 'Mine' }),
      makePost({ id: 2, content: 'Theirs', user_id: 'user-2', username: 'Other' }),
    ]

    server.use(
      http.get('*/api/posts', () =>
        HttpResponse.json(posts, {
          headers: { 'X-Total-Count': String(posts.length) },
        }),
      ),
      http.delete('*/api/posts/:id', ({ params }) => {
        posts = posts.filter((post) => post.id !== Number(params.id))
        return new HttpResponse(null, { status: 204 })
      }),
    )

    render(<Feed />)

    expect(await screen.findByText('Mine')).toBeInTheDocument()
    expect(screen.getByText('Theirs')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Delete post' })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Delete post' }))

    await waitFor(() => {
      expect(screen.queryByText('Mine')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Theirs')).toBeInTheDocument()
  })
})
