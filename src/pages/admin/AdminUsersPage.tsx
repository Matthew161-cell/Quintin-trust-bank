import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import { useCustomerData } from '../../contexts/CustomerDataContext'
import { useUsersRegistry } from '../../contexts/UsersRegistryContext'
import { useUserTransferSettings } from '../../contexts/UserTransferSettingsContext'
import { Edit2, Trash2, X, Save, ArrowLeft, Eye, EyeOff, ToggleRight, ToggleLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import { syncService } from '../../services/syncService'

interface Customer {
  id: string
  email: string
  fullName: string
  balance: number
  accountType: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  password?: string
}

interface EditModalState {
  isOpen: boolean
  customer: Customer | null
  newFullName: string
  newBalance: string
  newEmail: string
  newPassword: string
}

export const AdminUsersPage: React.FC = () => {
  const { logout } = useAdmin()
  const { updateCustomer } = useCustomerData()
  const { getAllUsers, updateUser, registerUser } = useUsersRegistry()
  const { getUserTransferSettings, updateUserTransferSettings } = useUserTransferSettings()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])

  // Load users from registry on mount - always get fresh from localStorage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Fetch from backend first (cross-device sync)
        const backendUsers = await syncService.fetchUsers()

        if (backendUsers && backendUsers.length > 0) {
          // Use backend users as source of truth
          setCustomers(backendUsers)
          // Update localStorage with backend data
          localStorage.setItem('users_registry', JSON.stringify(backendUsers))
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem('users_registry')
          if (stored) {
            try {
              setCustomers(JSON.parse(stored))
            } catch {
              const registeredUsers = getAllUsers()
              setCustomers(registeredUsers as any)
            }
          } else {
            const registeredUsers = getAllUsers()
            setCustomers(registeredUsers as any)
          }
        }
      } catch (error) {
        console.error('Error loading users:', error)
        // Fallback to localStorage
        const stored = localStorage.getItem('users_registry')
        if (stored) {
          try {
            setCustomers(JSON.parse(stored))
          } catch {
            const registeredUsers = getAllUsers()
            setCustomers(registeredUsers as any)
          }
        }
      }
    }

    loadUsers()
  }, [])

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    customer: null,
    newFullName: '',
    newBalance: '',
    newEmail: '',
    newPassword: '',
  })

  const [transferSettings, setTransferSettings] = useState({
    transfersEnabled: true,
    successRate: 100,
  })

  const [addUserModal, setAddUserModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    balance: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleEditClick = (customer: Customer) => {
    const userTransferSettings = getUserTransferSettings(customer.id)
    setTransferSettings({
      transfersEnabled: userTransferSettings.transfersEnabled,
      successRate: userTransferSettings.successRate,
    })
    setEditModal({
      isOpen: true,
      customer,
      newFullName: customer.fullName,
      newBalance: customer.balance.toString(),
      newEmail: customer.email,
      newPassword: '',
    })
  }

  const handleSaveBalance = async () => {
    if (editModal.customer && editModal.newBalance) {
      const newAmount = parseFloat(editModal.newBalance)
      
      // Update in local state
      const updatedCustomers = customers.map((c) =>
        c.id === editModal.customer!.id 
          ? { 
              ...c, 
              fullName: editModal.newFullName || c.fullName,
              balance: newAmount,
              email: editModal.newEmail || c.email,
              password: editModal.newPassword ? editModal.newPassword : c.password,
            } 
          : c
      )
      setCustomers(updatedCustomers)
      
      // Manually update localStorage to ensure persistence
      const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
      const updatedUsers = allUsers.map((u: any) =>
        u.id === editModal.customer!.id
          ? {
              ...u,
              fullName: editModal.newFullName || u.fullName,
              balance: newAmount,
              email: editModal.newEmail || u.email,
              password: editModal.newPassword ? editModal.newPassword : u.password,
            }
          : u
      )
      localStorage.setItem('users_registry', JSON.stringify(updatedUsers))
      
      // Update in UsersRegistry
      updateUser(editModal.customer.id, {
        fullName: editModal.newFullName || editModal.customer.fullName,
        balance: newAmount,
        email: editModal.newEmail || editModal.customer.email,
        password: editModal.newPassword ? editModal.newPassword : editModal.customer.password,
      })
      
      // Update in shared CustomerDataContext for persistence
      updateCustomer(editModal.customer.id, {
        id: editModal.customer.id,
        email: editModal.newEmail || editModal.customer.email,
        fullName: editModal.newFullName || editModal.customer.fullName,
        balance: newAmount,
        password: editModal.newPassword ? editModal.newPassword : editModal.customer.password,
      })

      // Update email in auth service if email was changed (clear old OTP record)
      if (editModal.newEmail && editModal.newEmail !== editModal.customer.email) {
        try {
          await authService.updateUserEmail(editModal.customer.email, editModal.newEmail)
        } catch (error) {
          console.error('Error updating email:', error)
        }
      }

      // Update password in auth service if a new password was provided
      if (editModal.newPassword && editModal.newPassword.trim()) {
        try {
          authService.updateUserPassword(
            editModal.newEmail || editModal.customer.email,
            editModal.newPassword
          )
        } catch (error) {
          console.error('Error updating password:', error)
        }
      }
      // Update transfer settings for this user
      updateUserTransferSettings(editModal.customer.id, {
        transfersEnabled: transferSettings.transfersEnabled,
        successRate: transferSettings.successRate,
      })

      // Sync updated users list to backend for cross-device access
      syncService.saveUsers(updatedUsers).catch((error) => console.error('Failed to sync users after update:', error))
      
      setEditModal({ isOpen: false, customer: null, newFullName: '', newBalance: '', newEmail: '', newPassword: '' })
    }
  }

  const handleDeleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter((c) => c.id !== id)
    setCustomers(updatedCustomers)
    
    // Also remove from UsersRegistry to persist deletion
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    const updatedUsers = allUsers.filter((u: any) => u.id !== id)
    localStorage.setItem('users_registry', JSON.stringify(updatedUsers))

    // Sync deleted users list to backend for cross-device access
    syncService.saveUsers(updatedUsers).catch((error) => console.error('Failed to sync users after delete:', error))
  }

  const handleAddUser = () => {
    if (!newUserForm.fullName || !newUserForm.email || !newUserForm.password) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Register user credentials in auth service
      authService.registerUserCredentials(
        newUserForm.email,
        newUserForm.password,
        newUserForm.fullName,
        newUserForm.phone
      )

      const newUser: Customer = {
        id: `user_${Date.now()}`,
        email: newUserForm.email,
        fullName: newUserForm.fullName,
        balance: parseFloat(newUserForm.balance) || 0,
        accountType: 'Standard',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        password: newUserForm.password,
      }

      // Add to local state
      const updatedCustomers = [...customers, newUser]
      setCustomers(updatedCustomers)

      // Register in UsersRegistry
      registerUser({
        ...newUser,
        phone: newUserForm.phone,
        kycStatus: 'pending',
      } as any)

      // Save initial balance to CustomerDataContext so it appears on user's dashboard
      if (newUserForm.balance && parseFloat(newUserForm.balance) > 0) {
        updateCustomer(newUser.id, {
          id: newUser.id,
          email: newUserForm.email,
          fullName: newUserForm.fullName,
          balance: parseFloat(newUserForm.balance),
        })
      }

      // Sync updated users list to backend for cross-device access
      syncService.saveUsers(updatedCustomers).catch((error) => console.error('Failed to sync users:', error))

      // Show success and reset form
      alert(`User ${newUserForm.fullName} created successfully! They can now login with ${newUserForm.email}`)
      setNewUserForm({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        balance: '',
      })
      setAddUserModal(false)
    } catch (error) {
      alert(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'inactive':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
      case 'suspended':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowLeft size={24} className="text-white" />
            </motion.button>
            <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          </div>
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Logout
          </motion.button>
        </div>

        {/* Add User Button */}
        <div className="mb-6">
          <motion.button
            onClick={() => setAddUserModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-white font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add New User
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-white">{customers.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Total Funds Managed</p>
            <p className="text-3xl font-bold text-white">
              ${customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Active Accounts</p>
            <p className="text-3xl font-bold text-white">
              {customers.filter((c) => c.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Customers Table */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Account Balance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Account Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {customers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    className="hover:bg-white/5 transition-colors"
                    variants={itemVariants}
                  >
                    <td className="px-6 py-4 text-white font-medium">{customer.fullName}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{customer.email}</td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ${customer.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{customer.accountType}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          customer.status
                        )}`}
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{customer.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleEditClick(customer)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && editModal.customer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Customer</h2>
              <motion.button
                onClick={() => setEditModal({ isOpen: false, customer: null, newFullName: '', newBalance: '', newEmail: '', newPassword: '' })}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <X size={24} className="text-white" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={editModal.newFullName}
                  onChange={(e) =>
                    setEditModal({ ...editModal, newFullName: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editModal.newEmail}
                  onChange={(e) =>
                    setEditModal({ ...editModal, newEmail: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={showCurrentPassword ? (editModal.customer?.password || '') : '••••••••••'}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-slate-300 text-sm focus:outline-none cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={editModal.newPassword}
                    onChange={(e) =>
                      setEditModal({ ...editModal, newPassword: e.target.value })
                    }
                    placeholder="Leave blank to keep current"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Account Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input
                    type="number"
                    value={editModal.newBalance}
                    onChange={(e) =>
                      setEditModal({ ...editModal, newBalance: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
                <p className="text-slate-400 text-sm mb-1">Current Balance</p>
                <p className="text-white font-semibold">
                  ${editModal.customer.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Transfer Settings Section */}
              <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-cyan-300">Transfer Settings</h3>
                
                {/* Enable/Disable Transfers */}
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 text-sm font-medium">
                    Allow Transfers
                  </label>
                  <motion.button
                    onClick={() =>
                      setTransferSettings({
                        ...transferSettings,
                        transfersEnabled: !transferSettings.transfersEnabled,
                      })
                    }
                    className={`p-2 rounded-lg transition-all ${
                      transferSettings.transfersEnabled
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {transferSettings.transfersEnabled ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </motion.button>
                </div>

                {/* Success Rate */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Transfer Success Rate: {transferSettings.successRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={transferSettings.successRate}
                    onChange={(e) =>
                      setTransferSettings({
                        ...transferSettings,
                        successRate: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <motion.button
                      onClick={() =>
                        setTransferSettings({ ...transferSettings, successRate: 0 })
                      }
                      className="bg-red-500/20 text-red-300 py-1 rounded text-xs hover:bg-red-500/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      All Fail
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        setTransferSettings({ ...transferSettings, successRate: 50 })
                      }
                      className="bg-yellow-500/20 text-yellow-300 py-1 rounded text-xs hover:bg-yellow-500/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      50/50
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        setTransferSettings({ ...transferSettings, successRate: 100 })
                      }
                      className="bg-green-500/20 text-green-300 py-1 rounded text-xs hover:bg-green-500/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      All Pass
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={() => setEditModal({ isOpen: false, customer: null, newFullName: '', newBalance: '', newEmail: '', newPassword: '' })}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveBalance}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {addUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New User</h2>
              <motion.button
                onClick={() => setAddUserModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <X size={20} className="text-white" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newUserForm.fullName}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, fullName: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Set user password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, password: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Initial Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newUserForm.balance}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, balance: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-300 text-sm">
                  <span className="font-semibold">Note:</span> User will be able to login with the provided email and password.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={() => setAddUserModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create User
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

