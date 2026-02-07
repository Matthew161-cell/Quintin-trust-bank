import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  icon: string
}

const topCoins: CoinData[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 42850, change24h: 2.5, icon: '₿' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 2340, change24h: 1.8, icon: 'Ξ' },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 98.5, change24h: -0.5, icon: '◎' },
  { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.95, change24h: 3.2, icon: '◆' },
]

export const MarketOverview: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Market Overview</h3>
        <span className="text-xs text-slate-400">24h Change</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topCoins.map((coin, idx) => (
          <motion.div
            key={coin.id}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {coin.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{coin.symbol}</p>
                  <p className="text-slate-400 text-xs">{coin.name}</p>
                </div>
              </div>
            </div>

            <p className="text-white font-bold mb-2">${coin.price.toLocaleString()}</p>

            <div className={`flex items-center gap-1 text-sm font-medium ${
              coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {coin.change24h >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(coin.change24h).toFixed(2)}%
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
