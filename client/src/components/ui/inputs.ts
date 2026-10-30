import styled from 'styled-components'
import { inputStyles } from './inputStyles'

export const TextInput = styled.input`
  ${inputStyles}
  min-height: 46px;
`

export const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 104px;
  resize: vertical;
  line-height: 1.5;
`
