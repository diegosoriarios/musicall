import { Link } from 'react-router-dom'
import styled from 'styled-components'
import iconImg from '../../assets/icon.png'

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  min-width: 0;
`

const Mark = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  object-fit: cover;
  flex: none;
`

const Wordmark = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.lg};
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.045em;
  line-height: 1;
`

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Brand to="/" aria-label="Musicall home">
      <Mark src={iconImg} alt="" aria-hidden="true" />
      {compact ? null : <Wordmark>Musicall</Wordmark>}
    </Brand>
  )
}
