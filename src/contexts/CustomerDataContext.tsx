import React, { createContext, useContext, useState, useEffect } from 'react'
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

  // Sync customer data from backend when user logs in
  useEffect(() => {
    if (user?.email) {
      const syncFromBackend = async () => {
        setIsSyncing(true)
        try {
          // Fetch customer data from backend
          const backendData = await syncService.fetchCustomerData(user.email)
          
          if (backendData) {
            // Update local customer with backend data
            setCustomers((prev) => ({
              ...prev,
              [backendData.email]: {
                id: user.id,
                email: user.email,
                fullName: backendData.fullName || user.fullName,
                balance: backendData.balance || 0,
              },
            }))
            console.log('✅ Synced customer data from backend')
          }
        } catch (error) {
          console.error('Failed to sync from backend:', error)
        } finally {
          setIsSyncing(false)
        }
      }

      syncFromBackend()
    }
  }, [user?.email, user?.id, user?.fullName])

  // Persist to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('customer_data_store', JSON.stringify(customers))
  }, [customers])

  const updateCustomer = (id: string, data: Partial<CustomerData>) => {
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
      }
      
      return updated
    })
  }

  const getCustomer = (email: string) => {
    // Search by email in the customers store
    return Object.values(customers).find((c) => c.email === email)
  }

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
