import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface AvatarProps {
  src?: string | null
  name: string
  size?: number
  loading?: 'lazy' | 'eager'
  className?: string
}

const AvatarImage = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  flex: none;
`

const AvatarFallback = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.gradients.accent};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: ${({ $size }) => Math.max(11, Math.round($size * 0.32))}px;
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.03em;
  flex: none;
  user-select: none;
`

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  const initials = parts
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return initials || '?'
}

export function Avatar({ src, name, size = 40, loading = 'lazy', className }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (src && !failed) {
    return (
      <AvatarImage
        className={className}
        src={src}
        alt={name}
        $size={size}
        loading={loading}
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <AvatarFallback className={className} $size={size} role="img" aria-label={name}>
      {getInitials(name)}
    </AvatarFallback>
  )
}
