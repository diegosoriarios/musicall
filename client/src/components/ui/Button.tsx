import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
}

const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.surfaceRaised};
          border-color: ${theme.colors.borderStrong};
          color: ${theme.colors.text};

          &:hover:not(:disabled) {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.borderStrong};
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.textMuted};

          &:hover:not(:disabled) {
            background: ${theme.colors.surfaceHover};
            color: ${theme.colors.text};
          }
        `
      case 'danger':
        return css`
          background: ${theme.colors.dangerSoft};
          border-color: rgba(248, 113, 113, 0.24);
          color: ${theme.colors.danger};

          &:hover:not(:disabled) {
            background: rgba(248, 113, 113, 0.2);
          }
        `
      case 'primary':
      default:
        return css`
          background: ${theme.colors.accent};
          color: ${theme.colors.accentText};

          &:hover:not(:disabled) {
            background: ${theme.colors.accentHover};
          }
        `
    }
  }}

  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          min-height: 36px;
          padding: 0 14px;
          font-size: ${theme.font.sizes.xs};
        `
      case 'lg':
        return css`
          min-height: 50px;
          padding: 0 24px;
          font-size: ${theme.font.sizes.md};
        `
      case 'md':
      default:
        return css`
          min-height: 44px;
          padding: 0 18px;
          font-size: ${theme.font.sizes.sm};
        `
    }
  }}
`

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      {...rest}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 18} /> : leftIcon}
      {children}
    </StyledButton>
  )
}
