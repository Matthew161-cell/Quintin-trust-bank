// Data Sync Service - Handles cross-device data synchronization
// Syncs transactions, customer data, and balance across all devices via backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface SyncTransaction {
  id: string
  type: 'local' | 'international'
  from: string
  to: string
  recipientName: string
  amount: number
  currency: string
  description: string
  status: string
  timestamp: string
  fee?: number
  country?: string
  bankAddress?: string
}

interface SyncCustomerData {
  balance: number
  fullName: string
  email: string
  phone?: string
  [key: string]: any
}

interface SyncAdminData {
  role: string
  permissions: string[]
  fullName: string
  email: string
  settings?: Record<string, any>
  [key: string]: any
}

export const syncService = {
  /**
   * Save a transaction to the backend
   */
  async saveTransaction(email: string, transaction: SyncTransaction): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          transaction,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save transaction: ${response.statusText}`)
      }

      console.log('✅ Transaction synced to backend')
    } catch (error) {
      console.warn('⚠️ Failed to sync transaction to backend:', error)
      // Don't throw - allow offline operation
    }
  },

  /**
   * Fetch all transactions for a user from the backend
   */
  async fetchTransactions(email: string): Promise<SyncTransaction[]> {
    try {
      const response = await fetch(
        `${API_URL}/api/sync/transactions/${encodeURIComponent(email.toLowerCase().trim())}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Transactions fetched from backend:', data.transactions?.length || 0)
      return data.transactions || []
    } catch (error) {
      console.warn('⚠️ Failed to fetch transactions from backend:', error)
      return []
    }
  },

  /**
   * Save customer data to the backend
   */
  async saveCustomerData(email: string, data: Partial<SyncCustomerData>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          data,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save customer data: ${response.statusText}`)
      }

      console.log('✅ Customer data synced to backend')
    } catch (error) {
      console.warn('⚠️ Failed to sync customer data to backend:', error)
      // Don't throw - allow offline operation
    }
  },

  /**
   * Fetch customer data from the backend
   */
  async fetchCustomerData(email: string): Promise<SyncCustomerData | null> {
    try {
      const response = await fetch(
        `${API_URL}/api/sync/customer/${encodeURIComponent(email.toLowerCase().trim())}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch customer data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Customer data fetched from backend')
      return data.data || null
    } catch (error) {
      console.warn('⚠️ Failed to fetch customer data from backend:', error)
      return null
    }
  },

  /**
   * Update balance on the backend
   */
  async updateBalance(email: string, balance: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          balance,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update balance: ${response.statusText}`)
      }

      console.log('✅ Balance synced to backend')
    } catch (error) {
      console.warn('⚠️ Failed to sync balance to backend:', error)
      // Don't throw - allow offline operation
    }
  },

  /**
   * Save admin data to the backend
   */
  async saveAdminData(email: string, data: Partial<SyncAdminData>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          data,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save admin data: ${response.statusText}`)
      }

      console.log('✅ Admin data synced to backend')
    } catch (error) {
      console.warn('⚠️ Failed to sync admin data to backend:', error)
      // Don't throw - allow offline operation
    }
  },

  /**
   * Fetch admin data from the backend
   */
  async fetchAdminData(email: string): Promise<SyncAdminData | null> {
    try {
      const response = await fetch(
        `${API_URL}/api/sync/admin/${encodeURIComponent(email.toLowerCase().trim())}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch admin data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Admin data fetched from backend')
      return data.data || null
    } catch (error) {
      console.warn('⚠️ Failed to fetch admin data from backend:', error)
      return null
    }
  },

  /**
   * Save admin settings/preferences to the backend
   */
  async saveAdminSettings(email: string, settings: Record<string, any>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/admin-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save admin settings: ${response.statusText}`)
      }

      console.log('✅ Admin settings synced to backend')
    } catch (error) {
      console.warn('⚠️ Failed to sync admin settings to backend:', error)
      // Don't throw - allow offline operation
    }
  },

  /**
   * Fetch all users from backend
   */
  async fetchUsers(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/sync/users`)

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Users fetched from backend:', data.users?.length || 0)
      return data.users || []
    } catch (error) {
      console.warn('⚠️ Failed to fetch users from backend:', error)
      return []
    }
  },

  /**
   * Save users registry to backend
   */
  async saveUsers(users: any[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/sync/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save users: ${response.statusText}`)
      }

      console.log('✅ Users registry synced to backend:', users.length)
    } catch (error) {
      console.warn('⚠️ Failed to sync users to backend:', error)
      // Don't throw - allow offline operation
    }
  },
}
