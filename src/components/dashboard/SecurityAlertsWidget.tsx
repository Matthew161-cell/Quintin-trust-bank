import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react'

export const SecurityAlertsWidget: React.FC = () => {
  const alerts = [
    {
      id: '1',
      type: 'info',
      icon: CheckCircle2,
      title: '2FA Enabled',
      description: 'Two-factor authentication is active',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/50',
    },
    {
      id: '2',
      type: 'info',
      icon: Lock,
      title: 'KYC Verified',
      description: 'Your identity has been verified',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/50',
    },
    {
      id: '3',
      type: 'warning',
      icon: AlertCircle,
      title: 'New Device Login',
      description: 'iPhone from New York, 2h ago',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/50',
    },
  ]

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-bold text-white mb-4">Security Status</h3>

      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon
          return (
            <motion.div
              key={alert.id}
              className={`${alert.bgColor} border ${alert.borderColor} rounded-lg p-4 flex items-start gap-3`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Icon size={18} className={`${alert.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className={`${alert.color} font-semibold text-sm`}>{alert.title}</p>
                <p className="text-slate-400 text-xs">{alert.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.button
        className="w-full mt-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 border border-primary-400/50 text-primary-300 text-sm font-medium transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Security Settings
      </motion.button>
    </motion.div>
  )
}
