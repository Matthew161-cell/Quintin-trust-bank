import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Check if user is authenticated AND is an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
