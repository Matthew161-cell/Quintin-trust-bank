import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Settings, User } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  userName: string
  userEmail: string
}

export const TopBar: React.FC<TopBarProps> = ({ userName, userEmail }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, title: 'Payment Received', message: '$2,500 from Acme Corp', time: '5m ago', icon: '💰' },
    { id: 2, title: 'Security Alert', message: 'New device login detected', time: '1h ago', icon: '🔒' },
    { id: 3, title: 'Portfolio Update', message: 'Your investment gained 2.5%', time: '3h ago', icon: '📈' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 md:left-64 bg-gradient-to-r from-slate-900/95 to-slate-900/80 border-b border-white/10 backdrop-blur-xl z-30 h-20 flex items-center px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full flex items-center justify-between">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl font-bold text-white">Welcome back, {userName}!</h1>
          <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.div className="relative" whileHover={{ scale: 1.1 }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Bell size={20} className="text-slate-300" />
              <motion.span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-80 rounded-lg bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-xl"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex gap-3">
                        <span className="text-lg">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{notif.title}</p>
                          <p className="text-xs text-slate-400 truncate">{notif.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} className="text-slate-300" />
          </motion.button>

          {/* Profile */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-slate-400">{userEmail}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-64 rounded-lg bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-xl"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-slate-400">{userEmail}</p>
                </div>
                <div className="p-3 space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-slate-300 text-sm">
                    👤 Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-slate-300 text-sm">
                    ⚙️ Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-slate-300 text-sm">
                    🔒 Security
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
