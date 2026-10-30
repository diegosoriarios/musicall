import styled from 'styled-components'
import type { ReactNode } from 'react'
import { customColors } from '../assets/colors'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${customColors.black};
  justify-content: center;
  align-items: center;
  position: relative;
`

const Title = styled.h2`
  color: white;
`

const RightButton = styled.div`
  position: absolute;
  right: 4%;
`

interface HeaderProps {
  title: string
  children?: ReactNode
}

export default function Header({ title, children = null }: HeaderProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <RightButton>{children}</RightButton>
    </Container>
  )
}
