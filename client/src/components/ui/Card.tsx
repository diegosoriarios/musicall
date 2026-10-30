import styled from 'styled-components'

export const Card = styled.div<{ $padding?: 'none' | 'md' | 'lg' }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'md':
        return `${theme.space.md}px`
      case 'lg':
      default:
        return `${theme.space.lg}px`
    }
  }};
`
