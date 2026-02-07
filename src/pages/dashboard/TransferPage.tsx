import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe, Home, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTransferSettings } from '../../contexts/TransferSettingsContext'
import { useUserTransferSettings } from '../../contexts/UserTransferSettingsContext'
import { Sidebar } from '../../components/dashboard/Sidebar'
import { TopBar } from '../../components/dashboard/TopBar'
import { OTPVerification } from '../../components/auth/OTPVerification'
import { otpService } from '../../services/otpService'

type TransferType = 'local' | 'international'
type TransferStatus = 'idle' | 'processing' | 'success' | 'error'

interface TransferFormData {
  recipientName: string
  recipientEmail?: string
  accountNumber?: string
  iban?: string
  amount: string
  currency: string
  description: string
}

export const TransferPage: React.FC = () => {
  const { user, logout } = useAuth()
  const { settings } = useTransferSettings()
  const { getUserTransferSettings } = useUserTransferSettings()
  const navigate = useNavigate()
  const balance = (user as any)?.balance || 0

  // Get user-specific transfer settings
  const userTransferSettings = getUserTransferSettings(user?.id || '')

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const [transferType, setTransferType] = useState<TransferType>('local')
  const [status, setStatus] = useState<TransferStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [pendingTransfer, setPendingTransfer] = useState<TransferFormData | null>(null)
  const [formData, setFormData] = useState<TransferFormData>({
    recipientName: '',
    recipientEmail: '',
    accountNumber: '',
    iban: '',
    amount: '',
    currency: 'USD',
    description: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateLocalTransfer = (): boolean => {
    if (!formData.recipientName.trim()) {
      setErrorMessage('Recipient name is required')
      return false
    }
    if (!formData.recipientEmail?.trim()) {
      setErrorMessage('Recipient email is required')
      return false
    }
    if (!formData.accountNumber?.trim()) {
      setErrorMessage('Account number is required')
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorMessage('Please enter a valid amount')
      return false
    }
    return true
  }

  const validateInternationalTransfer = (): boolean => {
    if (!formData.recipientName.trim()) {
      setErrorMessage('Recipient name is required')
      return false
    }
    if (!formData.iban?.trim()) {
      setErrorMessage('IBAN is required')
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorMessage('Please enter a valid amount')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Check if transfers are enabled globally
    if (!settings.transfersEnabled) {
      setErrorMessage('Transfers are currently disabled by the administrator')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    // Check if transfers are enabled for this specific user
    if (!userTransferSettings.transfersEnabled) {
      setErrorMessage('Transfers are not allowed for your account. Please contact support.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    // Validate based on transfer type
    const isValid = transferType === 'local' ? validateLocalTransfer() : validateInternationalTransfer()

    if (!isValid) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    // Store pending transfer and show OTP modal
    setPendingTransfer(formData)
    setShowOTPModal(true)

    // Request OTP
    const gmailAddress = (user as any)?.gmailAddress || user?.email
    const result = await otpService.requestOTP(gmailAddress)
    if (!result.success) {
      setErrorMessage(result.message)
      setShowOTPModal(false)
    }
  }

  const handleOTPVerified = async (success: boolean) => {
    if (!success || !pendingTransfer) {
      setShowOTPModal(false)
      setErrorMessage('OTP verification failed')
      return
    }

    setShowOTPModal(false)
    setStatus('processing')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Determine if transfer succeeds based on user's success rate setting
      const successRandom = Math.random() * 100
      const transferSucceeds = successRandom <= userTransferSettings.successRate

      if (!transferSucceeds) {
        throw new Error('Transfer failed. Please try again or contact support.')
      }

      // In a real app, this would call your backend to process the transfer
      const transferRecord = {
        id: `transfer_${Date.now()}`,
        type: transferType,
        from: user?.email,
        to: transferType === 'local' ? pendingTransfer.recipientEmail : pendingTransfer.iban,
        recipientName: pendingTransfer.recipientName,
        amount: parseFloat(pendingTransfer.amount),
        currency: pendingTransfer.currency,
        description: pendingTransfer.description,
        status: 'completed',
        timestamp: new Date().toISOString(),
        fee: transferType === 'international' ? parseFloat(pendingTransfer.amount) * 0.01 : 0, // 1% fee for international
      }

      // Save to transaction history (in a real app, this would be saved to backend)
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      transactions.push(transferRecord)
      localStorage.setItem('transactions', JSON.stringify(transactions))

      // Clear OTP after successful transfer
      const gmailAddress = (user as any)?.gmailAddress || user?.email
      otpService.clearOTP(gmailAddress)

      setStatus('success')
      setTimeout(() => {
        setFormData({
          recipientName: '',
          recipientEmail: '',
          accountNumber: '',
          iban: '',
          amount: '',
          currency: 'USD',
          description: '',
        })
        setStatus('idle')
        setPendingTransfer(null)
      }, 3000)
    } catch (error) {
      setErrorMessage('Transfer failed. Please try again.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <OTPVerification
            email={(user as any)?.gmailAddress || user?.email || ''}
            onVerified={handleOTPVerified}
            onCancel={() => setShowOTPModal(false)}
            title="Verify Transfer"
            description="Enter the OTP sent to your email to confirm this transfer"
          />
        )}
      </AnimatePresence>

      <div className="relative flex h-screen md:pl-64">
        {/* Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Top Bar */}
          <TopBar
            userName={user?.fullName || 'User'}
            userEmail={user?.email || 'user@example.com'}
          />

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto">
            <motion.div
              className="p-4 md:p-8 pb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl font-bold text-white mb-2">Send Money</h1>
                <p className="text-slate-400">Transfer funds locally or internationally</p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Main Form */}
                <motion.div className="lg:col-span-2" variants={itemVariants}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    {/* Transfer Type Selector */}
                    <div className="mb-8">
                      <p className="text-sm font-medium text-slate-300 mb-4">Transfer Type</p>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          onClick={() => setTransferType('local')}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            transferType === 'local'
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Home size={20} />
                          <div className="text-left">
                            <p className="font-semibold">Local Transfer</p>
                            <p className="text-xs opacity-75">Within Quintin Bank</p>
                          </div>
                        </motion.button>

                        <motion.button
                          onClick={() => setTransferType('international')}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            transferType === 'international'
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Globe size={20} />
                          <div className="text-left">
                            <p className="font-semibold">International</p>
                            <p className="text-xs opacity-75">Using IBAN</p>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Recipient Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Name</label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          placeholder="Full name of recipient"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>

                      {/* Local Transfer Fields */}
                      {transferType === 'local' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Email</label>
                            <input
                              type="email"
                              name="recipientEmail"
                              value={formData.recipientEmail}
                              onChange={handleInputChange}
                              placeholder="recipient@example.com"
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleInputChange}
                              placeholder="Enter recipient account number"
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                          </div>
                        </>
                      )}

                      {/* International Transfer Fields */}
                      {transferType === 'international' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">IBAN</label>
                          <input
                            type="text"
                            name="iban"
                            value={formData.iban}
                            onChange={handleInputChange}
                            placeholder="e.g., DE89370400440532013000"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
                          />
                          <p className="text-xs text-slate-400 mt-1">International Bank Account Number</p>
                        </div>
                      )}

                      {/* Amount and Currency */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">$</span>
                            <input
                              type="number"
                              name="amount"
                              value={formData.amount}
                              onChange={handleInputChange}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Add a note for this transfer"
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                        />
                      </div>

                      {/* Error Message */}
                      {errorMessage && status === 'error' && (
                        <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 flex items-gap-3">
                          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                          <p className="text-red-300 text-sm">{errorMessage}</p>
                        </div>
                      )}

                      {/* Success Message */}
                      {status === 'success' && (
                        <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                          <p className="text-green-300 text-sm">Transfer completed successfully!</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={status === 'processing'}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {status === 'processing' ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowRight size={20} />
                            Send {formData.currency || 'USD'}
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div className="lg:col-span-1" variants={itemVariants}>
                  {/* Current Balance */}
                  <motion.div
                    className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-2xl p-6 mb-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm text-slate-300 mb-2">Current Balance</p>
                    <p className="text-3xl font-bold text-white mb-1">
                      ${balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-slate-400">Available for transfer</p>
                  </motion.div>

                  {/* Transfer Info */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold text-white mb-4">Transfer Information</h3>

                    {transferType === 'local' ? (
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-slate-400 mb-1">Processing Time</p>
                          <p className="text-white font-medium">Instant</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1">Transfer Fee</p>
                          <p className="text-white font-medium">Free</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1">Daily Limit</p>
                          <p className="text-white font-medium">$50,000</p>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                          <p className="text-cyan-300 text-xs">💡 Local transfers between Quintin Bank accounts are processed instantly with no fees.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-slate-400 mb-1">Processing Time</p>
                          <p className="text-white font-medium">1-3 Business Days</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1">Transfer Fee</p>
                          <p className="text-white font-medium">1% of amount</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1">Daily Limit</p>
                          <p className="text-white font-medium">$100,000</p>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3 mt-4">
                          <p className="text-orange-300 text-xs">⚠️ International transfers may take 1-3 business days depending on the receiving bank.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
