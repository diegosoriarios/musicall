import type { ReactNode } from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
}

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.lg}px;
  margin-bottom: ${({ theme }) => theme.space.xl}px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.space.md}px;
  }
`

const Copy = styled.div`
  min-width: 0;
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.space.sm}px;
  color: ${({ theme }) => theme.colors.accentHover};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(28px, 4vw, 40px);
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.04em;
  line-height: 1.08;
`

const Description = styled.p`
  max-width: 620px;
  margin: ${({ theme }) => theme.space.sm}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.md};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  flex-wrap: wrap;
`

export function PageHeader({ title, eyebrow, description, actions }: PageHeaderProps) {
  return (
    <Header>
      <Copy>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </Copy>
      {actions ? <Actions>{actions}</Actions> : null}
    </Header>
  )
}
