import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, CheckCircle2, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useUsersRegistry } from '../../contexts/UsersRegistryContext'
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator'

export const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError } = useAuth()
  const { registerUser } = useUsersRegistry()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      setPasswordsMatch(false)
    } else {
      setPasswordsMatch(true)
    }
    if (!formData.agreeToTerms) errors.terms = 'You must agree to terms'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: '',
        password: formData.password,
      })
      
      // Register user in the users registry for admin dashboard
      registerUser({
        id: `user_${Date.now()}`,
        email: formData.email,
        fullName: formData.fullName,
        phone: '',
        balance: 0, // New users start with 0 balance
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        kycStatus: 'pending',
      })
      
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup failed:', err)
    }
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
            <span className="text-primary-300 text-sm font-medium">Secure Signup</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join 2.5M+ users on Quintin</p>
        </motion.div>

        {/* Signup Form Card */}
        <motion.form
          onSubmit={handleSignup}
          className="card-glass space-y-4"
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

          {/* Full Name */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.fullName}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            <PasswordStrengthIndicator password={formData.password} />
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  formData.confirmPassword && !passwordsMatch
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/20 focus:ring-primary-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div variants={inputVariants} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 mt-0.5"
            />
            <label className="text-sm text-slate-300">
              I agree to Quintin's{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </a>
            </label>
          </motion.div>

          {/* KYC Status */}
          <motion.div
            className="p-3 rounded-lg bg-primary-500/10 border border-primary-400/30 flex items-center gap-2"
            variants={inputVariants}
          >
            <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
            <span className="text-sm text-primary-300">KYC verification pending after signup</span>
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  )
}
