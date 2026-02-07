import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Loader, Smartphone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { OTPVerification } from '../../components/auth/OTPVerification'
import { otpService } from '../../services/otpService'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [loginAttempts, setLoginAttempts] = useState(0)
  
  // OTP verification state
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [processedEmail, setProcessedEmail] = useState('')

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required'
    if (!password) errors.password = 'Password is required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      // Validate credentials and login
      await login(email, password, rememberMe)
      
      // After successful credential validation, require OTP
      setProcessedEmail(email)
      setShowOTPModal(true)
      
    } catch (err) {
      setLoginAttempts((prev) => prev + 1)
      console.error('Login failed:', err)
    }
  }

  const handleOTPVerified = async (success: boolean) => {
    if (!success) {
      setShowOTPModal(false)
      return
    }

    setShowOTPModal(false)
    
    // Clear OTP and navigate to dashboard
    await otpService.clearOTP(processedEmail)
    navigate('/dashboard')
  }

  const handleBiometricLogin = async () => {
    // Simulate biometric login
    alert('Biometric authentication not available in demo.\nFor demo, use:\nEmail: omembeledepaschal@gmail.com\nPassword: test123')
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <OTPVerification
            email={processedEmail}
            onVerified={handleOTPVerified}
            onCancel={() => {
              setShowOTPModal(false)
            }}
            title="Verify Your Login"
            description="Enter the OTP sent to your email to complete login"
          />
        )}
      </AnimatePresence>

      {/* Background Animation */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={inputVariants}>
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/50">
            <span className="text-primary-300 text-sm font-medium">Secure Login</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Access your Quintin account</p>
        </motion.div>

        {/* Login Form Card */}
        <motion.form
          onSubmit={handleLogin}
          className="card-glass space-y-4 mb-6"
          variants={inputVariants}
        >
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

          {/* Security Notification */}
          {loginAttempts > 0 && (
            <motion.div
              className="p-3 rounded-lg bg-orange-500/10 border border-orange-400/30 text-orange-300 text-xs flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Smartphone size={16} />
              New login attempt from your device • February 5, 2026
            </motion.div>
          )}

          {/* Email */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={inputVariants}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link to="/auth/forgot-password" className="text-xs text-primary-400 hover:text-primary-300">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
            )}
          </motion.div>

          {/* Remember Me */}
          <motion.div variants={inputVariants} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
            />
            <label className="text-sm text-slate-300">Keep me signed in for 30 days</label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        {/* Biometric Login */}
        <motion.div
          className="mb-6 space-y-3"
          variants={inputVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-400">Or continue with</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleBiometricLogin}
            className="w-full py-3 rounded-lg border border-white/20 hover:border-primary-500/50 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              👆
            </motion.div>
            Face ID / Fingerprint
          </motion.button>
        </motion.div>

        {/* Signup Link */}
        <motion.p className="text-center text-slate-400 text-sm" variants={inputVariants}>
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign up now
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
