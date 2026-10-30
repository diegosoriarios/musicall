import type { ReactNode } from 'react'
import styled from 'styled-components'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xxl}px ${({ theme }) => theme.space.lg}px;
  text-align: center;
`

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: ${({ theme }) => theme.space.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.accentHover};
`

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.lg};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.02em;
`

const Description = styled.p`
  max-width: 440px;
  margin: ${({ theme }) => theme.space.sm}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.md};
`

const ActionWrap = styled.div`
  margin-top: ${({ theme }) => theme.space.lg}px;
`

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Container>
      {icon ? <IconWrap>{icon}</IconWrap> : null}
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {action ? <ActionWrap>{action}</ActionWrap> : null}
    </Container>
  )
}
