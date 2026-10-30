import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AppShell } from './AppShell'
import { LoadingScreen } from './LoadingScreen'

export function ProtectedLayout() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}
