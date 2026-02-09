import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { syncService } from '../services/syncService'

export interface UserTransferSettings {
  userId: string
  transfersEnabled: boolean
  successRate: number // 0-100, percentage of successful transfers
}

interface UserTransferSettingsContextType {
  settings: Record<string, UserTransferSettings>
  updateUserTransferSettings: (userId: string, settings: Partial<UserTransferSettings>) => void
  getUserTransferSettings: (userId: string) => UserTransferSettings
}

const USER_TRANSFER_SETTINGS_KEY = 'user_transfer_settings'

const UserTransferSettingsContext = createContext<UserTransferSettingsContextType | undefined>(undefined)

export const UserTransferSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, UserTransferSettings>>(() => {
    const stored = localStorage.getItem(USER_TRANSFER_SETTINGS_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return {}
      }
    }
    return {}
  })

  // Sync from backend on mount
  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const backendSettings = await syncService.fetchAllUserTransferSettings()
        if (backendSettings && Object.keys(backendSettings).length > 0) {
          setSettings((prev) => {
            const merged = { ...prev, ...backendSettings }
            localStorage.setItem(USER_TRANSFER_SETTINGS_KEY, JSON.stringify(merged))
            return merged
          })
          console.log('✅ User transfer settings synced from backend')
        }
      } catch (error) {
        console.warn('⚠️ Failed to sync user transfer settings from backend:', error)
      }
    }

    syncFromBackend()

    // Poll for updates every 10 seconds
    const interval = setInterval(syncFromBackend, 10000)
    return () => clearInterval(interval)
  }, [])

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(USER_TRANSFER_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateUserTransferSettings = useCallback((userId: string, newSettings: Partial<UserTransferSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [userId]: {
          userId,
          transfersEnabled: newSettings.transfersEnabled !== undefined ? newSettings.transfersEnabled : (prev[userId]?.transfersEnabled ?? true),
          successRate: newSettings.successRate !== undefined ? newSettings.successRate : (prev[userId]?.successRate ?? 100),
        },
      }
      // Sync to backend
      syncService.saveUserTransferSettings(userId, {
        transfersEnabled: updated[userId].transfersEnabled,
        successRate: updated[userId].successRate,
      }).catch((error) => console.error('Failed to sync user transfer settings to backend:', error))
      return updated
    })
  }, [])

  const getUserTransferSettings = useCallback((userId: string): UserTransferSettings => {
    return (
      settings[userId] || {
        userId,
        transfersEnabled: true,
        successRate: 100,
      }
    )
  }, [settings])

  return (
    <UserTransferSettingsContext.Provider value={{ settings, updateUserTransferSettings, getUserTransferSettings }}>
      {children}
    </UserTransferSettingsContext.Provider>
  )
}

export const useUserTransferSettings = () => {
  const context = useContext(UserTransferSettingsContext)
  if (context === undefined) {
    throw new Error('useUserTransferSettings must be used within UserTransferSettingsProvider')
  }
  return context
}
