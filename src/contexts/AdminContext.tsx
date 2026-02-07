import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'super_admin' | 'admin' | 'manager'
  permissions: string[]
  createdAt: string
}

interface AdminSession {
  admin: AdminUser
  accessToken: string
  refreshToken: string
  expiresAt: number
}

interface AdminContextType {
  admin: AdminUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_STORAGE_KEY = 'admin_session'

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from storage
  useEffect(() => {
    const storedSession = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (storedSession) {
      try {
        const session: AdminSession = JSON.parse(storedSession)
        if (session.expiresAt > Date.now()) {
          setAdmin(session.admin)
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY)
        }
      } catch (error) {
        console.error('Failed to restore admin session:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      
      // Get users from localStorage (same source as authService)
      const stored = localStorage.getItem('users_registry')
      if (!stored) {
        throw new Error('No users found. System not initialized.')
      }
      
      const users = JSON.parse(stored) as any[]
      const userRecord = users.find((u: any) => u.email.toLowerCase() === normalizedEmail)
      
      if (!userRecord) {
        throw new Error('Invalid admin credentials')
      }
      
      // Check if user is admin
      if (userRecord.email !== 'admin@example.com') {
        throw new Error('Only admin@example.com can access admin panel')
      }
      
      // Check password
      if (userRecord.password !== password.trim()) {
        throw new Error('Invalid admin credentials')
      }

      const accessToken = 'admin_token_' + Date.now()
      const refreshToken = 'admin_refresh_' + Date.now()
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

      const adminUser: AdminUser = {
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        role: 'super_admin',
        permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
        createdAt: userRecord.joinDate || new Date().toISOString(),
      }

      const session: AdminSession = {
        admin: adminUser,
        accessToken,
        refreshToken,
        expiresAt,
      }

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session))
      setAdmin(adminUser)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
