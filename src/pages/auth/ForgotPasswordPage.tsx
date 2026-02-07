import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, Loader, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { requestPasswordReset, isLoading, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email.includes('@')) return

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err) {
      console.error('Reset request failed:', err)
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
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
          <motion.div className="text-center" variants={itemVariants}>
            <motion.div
              className="inline-block mb-4 w-16 h-16 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle2 size={32} className="text-green-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-slate-400 mb-6">
              We sent password reset instructions to {email}
            </p>
            <motion.button
              onClick={() => navigate('/auth/login')}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
            >
              Back to Login
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    )
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
        <motion.div className="mb-8" variants={itemVariants}>
          <button
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email to receive reset instructions</p>
        </motion.div>

        {/* Form Card */}
        <motion.form onSubmit={handleSubmit} className="card-glass space-y-4" variants={itemVariants}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !email}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
