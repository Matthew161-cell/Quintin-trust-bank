import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface FinancialChartProps {
  title?: string
  data?: Array<{ name: string; value: number; investmentValue?: number }>
  showPortfolio?: boolean
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  title = 'Account Balance',
  data = [
    { name: 'Jan', value: 24000, investmentValue: 8000 },
    { name: 'Feb', value: 28000, investmentValue: 10000 },
    { name: 'Mar', value: 26000, investmentValue: 12000 },
    { name: 'Apr', value: 32000, investmentValue: 14000 },
    { name: 'May', value: 38000, investmentValue: 16000 },
    { name: 'Jun', value: 48000, investmentValue: 18000 },
  ],
  showPortfolio = false,
}) => {
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
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Last 6 months trend</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-400">+12.5%</p>
          <p className="text-xs text-green-400">↑ vs last period</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {showPortfolio ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0b87f9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0b87f9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0b87f9"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Area
              type="monotone"
              dataKey="investmentValue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorInvest)"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#36a7ff"
              strokeWidth={3}
              dot={{ fill: '#0b87f9', r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
