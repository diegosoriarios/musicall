import type { ReactNode } from 'react'
import styled from 'styled-components'

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.md}px ${({ theme }) => theme.space.lg}px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.sizes.sm};
`

interface ErrorBannerProps {
  message: string
  action?: ReactNode
}

export function ErrorBanner({ message, action }: ErrorBannerProps) {
  return (
    <Banner role="alert">
      <span>{message}</span>
      {action}
    </Banner>
  )
}
