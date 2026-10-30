import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Ring = styled.span<{ $size: number }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;
  flex: none;
`

export function Spinner({ size = 20 }: { size?: number }) {
  return <Ring $size={size} aria-hidden="true" />
}
