import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { syncService } from '../services/syncService'

export interface CustomerData {
  id: string
  email: string
  fullName: string
  password?: string
  balance: number
}

interface CustomerDataContextType {
  customers: Record<string, CustomerData>
  updateCustomer: (id: string, data: Partial<CustomerData>) => void
  getCustomer: (email: string) => CustomerData | undefined
  isSyncing: boolean
}

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined)

export const CustomerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Record<string, CustomerData>>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem('customer_data_store')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return {}
      }
    }
    return {}
  })
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync customer data from backend when user logs in and periodically
  useEffect(() => {
    if (!user?.email) return

    const syncFromBackend = async () => {
      setIsSyncing(true)
      try {
        // Fetch customer data from backend
        const backendData = await syncService.fetchCustomerData(user.email)
        
        if (backendData) {
          // Update local customer with backend data
          setCustomers((prev) => {
            const updated = {
              ...prev,
              [user.email]: {
                id: user.id,
                email: user.email,
                fullName: backendData.fullName || user.fullName,
                balance: backendData.balance !== undefined ? backendData.balance : (prev[user.email]?.balance || 0),
              },
            }
            localStorage.setItem('customer_data_store', JSON.stringify(updated))
            return updated
          })
          console.log('✅ Synced customer data from backend')
        } else {
          // If no backend data exists, check the users registry for balance
          // and push local data to backend
          const localCustomer = Object.values(customers).find((c) => c.email === user.email)
          if (localCustomer) {
            syncService.saveCustomerData(user.email, {
              balance: localCustomer.balance,
              fullName: localCustomer.fullName,
              email: user.email,
            }).catch(() => {})
          } else {
            // Check users_registry for initial balance
            try {
              const usersRegistry = JSON.parse(localStorage.getItem('users_registry') || '[]')
              const userRecord = usersRegistry.find((u: any) => u.email?.toLowerCase() === user.email.toLowerCase())
              if (userRecord && userRecord.balance > 0) {
                setCustomers((prev) => {
                  const updated = {
                    ...prev,
                    [user.email]: {
                      id: user.id,
                      email: user.email,
                      fullName: userRecord.fullName || user.fullName,
                      balance: userRecord.balance,
                    },
                  }
                  localStorage.setItem('customer_data_store', JSON.stringify(updated))
                  return updated
                })
                // Push to backend
                syncService.saveCustomerData(user.email, {
                  balance: userRecord.balance,
                  fullName: userRecord.fullName || user.fullName,
                  email: user.email,
                }).catch(() => {})
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      } catch (error) {
        console.error('Failed to sync from backend:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    syncFromBackend()

    // Poll every 10 seconds for balance updates from admin or other devices
    const interval = setInterval(syncFromBackend, 10000)
    return () => clearInterval(interval)
  }, [user?.email, user?.id, user?.fullName])

  // Persist to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('customer_data_store', JSON.stringify(customers))
  }, [customers])

  const updateCustomer = useCallback((id: string, data: Partial<CustomerData>) => {
    setCustomers((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          ...data,
        },
      }
      
      // Sync to backend if user is logged in
      const customer = updated[id]
      if (customer?.email) {
        syncService.saveCustomerData(customer.email, {
          balance: customer.balance,
          fullName: customer.fullName,
          email: customer.email,
        }).catch((error) => console.error('Sync error:', error))

        // Also sync balance specifically
        if (data.balance !== undefined) {
          syncService.updateBalance(customer.email, data.balance).catch((error) =>
            console.error('Balance sync error:', error)
          )
        }

        // Also update users_registry so admin dashboard reflects the same balance
        try {
          const usersRegistry = JSON.parse(localStorage.getItem('users_registry') || '[]')
          const updatedRegistry = usersRegistry.map((u: any) =>
            u.email?.toLowerCase() === customer.email.toLowerCase()
              ? { ...u, balance: customer.balance, fullName: customer.fullName }
              : u
          )
          localStorage.setItem('users_registry', JSON.stringify(updatedRegistry))
          syncService.saveUsers(updatedRegistry).catch(() => {})
        } catch {
          // Ignore parse errors
        }
      }
      
      return updated
    })
  }, [])

  const getCustomer = useCallback((email: string) => {
    // Search by email in the customers store
    return Object.values(customers).find((c) => c.email === email)
  }, [customers])

  return (
    <CustomerDataContext.Provider value={{ customers, updateCustomer, getCustomer, isSyncing }}>
      {children}
    </CustomerDataContext.Provider>
  )
}

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext)
  if (context === undefined) {
    throw new Error('useCustomerData must be used within CustomerDataProvider')
  }
  return context
}
