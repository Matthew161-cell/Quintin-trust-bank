import React from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowUpRight, Send, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { AccountBalanceCard } from './AccountBalanceCard'
import { FinancialChart } from './FinancialChart'
import { TransactionHistory } from './TransactionHistory'
import { ProfileCompletion } from './ProfileCompletion'
import { LoanStatusWidget } from './LoanStatusWidget'
import { KeyMetricsWidget } from './KeyMetricsWidget'
import { SecurityAlertsWidget } from './SecurityAlertsWidget'

export const MainDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex h-screen md:pl-64">
        {/* Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Top Bar */}
          <TopBar
            userName={user?.fullName || 'User'}
            userEmail={user?.email || 'user@example.com'}
          />

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto">
            <motion.div
              className="p-4 md:p-8 pb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Welcome section */}
              <motion.div
                className="mb-8"
                variants={itemVariants}
              >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-slate-400">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </motion.div>

              {/* Key Metrics */}
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Key Metrics</h2>
                <KeyMetricsWidget />
              </motion.div>

              {/* Quick actions */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                variants={itemVariants}
              >
                {[
                  { icon: Download, label: 'Deposit', href: '#' },
                  { icon: Send, label: 'Withdraw', href: '#' },
                  { icon: ArrowUpRight, label: 'Transfer', href: '/dashboard/send-receive' },
                  { icon: Plus, label: 'Add Card', href: '#' },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => action.href !== '#' && navigate(action.href)}
                    className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <action.icon
                        size={20}
                        className="text-primary-300 group-hover:text-cyan-300 transition-colors"
                      />
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Account Balance - Full width on mobile, 2 columns on desktop */}
                <motion.div
                  className="lg:col-span-2"
                  variants={itemVariants}
                >
                  <AccountBalanceCard />
                </motion.div>

                {/* Profile Completion */}
                <motion.div variants={itemVariants}>
                  <ProfileCompletion />
                </motion.div>
              </div>

              {/* Charts and data - Single column */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Financial Chart */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-96">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Account Growth
                    </h3>
                    <FinancialChart />
                  </div>
                </motion.div>
              </div>

              {/* Transaction History - Full width */}
              <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-8"
                variants={itemVariants}
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Recent Transactions
                </h3>
                <TransactionHistory />
              </motion.div>

              {/* Loan, KYC, and Security - 2 column grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Loan Status */}
                <motion.div variants={itemVariants}>
                  <LoanStatusWidget />
                </motion.div>

                {/* Security & Alerts */}
                <motion.div variants={itemVariants}>
                  <SecurityAlertsWidget />
                </motion.div>
              </div>

              {/* Security notification */}
              <motion.div
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-xl p-4 flex items-center gap-3"
                variants={itemVariants}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-green-300">
                    Your account is secure
                  </p>
                  <p className="text-xs text-green-300/70">
                    2FA enabled • Email verified • KYC complete
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
