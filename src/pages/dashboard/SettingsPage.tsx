import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Bell, User, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

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
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </motion.div>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Section */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profile Information</h2>
              <p className="text-slate-400 text-sm">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <motion.button
              className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Security</h2>
              <p className="text-slate-400 text-sm">Manage your security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 2FA Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-primary-400" />
                <div>
                  <p className="text-white font-semibold">Two-Factor Authentication</p>
                  <p className="text-slate-400 text-sm">Add an extra layer of security</p>
                </div>
              </div>
              <motion.button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full transition-all ${
                  twoFactorEnabled ? 'bg-green-500' : 'bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: twoFactorEnabled ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </motion.button>
            </div>

            {/* Password Change */}
            <motion.button
              className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-cyan-400/50 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 text-left">
                <Lock size={18} className="text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Change Password</p>
                  <p className="text-slate-400 text-sm">Update your password</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </motion.button>

            {/* Linked Accounts */}
            <motion.button
              className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-cyan-400/50 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 text-left">
                <CreditCard size={18} className="text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Linked Bank Accounts</p>
                  <p className="text-slate-400 text-sm">Manage your linked accounts</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <p className="text-slate-400 text-sm">Manage how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <p className="text-white font-semibold">Email Notifications</p>
                <p className="text-slate-400 text-sm">Receive updates via email</p>
              </div>
              <motion.button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-12 h-6 rounded-full transition-all ${
                  emailNotifications ? 'bg-green-500' : 'bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: emailNotifications ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </motion.button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <p className="text-white font-semibold">Push Notifications</p>
                <p className="text-slate-400 text-sm">Receive push alerts</p>
              </div>
              <motion.button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full transition-all ${
                  pushNotifications ? 'bg-green-500' : 'bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: pushNotifications ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.button
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-2xl text-red-400 font-semibold transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  )
}
