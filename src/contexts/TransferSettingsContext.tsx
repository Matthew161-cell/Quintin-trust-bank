import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { syncService } from '../services/syncService'

export interface TransferSettings {
  transfersEnabled: boolean
  successRate: number // 0-100, percentage of successful transfers
  dailyLimit: number
}

interface TransferSettingsContextType {
  settings: TransferSettings
  updateSettings: (settings: Partial<TransferSettings>) => void
  resetSettings: () => void
  isSyncing: boolean
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
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync from backend on mount
  useEffect(() => {
    const syncFromBackend = async () => {
      setIsSyncing(true)
      try {
        const backendSettings = await syncService.fetchTransferSettings()
        if (backendSettings) {
          const merged: TransferSettings = {
            transfersEnabled: backendSettings.transfersEnabled ?? DEFAULT_SETTINGS.transfersEnabled,
            successRate: backendSettings.successRate ?? DEFAULT_SETTINGS.successRate,
            dailyLimit: backendSettings.dailyLimit ?? DEFAULT_SETTINGS.dailyLimit,
          }
          setSettings(merged)
          localStorage.setItem(TRANSFER_SETTINGS_KEY, JSON.stringify(merged))
          console.log('✅ Transfer settings synced from backend')
        }
      } catch (error) {
        console.warn('⚠️ Failed to sync transfer settings from backend:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    syncFromBackend()

    // Poll for updates every 10 seconds
    const interval = setInterval(syncFromBackend, 10000)
    return () => clearInterval(interval)
  }, [])

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(TRANSFER_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = useCallback((newSettings: Partial<TransferSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
      }
      // Sync to backend
      syncService.saveTransferSettings(updated).catch((error) =>
        console.error('Failed to sync transfer settings to backend:', error)
      )
      return updated
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    // Sync reset to backend
    syncService.saveTransferSettings(DEFAULT_SETTINGS).catch((error) =>
      console.error('Failed to sync transfer settings reset to backend:', error)
    )
  }, [])

  return (
    <TransferSettingsContext.Provider value={{ settings, updateSettings, resetSettings, isSyncing }}>
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
