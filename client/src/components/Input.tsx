import { styled } from 'styled-components'
import { customColors } from '../assets/colors'
import { SendIcon } from './icons'

const Form = styled.form`
  display: flex;
  border-top: 2px solid #d3d3d3;
`

const TextInput = styled.input`
  border: none;
  border-radius: 0;
  flex: 1;
  font-size: 1.2em;
  padding: 5%;
  background-color: transparent;
  color: white;
  outline: none;

  &::placeholder {
    color: #828282;
  }
`

const SendButton = styled.button`
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: ${customColors.green};
  display: flex;
  align-items: center;
  padding: 0 3%;
  border: none;
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
      />
      <SendButton type="submit" disabled={!message.trim()}>
        <SendIcon />
      </SendButton>
    </Form>
  )
}
