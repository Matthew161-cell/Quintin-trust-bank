import React, { createContext, useContext, useState, useEffect } from 'react'

export interface TransferSettings {
  transfersEnabled: boolean
  successRate: number // 0-100, percentage of successful transfers
  dailyLimit: number
}

interface TransferSettingsContextType {
  settings: TransferSettings
  updateSettings: (settings: Partial<TransferSettings>) => void
  resetSettings: () => void
}

const TRANSFER_SETTINGS_KEY = 'transfer_settings'

const DEFAULT_SETTINGS: TransferSettings = {
  transfersEnabled: true,
  successRate: 100,
  dailyLimit: 100000,
}

const TransferSettingsContext = createContext<TransferSettingsContextType | undefined>(undefined)

export const TransferSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TransferSettings>(() => {
    const stored = localStorage.getItem(TRANSFER_SETTINGS_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_SETTINGS
      }
    }
    return DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem(TRANSFER_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<TransferSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <TransferSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </TransferSettingsContext.Provider>
  )
}

export const useTransferSettings = () => {
  const context = useContext(TransferSettingsContext)
  if (context === undefined) {
    throw new Error('useTransferSettings must be used within TransferSettingsProvider')
  }
  return context
}
