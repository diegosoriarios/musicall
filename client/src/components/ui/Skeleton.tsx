import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
`

export const Skeleton = styled.div<{
  $width?: string
  $height?: string
  $radius?: string
}>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '16px' }) => $height};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radii.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceRaised} 20%,
    ${({ theme }) => theme.colors.surfaceHover} 40%,
    ${({ theme }) => theme.colors.surfaceRaised} 60%
  );
  background-size: 220% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`
