import { css } from 'styled-components'

export const inputStyles = css`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 14px;
  outline: none;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`
