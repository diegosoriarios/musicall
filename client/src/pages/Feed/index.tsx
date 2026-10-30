import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { DeleteIcon, FavoriteBorderIcon } from '../../components/icons'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { Field } from '../../components/ui/Field'
import { TextArea } from '../../components/ui/inputs'
import { IconButton } from '../../components/ui/IconButton'
import { PageHeader } from '../../components/ui/PageHeader'
import { Skeleton } from '../../components/ui/Skeleton'
import type { Post } from '../../types'
import { FeedIcon } from '../../components/icons'

const Page = styled.div`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md}px;
`

const Composer = styled(Card)`
  margin-bottom: ${({ theme }) => theme.space.lg}px;
`

const ComposerTop = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md}px;
`

const ComposerForm = styled.form`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
`

const ComposerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
`

const PostCard = styled(Card)`
  padding: ${({ theme }) => theme.space.lg}px;
`

const PostHeader = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
`

const PostAuthor = styled.div`
  min-width: 0;
  flex: 1;
`

const AuthorLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  flex-wrap: wrap;
`

const Username = styled.h3`
  margin: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Timestamp = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
`

const PostContent = styled.p`
  margin: ${({ theme }) => theme.space.md}px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.md};
  line-height: 1.65;
  overflow-wrap: anywhere;
`

const PostFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-top: ${({ theme }) => theme.space.lg}px;
  padding-top: ${({ theme }) => theme.space.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
`

const LikeMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
`

const LoadMoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.lg}px;
`

const SkeletonPost = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md}px;
`

function formatPostDate(sqlDate: string): string {
  const parsed = new Date(sqlDate.includes('T') ? sqlDate : `${sqlDate.replace(' ', 'T')}Z`)
  if (Number.isNaN(parsed.getTime())) return sqlDate

  const seconds = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604_800) return `${Math.floor(seconds / 86_400)}d ago`

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: parsed.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

export default function Feed() {
  const { user } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadFeed = useCallback(async (targetPage: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Post[]>('/posts', {
        params: { page: targetPage },
      })
      const totalFromHeader = Number(response.headers['x-total-count'] ?? 0)
      setTotal(totalFromHeader)
      setPosts((prev) => (targetPage === 1 ? response.data : [...prev, ...response.data]))
      setPage(targetPage)
    } catch {
      setError('Failed to load the feed.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadFeed(1)
  }, [loadFeed])

  async function handleCreatePost(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || posting) return

    setPosting(true)
    setError('')
    try {
      await api.post('/posts', { content: trimmed })
      setContent('')
      await loadFeed(1)
    } catch {
      setError('Failed to create the post.')
    } finally {
      setPosting(false)
    }
  }

  async function handleDeletePost(id: number) {
    setDeletingId(id)
    setError('')
    try {
      await api.delete(`/posts/${id}`)
      await loadFeed(1)
    } catch {
      setError('Failed to delete the post.')
    } finally {
      setDeletingId(null)
    }
  }

  const hasMore = posts.length < total
  const initialLoading = loading && posts.length === 0

  return (
    <Page>
      <PageHeader
        eyebrow="Community"
        title="Feed"
        description="Share what you are listening to and see what is moving everyone else."
      />

      <Composer as="section" aria-label="Create a post">
        <ComposerTop>
          <Avatar src={user?.avatar} name={user?.username ?? 'You'} size={44} />
          <ComposerForm onSubmit={(event) => void handleCreatePost(event)}>
            <Field
              label="New post"
              hideLabel
              count={`${content.length}/500`}
              hint="Keep it about music, discoveries, or what is on repeat."
            >
              <TextArea
                placeholder="Share something about music..."
                value={content}
                maxLength={500}
                onChange={(event) => setContent(event.target.value)}
                aria-label="New post"
              />
            </Field>
            <ComposerFooter>
              <span aria-hidden="true" />
              <Button type="submit" disabled={!content.trim()} loading={posting}>
                Post
              </Button>
            </ComposerFooter>
          </ComposerForm>
        </ComposerTop>
      </Composer>

      {error ? (
        <ErrorBanner
          message={error}
          action={
            <Button size="sm" variant="secondary" onClick={() => void loadFeed(1)}>
              Retry
            </Button>
          }
        />
      ) : null}

      <Stack>
        {initialLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonPost key={index}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Skeleton $width="44px" $height="44px" $radius="50%" />
                  <div style={{ flex: 1 }}>
                    <Skeleton $width="140px" />
                    <div style={{ height: 8 }} />
                    <Skeleton $width="90px" $height="12px" />
                  </div>
                </div>
                <Skeleton $height="58px" $radius="12px" />
              </SkeletonPost>
            ))}
          </>
        ) : posts.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FeedIcon />}
              title="The feed is quiet"
              description="Be the first to share a track, an artist, or a thought with the community."
            />
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} as="article">
              <PostHeader>
                <Avatar src={post.avatar} name={post.username} size={44} />
                <PostAuthor>
                  <AuthorLine>
                    <Username>{post.username}</Username>
                    {post.user_id === user?.id ? <Timestamp>You</Timestamp> : null}
                  </AuthorLine>
                  <Timestamp>{formatPostDate(post.created_at)}</Timestamp>
                </PostAuthor>
                {post.user_id === user?.id ? (
                  <IconButton
                    label="Delete post"
                    tone="danger"
                    onClick={() => void handleDeletePost(post.id)}
                    disabled={deletingId === post.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </PostHeader>

              <PostContent>{post.content}</PostContent>

              <PostFooter>
                <LikeMeta>
                  <FavoriteBorderIcon />
                  {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                </LikeMeta>
              </PostFooter>
            </PostCard>
          ))
        )}
      </Stack>

      {hasMore ? (
        <LoadMoreWrap>
          <Button variant="secondary" onClick={() => void loadFeed(page + 1)} loading={loading}>
            Load more
          </Button>
        </LoadMoreWrap>
      ) : null}
    </Page>
  )
}
