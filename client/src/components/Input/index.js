import React from 'react';
import { Form, TextInput, Button } from './styles'

const Input = ({ setMessage, sendMessage, message }) => (
  <Form>
    <TextInput
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <Button className="sendButton" onClick={e => sendMessage(e)}>Send</Button>
  </Form>
)

export default Input;