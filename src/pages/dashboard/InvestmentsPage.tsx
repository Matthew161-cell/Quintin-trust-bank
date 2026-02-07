import React from 'react'
import { motion } from 'framer-motion'
import { PieChart as PieChartComponent, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Investment {
  id: string
  name: string
  symbol: string
  amount: number
  value: number
  roi: number
  status: 'gaining' | 'losing'
}

const investments: Investment[] = [
  {
    id: '1',
    name: 'Bitcoin Spot Trading',
    symbol: 'BTC',
    amount: 2.5,
    value: 106762.50,
    roi: 12.5,
    status: 'gaining',
  },
  {
    id: '2',
    name: 'Ethereum Staking',
    symbol: 'ETH',
    amount: 15.8,
    value: 36972.0,
    roi: 8.3,
    status: 'gaining',
  },
  {
    id: '3',
    name: 'Solana DeFi Pool',
    symbol: 'SOL',
    amount: 125.5,
    value: 12356.75,
    roi: -2.1,
    status: 'losing',
  },
  {
    id: '4',
    name: 'Index Fund',
    symbol: 'INDEX',
    amount: 5000,
    value: 5340.0,
    roi: 6.8,
    status: 'gaining',
  },
]

const pieData = [
  { name: 'Bitcoin', value: 45, color: '#f59e0b' },
  { name: 'Ethereum', value: 28, color: '#8b5cf6' },
  { name: 'Solana', value: 15, color: '#ec4899' },
  { name: 'Index Fund', value: 12, color: '#06b6d4' },
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

export const InvestmentsPage: React.FC = () => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)
  const totalROI = investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length
  const totalProfitLoss = investments.reduce((sum, inv) => sum + (inv.value * inv.roi / 100), 0)

  return (
    <div className="p-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Investment Portfolio</h1>
        <p className="text-slate-400">Track your active investments and performance</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: 'Portfolio Value',
            value: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-400/50',
          },
          {
            title: 'Average ROI',
            value: `${totalROI.toFixed(2)}%`,
            color: 'from-green-500/20 to-emerald-500/20',
            borderColor: 'border-green-400/50',
            positive: totalROI > 0,
          },
          {
            title: 'Total P&L',
            value: `$${totalProfitLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
            color: totalProfitLoss > 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-rose-500/20',
            borderColor: totalProfitLoss > 0 ? 'border-green-400/50' : 'border-red-400/50',
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-2xl p-6 backdrop-blur-xl`}
            variants={itemVariants}
          >
            <p className="text-slate-400 text-sm mb-2">{card.title}</p>
            <p className={`text-3xl font-bold ${card.positive ? 'text-green-400' : 'text-white'}`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Investments List */}
        <motion.div
          className="lg:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-bold text-white mb-4">Active Investments</h2>
          <div className="space-y-4">
            {investments.map((investment, idx) => (
              <motion.div
                key={investment.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                      {investment.symbol.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{investment.name}</h3>
                      <p className="text-slate-400 text-sm">{investment.amount} {investment.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${investment.value.toLocaleString()}</p>
                    <p className={`text-sm font-semibold ${
                      investment.roi >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {investment.roi >= 0 ? '+' : ''}{investment.roi.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (investment.roi + 20) * 2.5)}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Asset Allocation Chart */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-bold text-white mb-4">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChartComponent>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'white' }}
              />
            </PieChartComponent>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {pieData.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  ></div>
                  <span className="text-slate-300 text-sm">{asset.name}</span>
                </div>
                <span className="text-white font-semibold text-sm">{asset.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
