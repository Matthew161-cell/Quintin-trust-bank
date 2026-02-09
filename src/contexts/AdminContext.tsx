import React, { createContext, useContext, useState, useEffect } from 'react'
import { syncService } from '../services/syncService'

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

  // Initialize from storage and sync from backend
  useEffect(() => {
    const initializeAdmin = async () => {
      const storedSession = localStorage.getItem(ADMIN_STORAGE_KEY)
      if (storedSession) {
        try {
          const session: AdminSession = JSON.parse(storedSession)
          if (session.expiresAt > Date.now()) {
            // Fetch latest admin data from backend for cross-device sync
            const backendAdminData = await syncService.fetchAdminData(session.admin.email)
            
            if (backendAdminData) {
              // Merge backend data with local session
              const syncedAdmin: AdminUser = {
                ...session.admin,
                role: (backendAdminData.role as 'super_admin' | 'admin' | 'manager') || session.admin.role,
                permissions: backendAdminData.permissions || session.admin.permissions,
                fullName: backendAdminData.fullName || session.admin.fullName,
                email: session.admin.email, // Keep original email
              }
              setAdmin(syncedAdmin)
              
              // Update stored session with synced data
              const updatedSession: AdminSession = {
                ...session,
                admin: syncedAdmin,
              }
              localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedSession))
              console.log('✅ Admin data synced from backend on startup')
            } else {
              setAdmin(session.admin)
            }
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY)
          }
        } catch (error) {
          console.error('Failed to restore admin session:', error)
        }
      }
      setLoading(false)
    }

    initializeAdmin()
  }, [])

  // Sync admin data to backend whenever admin changes
  useEffect(() => {
    if (admin && admin.email) {
      syncService.saveAdminData(admin.email, {
        role: admin.role,
        permissions: admin.permissions,
        fullName: admin.fullName,
        email: admin.email,
      }).catch((error) => console.error('Sync error:', error))
    }
  }, [admin])

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
      
      // Check if user is admin - support multiple admin emails
      const adminEmails = ['admin@example.com', 'omembeledepaschal@gmail.com', 'quintin64312@gmail.com']
      const isAdmin = adminEmails.includes(userRecord.email.toLowerCase())
      if (!isAdmin) {
        throw new Error('Only authorized admins can access admin panel')
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

      // Sync admin data to backend for cross-device access
      await syncService.saveAdminData(adminUser.email, {
        role: adminUser.role,
        permissions: adminUser.permissions,
        fullName: adminUser.fullName,
        email: adminUser.email,
      })

      console.log('✅ Admin logged in and synced across devices')
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
