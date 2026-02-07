import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext'
import { Users, CreditCard, TrendingUp, Settings, LogOut, Menu, X, AlertCircle, BarChart3, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { TransferSettingsControl } from '../../components/admin/TransferSettingsControl'

export const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdmin()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: '2,547',
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: DollarSign,
      label: 'Total Transactions',
      value: '$125.4M',
      change: '+8.5%',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: CreditCard,
      label: 'Active Cards',
      value: '1,892',
      change: '+5.2%',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: AlertCircle,
      label: 'Alerts',
      value: '23',
      change: '+3',
      color: 'from-red-500 to-red-600',
    },
  ]

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Large withdrawal', amount: '$50,000', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Account created', amount: 'N/A', time: '4 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'KYC verified', amount: 'N/A', time: '6 hours ago' },
    { id: 4, user: 'Sarah Williams', action: 'Failed login attempt', amount: 'N/A', time: '8 hours ago' },
    { id: 5, user: 'Tom Brown', action: 'Card issued', amount: 'N/A', time: '10 hours ago' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex h-screen md:pl-64">
        {/* Sidebar */}
        <motion.aside
          className={`fixed left-0 top-0 h-screen w-64 bg-slate-900/95 border-r border-white/10 backdrop-blur-xl flex flex-col z-40 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ type: 'spring', damping: 30 }}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <div>
                <p className="font-bold text-white">Admin</p>
                <p className="text-xs text-slate-400">Control Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
              { icon: Users, label: 'Users', path: '/admin/users' },
              { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
              { icon: TrendingUp, label: 'Reports', path: '/admin/reports' },
              { icon: AlertCircle, label: 'System Alerts', path: '/admin/alerts' },
              { icon: Settings, label: 'Settings', path: '/admin/settings' },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              whileHover={{ x: 4 }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
              </button>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-slate-300">{admin?.fullName}</p>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{admin?.fullName?.[0]}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <motion.div
              className="p-6 space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Grid */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.label}
                      className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl border border-white/10 overflow-hidden`}
                      variants={itemVariants}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-white">{stat.value}</p>
                          <p className="text-white/50 text-xs mt-2">{stat.change} from last month</p>
                        </div>
                        <stat.icon size={40} className="text-white/30" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <motion.div
                className="bg-white/5 border border-white/10 rounded-xl p-6"
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div>
                        <p className="text-white font-medium">{activity.user}</p>
                        <p className="text-slate-400 text-sm">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">{activity.amount}</p>
                        <p className="text-slate-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transfer Settings Control */}
              <motion.div variants={itemVariants}>
                <TransferSettingsControl />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
