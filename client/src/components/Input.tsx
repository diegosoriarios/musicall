import styled from 'styled-components'
import { SendIcon } from './icons'
import { IconButton } from './ui/IconButton'

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ theme }) => theme.space.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const TextInput = styled.input`
  min-width: 0;
  flex: 1;
  min-height: 46px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  outline: none;
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`

interface InputProps {
  message: string
  setMessage: (message: string) => void
  sendMessage: (event: React.FormEvent) => void
}

export default function Input({ message, setMessage, sendMessage }: InputProps) {
  return (
    <Form onSubmit={sendMessage}>
      <TextInput
        type="text"
        placeholder="Type a message..."
        value={message}
        maxLength={500}
        onChange={({ target: { value } }) => setMessage(value)}
        aria-label="Message"
        autoComplete="off"
      />
      <IconButton label="Send message" tone="solid" type="submit" disabled={!message.trim()}>
        <SendIcon />
      </IconButton>
    </Form>
  )
}
