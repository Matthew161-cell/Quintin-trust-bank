import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface Transaction {
  id: string
  title: string
  description: string
  amount: number
  type: 'income' | 'expense'
  icon: string
  timestamp: string
  category: string
}

interface TransactionHistoryProps {
  transactions?: Transaction[]
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions = [
    {
      id: '1',
      title: 'Salary Deposit',
      description: 'Monthly salary from Acme Corp',
      amount: 5000,
      type: 'income',
      icon: '💰',
      timestamp: '2 hours ago',
      category: 'Salary',
    },
    {
      id: '2',
      title: 'AWS Payment',
      description: 'Cloud services bill',
      amount: 250,
      type: 'expense',
      icon: '☁️',
      timestamp: '5 hours ago',
      category: 'Subscription',
    },
    {
      id: '3',
      title: 'Transfer to Dave',
      description: 'Personal transfer',
      amount: 500,
      type: 'expense',
      icon: '👤',
      timestamp: '1 day ago',
      category: 'Transfer',
    },
    {
      id: '4',
      title: 'Freelance Project',
      description: 'Payment from client',
      amount: 1500,
      type: 'income',
      icon: '💻',
      timestamp: '2 days ago',
      category: 'Income',
    },
    {
      id: '5',
      title: 'Starbucks',
      description: 'Coffee & food',
      amount: 8.50,
      type: 'expense',
      icon: '☕',
      timestamp: '3 days ago',
      category: 'Food',
    },
  ],
}) => {
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
    <motion.div
      className="card-glass rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <motion.button
          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
        >
          View All →
        </motion.button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Icon */}
              <div className="text-2xl">{tx.icon}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{tx.title}</p>
                <p className="text-xs text-slate-400">{tx.description}</p>
              </div>
            </div>

            {/* Amount & Time */}
            <div className="text-right flex items-center gap-4">
              <div className="text-right">
                <motion.p
                  className={`font-bold text-sm ${
                    tx.type === 'income' ? 'text-green-400' : 'text-slate-300'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </motion.p>
                <p className="text-xs text-slate-500">{tx.timestamp}</p>
              </div>

              {/* Arrow Icon */}
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                {tx.type === 'income' ? (
                  <ArrowDownLeft size={16} className="text-green-400" />
                ) : (
                  <ArrowUpRight size={16} className="text-red-400" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
