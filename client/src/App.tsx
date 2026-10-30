import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './auth/AuthContext'
import ChatPage from './components/ChatPage'
import { ProtectedLayout } from './components/layout/ProtectedLayout'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './theme'
import Chat from './pages/Chat'
import Feed from './pages/Feed'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Login'
import Profile from './pages/Profile'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={<Chat />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
