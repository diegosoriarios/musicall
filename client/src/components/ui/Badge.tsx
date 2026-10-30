import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

type BadgeTone = 'accent' | 'neutral' | 'muted'

const StyledBadge = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.04em;
  line-height: 1;
  white-space: nowrap;

  ${({ $tone, theme }) => {
    switch ($tone) {
      case 'accent':
        return css`
          background: ${theme.colors.accentSoft};
          border-color: rgba(29, 185, 84, 0.22);
          color: ${theme.colors.accentHover};
        `
      case 'muted':
        return css`
          background: ${theme.colors.bgSoft};
          border-color: ${theme.colors.border};
          color: ${theme.colors.textFaint};
        `
      case 'neutral':
      default:
        return css`
          background: ${theme.colors.surfaceRaised};
          border-color: ${theme.colors.border};
          color: ${theme.colors.textMuted};
        `
    }
  }}
`

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <StyledBadge $tone={tone}>{children}</StyledBadge>
}
