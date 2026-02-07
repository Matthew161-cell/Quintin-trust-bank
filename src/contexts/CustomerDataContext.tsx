import React, { createContext, useContext, useState, useEffect } from 'react'

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
}

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined)

export const CustomerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Persist to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('customer_data_store', JSON.stringify(customers))
  }, [customers])

  const updateCustomer = (id: string, data: Partial<CustomerData>) => {
    setCustomers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...data,
      },
    }))
  }

  const getCustomer = (email: string) => {
    // Search by email in the customers store
    return Object.values(customers).find((c) => c.email === email)
  }

  return (
    <CustomerDataContext.Provider value={{ customers, updateCustomer, getCustomer }}>
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
