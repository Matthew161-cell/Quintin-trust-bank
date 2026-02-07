import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '../services/authService'

interface User {
  id: string
  email: string
  fullName: string
  phone: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  kycStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
  role?: 'admin' | 'user'
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  accessToken: string | null
  signup: (data: {
    fullName: string
    email: string
    phone: string
    password: string
  }) => Promise<void>
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
  verifyEmail: (email: string, code: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>
  setup2FA: () => Promise<{ secret: string; qrCode: string }>
  verify2FA: (code: string) => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load session on mount
  useEffect(() => {
    // Initialize default users in localStorage
    authService.initializeUsers()
    
    const session = authService.getCurrentSession()
    if (session && !authService.isTokenExpired(session.expiresAt)) {
      setUser(session.user)
      setAccessToken(session.accessToken)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const signup = useCallback(
    async (data: {
      fullName: string
      email: string
      phone: string
      password: string
    }) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await authService.signup(data)
        setUser(result.user)
        // Auto-verify for demo
        setTimeout(() => {
          setUser((prev) => (prev ? { ...prev, emailVerified: true } : null))
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const login = useCallback(
    async (email: string, password: string, rememberMe?: boolean) => {
      setIsLoading(true)
      setError(null)
      try {
        const session = await authService.login({
          email,
          password,
          rememberMe,
        })
        setUser(session.user)
        setAccessToken(session.accessToken)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setAccessToken(null)
    setError(null)
  }, [])

  const verifyEmail = useCallback(async (email: string, code: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await authService.verifyEmail(email, code)
      setUser(updatedUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.requestPasswordReset(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset request failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await authService.resetPassword(email, code, newPassword)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password reset failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const setup2FA = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.setup2FA(user?.id || '')
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : '2FA setup failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const verify2FA = useCallback(
    async (code: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const verified = await authService.verify2FA(user?.id || '', code)
        if (verified && user) {
          setUser({ ...user, twoFactorEnabled: true })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '2FA verification failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    accessToken,
    signup,
    login,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    setup2FA,
    verify2FA,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
