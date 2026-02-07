import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle2, Loader, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmail, isLoading, error, clearError } = useAuth()

  const email = (location.state as { email?: string })?.email || ''
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [showResendButton, setShowResendButton] = useState(false)

  React.useEffect(() => {
    if (timeLeft <= 0) {
      setShowResendButton(true)
      return
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-submit when all digits entered
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus()
    } else if (newCode.every((c) => c)) {
      handleVerify(newCode)
    }
  }

  const handleVerify = async (codeArray?: string[]) => {
    clearError()
    const fullCode = (codeArray || code).join('')
    if (fullCode.length !== 6) return

    try {
      await verifyEmail(email, fullCode)
      // Auto-redirect after verification
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Verification failed:', err)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-block mb-4 w-16 h-16 rounded-full bg-primary-500/20 border border-primary-400/50 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mail size={32} className="text-primary-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Verify Email</h1>
          <p className="text-slate-400">We sent a verification code to {email}</p>
        </motion.div>

        {/* Verification Form Card */}
        <motion.div className="card-glass space-y-6" variants={itemVariants}>
          {/* Error Message */}
          {error && (
            <motion.div
              className="p-4 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Code Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Enter Verification Code</label>
            <div className="flex gap-2 justify-between">
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileFocus={{ scale: 1.1 }}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <motion.div
            className={`text-center text-sm ${timeLeft <= 30 ? 'text-orange-400' : 'text-slate-400'}`}
            animate={{ scale: timeLeft <= 30 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {showResendButton ? (
              <button
                onClick={() => {
                  setTimeLeft(300)
                  setShowResendButton(false)
                  setCode(['', '', '', '', '', ''])
                }}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Resend Code
              </button>
            ) : (
              <>Code expires in {formatTime(timeLeft)}</>
            )}
          </motion.div>

          {/* Verify Button */}
          <motion.button
            type="button"
            onClick={() => handleVerify()}
            disabled={isLoading || code.some((c) => !c)}
            className="w-full btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Verify Email
              </>
            )}
          </motion.button>

          {/* Help Text */}
          <p className="text-center text-slate-400 text-xs">
            Didn't receive the code?{' '}
            <button className="text-primary-400 hover:text-primary-300">Contact support</button>
          </p>
        </motion.div>

        {/* Security Info */}
        <motion.div
          className="mt-6 p-4 rounded-lg bg-primary-500/10 border border-primary-400/30 flex items-start gap-3"
          variants={itemVariants}
        >
          <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-primary-300 font-medium mb-1">Account Protected</p>
            <p className="text-xs text-primary-200">
              Your account is secured with industry-standard encryption and verification.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
