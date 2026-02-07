import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Download, Copy, Eye, EyeOff } from 'lucide-react'

interface Wallet {
  id: string
  name: string
  symbol: string
  balance: number
  icon: string
  color: string
  address: string
}

const wallets: Wallet[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 2.45,
    icon: '₿',
    color: 'from-orange-400 to-orange-600',
    address: '1A1z7agoat2FLYYN1g7mp1gqKtiGrCstv',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 15.8,
    icon: 'Ξ',
    color: 'from-blue-400 to-purple-600',
    address: '0x742d35Cc6634C0532925a3b844Bc91e4B39e0a1a',
  },
  {
    id: '3',
    name: 'USDC',
    symbol: 'USDC',
    balance: 5400.25,
    icon: 'U',
    color: 'from-cyan-400 to-blue-600',
    address: '0x8ac76a51cc950d9822d68b83fe1ad0c2f7e6b6a1',
  },
  {
    id: '4',
    name: 'Solana',
    symbol: 'SOL',
    balance: 125.5,
    icon: '◎',
    color: 'from-purple-400 to-pink-600',
    address: 'Gh9ZwEmdLJ8DscKNm8AmRiMjSGvfqKJZhxXSoLKV7qS',
  },
]

export const WalletsPage: React.FC = () => {
  const [showAddress, setShowAddress] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
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
    <div className="p-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Wallets</h1>
        <p className="text-slate-400">Manage your crypto wallets and balances</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {wallets.map((wallet) => (
          <motion.div
            key={wallet.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white font-bold text-xl`}>
                {wallet.icon}
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300">
                {wallet.symbol}
              </span>
            </div>

            <h3 className="text-white font-bold text-lg mb-1">{wallet.name}</h3>
            <p className="text-green-400 font-bold text-xl mb-4">
              {wallet.balance.toLocaleString()} {wallet.symbol}
            </p>

            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-400 mb-2">Wallet Address</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-white text-xs font-mono truncate">
                  {showAddress === wallet.id ? wallet.address : wallet.address.slice(0, 8) + '...'}
                </p>
                <div className="flex gap-1">
                  <motion.button
                    onClick={() => setShowAddress(showAddress === wallet.id ? null : wallet.id)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    {showAddress === wallet.id ? (
                      <EyeOff size={14} className="text-slate-400" />
                    ) : (
                      <Eye size={14} className="text-slate-400" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleCopyAddress(wallet.address)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Copy size={14} className={copiedAddress === wallet.address ? 'text-green-400' : 'text-slate-400'} />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={14} />
                Send
              </motion.button>
              <motion.button
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 border border-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={14} />
                Receive
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Total Wallet Value */}
      <motion.div
        className="bg-gradient-to-br from-primary-500/20 to-cyan-500/20 border border-primary-400/50 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-slate-400 text-sm mb-2">Total Wallet Value</p>
        <p className="text-white text-4xl font-bold mb-1">$45,280.50</p>
        <p className="text-green-400 text-sm">
          ↑ 12.5% from last month
        </p>
      </motion.div>
    </div>
  )
}
