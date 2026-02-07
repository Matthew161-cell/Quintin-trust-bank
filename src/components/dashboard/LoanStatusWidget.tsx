import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface LoanStatusWidgetProps {
  loanAmount?: number
  monthlyPayment?: number
  remainingBalance?: number
  dueDate?: string
  status?: 'active' | 'completed' | 'overdue'
}

export const LoanStatusWidget: React.FC<LoanStatusWidgetProps> = ({
  loanAmount = 25000,
  monthlyPayment = 750,
  remainingBalance = 18500,
  dueDate = 'Feb 15, 2026',
  status = 'active',
}) => {
  const progress = ((loanAmount - remainingBalance) / loanAmount) * 100

  const statusConfig = {
    active: {
      color: 'bg-blue-500/20',
      borderColor: 'border-blue-400/50',
      textColor: 'text-blue-400',
      icon: '⏳',
    },
    completed: {
      color: 'bg-green-500/20',
      borderColor: 'border-green-400/50',
      textColor: 'text-green-400',
      icon: '✓',
    },
    overdue: {
      color: 'bg-red-500/20',
      borderColor: 'border-red-400/50',
      textColor: 'text-red-400',
      icon: '⚠',
    },
  }

  const config = statusConfig[status]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className={`${config.color} border ${config.borderColor} rounded-2xl p-6 backdrop-blur-xl`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Active Loan</h3>
        <span className="text-2xl">{config.icon}</span>
      </div>

      {/* Loan Info */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-slate-400 mb-1">Loan Amount</p>
            <p className="text-lg font-bold text-white">${loanAmount.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-slate-400 mb-1">Monthly Payment</p>
            <p className="text-lg font-bold text-primary-300">${monthlyPayment.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-slate-400 mb-1">Remaining Balance</p>
            <p className="text-lg font-bold text-white">${remainingBalance.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <Clock size={16} className={config.textColor} />
            <div>
              <p className="text-xs text-slate-400">Next Payment</p>
              <p className="text-sm font-bold text-white">{dueDate}</p>
            </div>
          </motion.div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Repayment Progress</span>
            <motion.span
              className="text-sm font-bold text-primary-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {progress.toFixed(0)}%
            </motion.span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        className="w-full py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm font-medium border border-primary-400/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Make Payment
      </motion.button>
    </motion.div>
  )
}
