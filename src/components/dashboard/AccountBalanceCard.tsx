import React from 'react'
import { motion } from 'framer-motion'
import { Send, Eye, EyeOff, CreditCard, MoreVertical } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CountUp } from 'use-count-up'
import { useAuth } from '../../contexts/AuthContext'
import { useCustomerData } from '../../contexts/CustomerDataContext'

interface AccountBalanceCardProps {
  cardType?: 'primary' | 'secondary'
  balance?: number
  cardNumber?: string
  expiryDate?: string
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  cardType = 'primary',
  balance = 48392.50,
  cardNumber = '•••• •••• •••• 4892',
  expiryDate = '12/26',
}) => {
  const [showBalance, setShowBalance] = useState(true)
  const { user } = useAuth()
  const { getCustomer } = useCustomerData()
  const [displayBalance, setDisplayBalance] = useState(balance)

  // Check if admin has edited this customer's balance
  useEffect(() => {
    if (user?.email) {
      const customerData = getCustomer(user.email)
      if (customerData && customerData.balance) {
        setDisplayBalance(customerData.balance)
      }
    }
  }, [user?.email, getCustomer])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  }

  const cardGradient = cardType === 'primary'
    ? 'from-gradient-to-br from-primary-500 via-primary-600 to-primary-700'
    : 'from-slate-700 via-slate-800 to-slate-900'

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${cardGradient} border border-white/20 cursor-pointer`}
      variants={containerVariants}
      whileHover="hover"
      initial="hidden"
      animate="visible"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-white/80 text-sm font-medium">Checking Account</span>
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical size={20} className="text-white/60" />
          </motion.button>
        </div>

        {/* Card Chip */}
        <div className="mb-12">
          <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
        </div>

        {/* Balance Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Available Balance</p>
            <motion.button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              {showBalance ? (
                <Eye size={18} className="text-white/60" />
              ) : (
                <EyeOff size={18} className="text-white/60" />
              )}
            </motion.button>
          </div>
          <motion.h3
            className="text-4xl font-bold text-white"
            key={showBalance ? 'visible' : 'hidden'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {showBalance ? (
              <>
                $<CountUp isCounting duration={2} end={displayBalance} />
              </>
            ) : (
              '••••••'
            )}
          </motion.h3>
        </div>

        {/* Card Details */}
        <div className="flex items-center justify-between pt-8 border-t border-white/20">
          <div>
            <p className="text-white/70 text-xs mb-2 uppercase tracking-wider font-semibold">Card Number</p>
            <p className="text-white font-mono text-lg font-bold tracking-widest">{cardNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs mb-2 uppercase tracking-wider font-semibold">Expires</p>
            <p className="text-white font-mono text-lg font-bold">{expiryDate}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <div className="flex gap-2 p-4">
          <motion.button
            className="p-2 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} className="text-white" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreditCard size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
