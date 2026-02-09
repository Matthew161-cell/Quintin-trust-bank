import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { syncService } from '../../services/syncService'

interface StoredTransaction {
  id: string
  type: 'local' | 'international'
  from: string
  to: string
  recipientName: string
  amount: number
  currency: string
  description: string
  status: string
  timestamp: string
  fee?: number
  country?: string
  bankAddress?: string
}

interface Transaction {
  id: string
  type: 'send' | 'receive' | 'buy' | 'sell'
  from: string
  to: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  fee: number
  recipientName?: string
  country?: string
  bankAddress?: string
  description?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-500/20 border-green-400/50'
    case 'pending':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/50'
    case 'failed':
      return 'text-red-400 bg-red-500/20 border-red-400/50'
    default:
      return 'text-slate-400 bg-slate-500/20 border-slate-400/50'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'send':
      return '↑'
    case 'receive':
      return '↓'
    case 'buy':
      return '💳'
    case 'sell':
      return '💰'
    default:
      return '○'
  }
}

const convertStoredToTransaction = (stored: StoredTransaction): Transaction => {
  return {
    id: stored.id,
    type: 'send', // User transfers are always 'send'
    from: stored.from,
    to: stored.to,
    amount: stored.amount,
    currency: stored.currency,
    status: stored.status as 'completed' | 'pending' | 'failed',
    timestamp: new Date(stored.timestamp).toLocaleString('en-US', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    fee: stored.fee || 0,
    recipientName: stored.recipientName,
    country: stored.country,
    bankAddress: stored.bankAddress,
    description: stored.description,
  }
}

const getTransferDetails = (tx: Transaction) => {
  return {
    id: tx.id,
    recipientName: tx.recipientName || 'N/A',
    country: tx.country || 'N/A',
    bankAddress: tx.bankAddress || 'N/A',
    description: tx.description || 'No description',
  }
}

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    from: 'Exchange API',
    to: 'Your Wallet',
    amount: 0.5,
    currency: 'BTC',
    status: 'completed',
    timestamp: '02/05/26 14:32',
    fee: 0.0001,
  },
  {
    id: '2',
    type: 'send',
    from: 'Your Wallet',
    to: '1A1z7ago...',
    amount: 5000,
    currency: 'USDC',
    status: 'completed',
    timestamp: '02/05/26 12:15',
    fee: 0.5,
  },
  {
    id: '3',
    type: 'buy',
    from: 'Bank Transfer',
    to: 'Your Wallet',
    amount: 2.5,
    currency: 'ETH',
    status: 'pending',
    timestamp: '02/05/26 10:42',
    fee: 15.0,
  },
]

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions)

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.email) return

      try {
        // Fetch from backend first (cross-device sync)
        const backendTransactions = await syncService.fetchTransactions(user.email)
        
        // Also get from localStorage as fallback
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]') as StoredTransaction[]
        
        // Merge both sources (backend takes priority for duplicates)
        const backendIds = new Set(backendTransactions.map((t) => t.id))
        const uniqueLocal = localTransactions.filter((t) => !backendIds.has(t.id))
        const mergedTransactions = [...backendTransactions, ...uniqueLocal]

        // Filter for current user and convert to Transaction format
        const userTransactions = mergedTransactions
          .filter((tx) => tx.from === user.email)
          .reverse() // Most recent first
          .map(convertStoredToTransaction)

        // Combine with default transactions if user has transfers, otherwise show defaults
        setTransactions(userTransactions.length > 0 
          ? [...userTransactions, ...defaultTransactions]
          : defaultTransactions
        )
      } catch (error) {
        console.error('Error loading transactions:', error)
        // Fallback to localStorage
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]') as StoredTransaction[]
        const userTransactions = localTransactions
          .filter((tx) => tx.from === user.email)
          .reverse()
          .map(convertStoredToTransaction)

        setTransactions(userTransactions.length > 0 
          ? [...userTransactions, ...defaultTransactions]
          : defaultTransactions
        )
      }
    }

    loadTransactions()
  }, [user?.email])

  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filterStatus)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Transactions
            </h1>
            <p className="text-slate-400 text-lg">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-semibold transition-all shadow-lg shadow-cyan-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={18} />
            Export Report
          </motion.button>
        </div>

        {/* Filter Pills */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {['all', 'completed', 'pending', 'failed'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all border text-sm ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/15 hover:border-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Transactions Grid */}
      <motion.div
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, idx) => (
            <motion.div
              key={tx.id || idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                {/* Transaction Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                      tx.type === 'receive' || tx.type === 'buy'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : tx.type === 'send'
                        ? 'bg-gradient-to-br from-orange-500 to-red-500'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                    }`}>
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {tx.type === 'receive' ? 'Money Received' : tx.type === 'buy' ? 'Purchase' : tx.type === 'send' ? 'Money Sent' : 'Transfer'}
                      </p>
                      <p className="text-slate-300 text-sm">{tx.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      tx.type === 'receive' || tx.type === 'buy' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {tx.type === 'receive' || tx.type === 'buy' ? '+' : '-'}{tx.amount.toFixed(2)} {tx.currency}
                    </p>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border mt-2 ${getStatusColor(tx.status)}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Core Transaction Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/30">
                    <p className="text-slate-400 text-xs font-semibold uppercase mb-2">From</p>
                    <p className="text-white font-semibold truncate">{tx.from}</p>
                  </div>
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/30">
                    <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Recipient Name</p>
                    <p className="text-white font-semibold truncate">{tx.recipientName || tx.to || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/30">
                    <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Account Number</p>
                    <p className="text-white font-semibold truncate">{tx.to}</p>
                  </div>
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/30">
                    <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Currency</p>
                    <p className="text-white font-semibold">{tx.currency}</p>
                  </div>
                </div>

                {/* Additional Transfer Details */}
                {(() => {
                  const details = getTransferDetails(tx)
                  return (
                    <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/30">
                      <p className="text-slate-300 text-xs font-semibold uppercase mb-4 pb-2 border-b border-slate-600/30">Transfer Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Country</p>
                          <p className="text-white font-medium">{details.country}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Bank Address</p>
                          <p className="text-white font-medium">{details.bankAddress}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Fee</p>
                          <p className="text-white font-medium">{tx.fee?.toFixed(2) || '0.00'} {tx.currency}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Amount</p>
                          <p className="text-cyan-400 font-medium font-bold">{tx.amount.toFixed(2)} {tx.currency}</p>
                        </div>
                        {details.description && details.description !== 'No description' && (
                          <div className="sm:col-span-2">
                            <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Description</p>
                            <p className="text-white font-medium">{details.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-16"
            variants={itemVariants}
          >
            <div className="inline-block mb-4 p-4 bg-white/10 rounded-2xl">
              <Filter size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-400 text-lg">No transactions found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
