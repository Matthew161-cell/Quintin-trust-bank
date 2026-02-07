import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import { AlertCircle, Lock, Mail } from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="relative w-full max-w-md"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Quintin Trust Bank Administration
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-6 flex items-gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@quintin.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-400 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-400 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center mb-3">Demo Credentials:</p>
            <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 text-xs text-slate-300 font-mono">
              <p>Email: <span className="text-cyan-300">admin@example.com</span></p>
              <p>Password: <span className="text-cyan-300">admin123</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
