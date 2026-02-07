import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Send, TrendingUp, Settings, LogOut, CreditCard, HelpCircle, Menu, X, ArrowUpRight, Bell } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', id: 'dashboard' },
    { icon: CreditCard, label: 'Wallets', href: '/dashboard/wallets', id: 'wallets' },
    { icon: Send, label: 'Transactions', href: '/dashboard/transactions', id: 'transactions' },
    { icon: ArrowUpRight, label: 'Send/Receive', href: '/dashboard/send-receive', id: 'send-receive' },
    { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics', id: 'analytics' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications', id: 'notifications' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/support', id: 'support' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', id: 'settings' },
  ]

  const isActive = (href: string) => location.pathname === href

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 md:hidden p-2 rounded-lg bg-white/10 border border-white/20"
      >
        {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900/95 to-slate-900/80 border-r border-white/10 backdrop-blur-xl hidden md:flex flex-col z-40"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          className="p-6 border-b border-white/10"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <p className="font-bold text-white">Quintin</p>
              <p className="text-xs text-slate-400">Fintech</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-400/50'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Footer */}
        <motion.div
          className="p-4 border-t border-white/10 space-y-2"
          variants={itemVariants}
        >
          <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 transition-all">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </button>
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <motion.aside
        className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-900 z-40 md:hidden"
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        {/* Mobile Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <p className="font-bold text-white">Quintin</p>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.href)
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-slate-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 w-full p-4 space-y-2 border-t border-white/10">
          <motion.button
            onClick={() => {
              onLogout()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
