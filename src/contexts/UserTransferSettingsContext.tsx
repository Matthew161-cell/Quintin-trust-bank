import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    localStorage.setItem(USER_TRANSFER_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateUserTransferSettings = (userId: string, newSettings: Partial<UserTransferSettings>) => {
    setSettings((prev) => ({
      ...prev,
      [userId]: {
        userId,
        transfersEnabled: newSettings.transfersEnabled !== undefined ? newSettings.transfersEnabled : (prev[userId]?.transfersEnabled ?? true),
        successRate: newSettings.successRate !== undefined ? newSettings.successRate : (prev[userId]?.successRate ?? 100),
      },
    }))
  }

  const getUserTransferSettings = (userId: string): UserTransferSettings => {
    return (
      settings[userId] || {
        userId,
        transfersEnabled: true,
        successRate: 100,
      }
    )
  }

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
