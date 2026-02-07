import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface KYCStatusProps {
  status?: 'verified' | 'pending' | 'failed'
}

export const KYCStatusWidget: React.FC<KYCStatusProps> = ({ status = 'verified' }) => {
  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/50',
      title: 'KYC Verified',
      description: 'Your identity has been verified',
      badge: '✓ Verified',
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/50',
      title: 'KYC Pending',
      description: 'Verification in progress (24-48 hours)',
      badge: '⏳ Pending',
    },
    failed: {
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/50',
      title: 'KYC Failed',
      description: 'Please contact support to resolve',
      badge: '✗ Failed',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-6 backdrop-blur-xl`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon size={24} className={config.color} />
          <h3 className="text-lg font-bold text-white">{config.title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
          {config.badge}
        </span>
      </div>
      <p className="text-slate-400 text-sm">{config.description}</p>
    </motion.div>
  )
}
