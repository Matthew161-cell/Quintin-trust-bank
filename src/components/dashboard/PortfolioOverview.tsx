import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Check, AlertCircle } from 'lucide-react'

interface Asset {
  id: string
  name: string
  symbol: string
  amount: number
  value: number
  change: number
  icon: string
}

interface PortfolioOverviewProps {
  assets?: Asset[]
  totalValue?: number
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  assets = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 21500, change: 5.2, icon: '₿' },
    { id: '2', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 9500, change: -2.1, icon: 'Ξ' },
    { id: '3', name: 'Apple Inc', symbol: 'AAPL', amount: 50, value: 8500, change: 3.8, icon: '🍎' },
    { id: '4', name: 'Vanguard S&P', symbol: 'VOO', amount: 100, value: 6200, change: 2.1, icon: '📈' },
  ],
  totalValue = 45700,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="card-glass rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-400" />
            Portfolio
          </h3>
          <p className="text-2xl font-bold text-white mt-2">${totalValue.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-400 font-medium">↑ 8.2% this month</p>
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ x: 5 }}
          >
            {/* Asset Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{asset.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{asset.name}</p>
                <p className="text-xs text-slate-400">{asset.amount} {asset.symbol}</p>
              </div>
            </div>

            {/* Value & Change */}
            <div className="text-right">
              <p className="font-bold text-white text-sm">${asset.value.toLocaleString()}</p>
              <motion.p
                className={`text-xs font-medium ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {asset.change >= 0 ? '↑' : '↓'} {Math.abs(asset.change)}%
              </motion.p>
            </div>

            {/* Status */}
            <div className="ml-3">
              {asset.change >= 0 ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <AlertCircle size={18} className="text-red-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
