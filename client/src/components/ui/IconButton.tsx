import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

type IconButtonTone = 'ghost' | 'solid' | 'danger'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  tone?: IconButtonTone
  children: ReactNode
}

const StyledIconButton = styled.button<{ $tone: IconButtonTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  ${({ $tone, theme }) => {
    switch ($tone) {
      case 'solid':
        return css`
          background: ${theme.colors.accent};
          color: ${theme.colors.accentText};

          &:hover:not(:disabled) {
            background: ${theme.colors.accentHover};
            color: ${theme.colors.accentText};
          }
        `
      case 'danger':
        return css`
          color: ${theme.colors.danger};

          &:hover:not(:disabled) {
            background: ${theme.colors.dangerSoft};
            color: ${theme.colors.danger};
          }
        `
      case 'ghost':
      default:
        return null
    }
  }}
`

export function IconButton({
  label,
  tone = 'ghost',
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <StyledIconButton {...rest} type={type} $tone={tone} aria-label={label} title={label}>
      {children}
    </StyledIconButton>
  )
}
