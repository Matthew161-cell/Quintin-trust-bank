import React, { createContext, useContext, useState, useEffect } from 'react'

export interface RegisteredUser {
  id: string
  email: string
  gmailAddress?: string
  fullName: string
  phone: string
  balance: number
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  password?: string
}

interface UsersRegistryContextType {
  users: RegisteredUser[]
  registerUser: (user: RegisteredUser) => void
  updateUser: (id: string, data: Partial<RegisteredUser>) => void
  getAllUsers: () => RegisteredUser[]
}

const UsersRegistryContext = createContext<UsersRegistryContextType | undefined>(undefined)

export const UsersRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    // Initialize with stored users or default mock users
    const stored = localStorage.getItem('users_registry')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return getDefaultUsers()
      }
    }
    return getDefaultUsers()
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('users_registry', JSON.stringify(users))
  }, [users])

  const registerUser = (user: RegisteredUser) => {
    setUsers((prev) => {
      // Check if user already exists
      const exists = prev.some((u) => u.email === user.email)
      if (exists) return prev
      return [...prev, user]
    })
  }

  const updateUser = (id: string, data: Partial<RegisteredUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    )
  }

  const getAllUsers = () => users

  return (
    <UsersRegistryContext.Provider value={{ users, registerUser, updateUser, getAllUsers }}>
      {children}
    </UsersRegistryContext.Provider>
  )
}

export const useUsersRegistry = () => {
  const context = useContext(UsersRegistryContext)
  if (context === undefined) {
    throw new Error('useUsersRegistry must be used within UsersRegistryProvider')
  }
  return context
}

function getDefaultUsers(): RegisteredUser[] {
  return [
    {
      id: 'admin-001',
      email: 'admin@example.com',
      gmailAddress: 'admin.testing@gmail.com',
      fullName: 'Admin User',
      phone: '+1 (555) 000-0001',
      password: 'admin123',
      balance: 0,
      status: 'active',
      joinDate: '2025-01-01',
      kycStatus: 'verified',
    },
    {
      id: 'cust-001',
      email: 'test@example.com',
      gmailAddress: 'john.demo@gmail.com',
      fullName: 'John Demo',
      phone: '+1 (555) 000-0000',
      password: 'test123',
      balance: 48392.50,
      status: 'active',
      joinDate: '2025-06-15',
      kycStatus: 'verified',
    },
    {
      id: 'cust-002',
      email: 'demo@example.com',
      gmailAddress: 'demo.user@gmail.com',
      fullName: 'Demo User',
      phone: '+1 (555) 111-1111',
      password: 'demo123',
      balance: 22500.00,
      status: 'active',
      joinDate: '2025-07-20',
      kycStatus: 'verified',
    },
    {
      id: 'cust-003',
      email: 'alice@example.com',
      gmailAddress: 'alice.johnson@gmail.com',
      fullName: 'Alice Johnson',
      phone: '+1 (555) 222-2222',
      password: 'alice123',
      balance: 75250.75,
      status: 'active',
      joinDate: '2025-05-10',
      kycStatus: 'verified',
    },
    {
      id: 'cust-004',
      email: 'bob@example.com',
      gmailAddress: 'bob.smith@gmail.com',
      fullName: 'Bob Smith',
      phone: '+1 (555) 333-3333',
      password: 'bob123',
      balance: 15000.00,
      status: 'active',
      joinDate: '2025-08-30',
      kycStatus: 'pending',
    },
    {
      id: 'cust-005',
      email: 'carol@example.com',
      gmailAddress: 'carol.williams@gmail.com',
      fullName: 'Carol Williams',
      phone: '+1 (555) 444-4444',
      password: 'carol123',
      balance: 95600.25,
      status: 'inactive',
      joinDate: '2025-04-05',
      kycStatus: 'verified',
    },
  ] as any
}
