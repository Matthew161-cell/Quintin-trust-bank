import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredEmailVerification?: boolean
  required2FA?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredEmailVerification = true,
  required2FA = false,
}) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredEmailVerification && !user?.emailVerified) {
    return <Navigate to="/auth/verify-email" replace />
  }

  if (required2FA && !user?.twoFactorEnabled) {
    return <Navigate to="/auth/setup-2fa" replace />
  }

  return <>{children}</>
}
