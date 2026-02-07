import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export const ReferralCard: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const referralCode = 'QTB-TRUST-2026'
  const referralLink = `https://quintintrust.com/ref/${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-2xl p-6 backdrop-blur-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Gift size={20} className="text-purple-300" />
            Referral Program
          </h3>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-400/30 border border-purple-400/50 text-purple-300">
            Earn Rewards
          </span>
        </div>

        <p className="text-slate-300 text-sm mb-4">
          Invite friends and earn 5% commission on their trading fees
        </p>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-400 mb-2">Your Referral Code</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-mono font-semibold">{referralCode}</p>
            <motion.button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-slate-400" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-slate-400 text-xs mb-1">Total Referrals</p>
            <p className="text-white font-bold text-lg">24</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Earned Rewards</p>
            <p className="text-green-400 font-bold text-lg">$1,245.50</p>
          </div>
        </div>

        <motion.button
          className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Referrals
        </motion.button>
      </div>
    </motion.div>
  )
}
