import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { otpService } from '../../services/otpService'

interface OTPVerificationProps {
  email: string
  onVerified: (success: boolean) => void
  onCancel?: () => void
  title?: string
  description?: string
  skipAutoRequest?: boolean // Skip auto-requesting OTP if parent already requested it
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onCancel,
  title = 'Verify with OTP',
  description = 'Enter the OTP sent to your email',
  skipAutoRequest = false,
}) => {
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const otpRequestedRef = useRef(false)

  // Request OTP - prevent multiple simultaneous requests
  const handleRequestOTP = async () => {
    if (loading) return // Prevent duplicate if already requesting
    
    setLoading(true)
    setError('')
    const result = await otpService.requestOTP(email)
    setLoading(false)

    if (result.success) {
      alert(result.message)
      setRemainingTime(600) // 10 minutes
      setCanResend(false)
    } else {
      setError(result.message)
    }
  }

  useEffect(() => {
    // Skip if parent component already requested it (e.g., TransferPage)
    if (!otpRequestedRef.current && !loading && !skipAutoRequestly once using ref)
    if (!otpRequestedRef.current && !loading) {
      otpRequestedRef.current = true
      handleRequestOTP()
    }
    
    setRemainingTime(600) // Start with 10 minutes
    
    // Timer for remaining time - decrement local counter
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev <= 0 ? 0 : prev - 1
        if (newTime === 0) setCanResend(true)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the OTP code')
      return
    }

    setLoading(true)
    setError('')
    const result = await otpService.verifyOTP(email, otpCode)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setError('')
      setTimeout(() => {
        onVerified(true)
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-300 text-sm">{description}</p>
          <p className="text-slate-400 text-xs mt-2">Email: {email}</p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-8"
          >
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/20 p-4">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-green-500 font-semibold">OTP Verified Successfully!</p>
          </motion.div>
        ) : (
          <>
            {/* OTP Input Fields */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Enter OTP Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                  setOtpCode(value)
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
              <p className="text-xs text-slate-400 mt-2">Enter the 6-digit code sent to your email</p>
            </div>

            {/* Remaining Time */}
            {remainingTime > 0 && (
              <div className="mb-4 text-center">
                <p className="text-sm text-slate-300">
                  OTP expires in:{' '}
                  <span className="font-mono font-bold text-cyan-400">{formatTime(remainingTime)}</span>
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOTP}
                disabled={loading || otpCode.length !== 6 || remainingTime === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>

              {canResend && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestOTP}
                  disabled={loading}
                  className="w-full border border-cyan-500 text-cyan-400 font-semibold py-3 rounded-lg hover:bg-cyan-500/10 transition-all disabled:opacity-50"
                >
                  Resend OTP
                </motion.button>
              )}

              {onCancel && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="w-full border border-white/20 text-slate-300 font-semibold py-3 rounded-lg hover:border-white/40 transition-all"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
