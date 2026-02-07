import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Send, Award } from 'lucide-react'

interface MetricCard {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: string
  color: string
}

export const KeyMetricsWidget: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      icon: <Send size={20} />,
      label: 'Total Transactions',
      value: '247',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Portfolio Growth',
      value: '+26.8%',
      change: 'Last 12 months',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: <Target size={20} />,
      label: 'Savings Goal',
      value: '83.7%',
      change: '$125.4K of $150K',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <Award size={20} />,
      label: 'Account Age',
      value: '8 months',
      color: 'from-orange-500/20 to-red-500/20',
    },
  ]

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
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {metrics.map((metric, idx) => (
        <motion.div
          key={idx}
          className={`bg-gradient-to-br ${metric.color} border border-white/10 rounded-xl p-4 backdrop-blur-xl hover:border-cyan-400/50 transition-all`}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-primary-300">
              {metric.icon}
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium mb-1">{metric.label}</p>
          <p className="text-white font-bold text-lg">{metric.value}</p>
          {metric.change && (
            <p className="text-slate-400 text-xs mt-1">{metric.change}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
