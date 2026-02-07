import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Calendar } from 'lucide-react'

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
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    from: 'Exchange API',
    to: 'Your Wallet',
    amount: 0.5,
    currency: 'BTC',
    status: 'completed',
    timestamp: '2026-02-05 14:32',
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
    timestamp: '2026-02-05 12:15',
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
    timestamp: '2026-02-05 10:42',
    fee: 15.0,
  },
  {
    id: '4',
    type: 'sell',
    from: 'Your Wallet',
    to: 'Exchange',
    amount: 100,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2026-02-04 16:28',
    fee: 5.0,
  },
  {
    id: '5',
    type: 'receive',
    from: 'Friend Wallet',
    to: 'Your Wallet',
    amount: 1.25,
    currency: 'BTC',
    status: 'completed',
    timestamp: '2026-02-04 09:15',
    fee: 0,
  },
]

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

export const TransactionsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all')

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
    <div className="p-8">
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-slate-400">View and manage all your transactions</p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={18} />
          Export
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'pending', 'failed'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                filterStatus === status
                  ? 'bg-primary-500 text-white border-primary-400'
                  : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Filter size={18} className="text-slate-400" />
          <Calendar size={18} className="text-slate-400" />
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hidden lg:grid grid-cols-6 gap-4 p-6 border-b border-white/10 bg-white/5">
          <p className="text-slate-400 text-sm font-semibold">Type</p>
          <p className="text-slate-400 text-sm font-semibold">Amount</p>
          <p className="text-slate-400 text-sm font-semibold">From</p>
          <p className="text-slate-400 text-sm font-semibold">To</p>
          <p className="text-slate-400 text-sm font-semibold">Status</p>
          <p className="text-slate-400 text-sm font-semibold">Date</p>
        </div>

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              className="lg:grid lg:grid-cols-6 gap-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-4 lg:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {getTypeIcon(tx.type)}
                </div>
                <span className="text-white font-semibold text-sm lg:hidden">
                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                </span>
              </div>

              <div className="mb-4 lg:mb-0">
                <p className="text-slate-400 text-xs lg:hidden mb-1">Amount</p>
                <p className="text-white font-bold">
                  {tx.type === 'receive' || tx.type === 'buy' ? '+' : '-'}{tx.amount} {tx.currency}
                </p>
              </div>

              <div className="mb-4 lg:mb-0">
                <p className="text-slate-400 text-xs lg:hidden mb-1">From</p>
                <p className="text-slate-300 text-sm truncate">{tx.from}</p>
              </div>

              <div className="mb-4 lg:mb-0">
                <p className="text-slate-400 text-xs lg:hidden mb-1">To</p>
                <p className="text-slate-300 text-sm truncate">{tx.to}</p>
              </div>

              <div className="mb-4 lg:mb-0">
                <p className="text-slate-400 text-xs lg:hidden mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-slate-400 text-xs lg:hidden mb-1">Date</p>
                <p className="text-slate-400 text-sm">{tx.timestamp}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-400">No transactions found</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
