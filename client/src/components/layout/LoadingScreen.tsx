import styled from 'styled-components'
import { Logo } from '../ui/Logo'
import { Spinner } from '../ui/Spinner'

const Screen = styled.div`
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.lg}px;
  padding: ${({ theme }) => theme.space.lg}px;
  background: ${({ theme }) => theme.colors.bg};
  background-image: ${({ theme }) => theme.gradients.pageGlow};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`

const Status = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.sm};
`

export function LoadingScreen({ label = 'Loading your music...' }: { label?: string }) {
  return (
    <Screen>
      <Logo />
      <Spinner size={24} />
      <Status>{label}</Status>
    </Screen>
  )
}
