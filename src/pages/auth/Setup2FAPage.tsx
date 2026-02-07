import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { Smartphone, Copy, CheckCircle2, Loader, AlertCircle } from 'lucide-react'

export const Setup2FAPage: React.FC = () => {
  const { setup2FA, verify2FA, isLoading, error, clearError } = useAuth()
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSetup2FA = async () => {
    clearError()
    try {
      const result = await setup2FA()
      setQrCode(result.qrCode)
      setSecret(result.secret)
      setStep('verify')
    } catch (err) {
      console.error('2FA setup failed:', err)
    }
  }

  const handleVerify = async () => {
    clearError()
    if (!verificationCode.match(/^\d{6}$/)) return

    try {
      await verify2FA(verificationCode)
      // Show success message
      setTimeout(() => {
        alert('2FA enabled successfully!')
      }, 500)
    } catch (err) {
      console.error('2FA verification failed:', err)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <Smartphone size={32} className="text-primary-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Two-Factor Authentication</h1>
          <p className="text-slate-400">Secure your account with 2FA</p>
        </motion.div>

        {/* Setup Card */}
        <motion.div className="card-glass space-y-6" variants={itemVariants}>
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

          {step === 'setup' ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Step 1: Install Authenticator</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Download Google Authenticator, Authy, or Microsoft Authenticator from your app store.
                </p>
              </div>

              <motion.button
                onClick={handleSetup2FA}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </motion.button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Step 2: Scan QR Code</h3>
                {qrCode && (
                  <motion.div
                    className="bg-white p-4 rounded-lg mb-4 flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </motion.div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Step 3: Backup Secret Key</h3>
                <motion.div
                  className="p-3 bg-white/5 border border-white/20 rounded-lg flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <code className="text-sm text-primary-400 font-mono break-all">{secret}</code>
                  <motion.button
                    onClick={copyToClipboard}
                    className="ml-2 p-2 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <CheckCircle2 size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-slate-400" />
                    )}
                  </motion.button>
                </motion.div>
                <p className="text-xs text-slate-400 mt-2">Save this key in a safe place</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Step 4: Enter Verification Code</h3>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full text-center text-2xl font-bold bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all py-3 tracking-widest"
                />
              </div>

              <motion.button
                onClick={handleVerify}
                disabled={isLoading || !verificationCode}
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
                    Enable 2FA
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={() => setStep('setup')}
                className="w-full py-3 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Security Info */}
        <motion.div
          className="mt-6 p-4 rounded-lg bg-primary-500/10 border border-primary-400/30 flex items-start gap-3"
          variants={itemVariants}
        >
          <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-primary-300 font-medium mb-1">Enhanced Security</p>
            <p className="text-xs text-primary-200">
              2FA adds an extra layer of protection to your account.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
