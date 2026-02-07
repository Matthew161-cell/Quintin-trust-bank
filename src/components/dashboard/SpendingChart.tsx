import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface SpendingData {
  name: string
  value: number
  color: string
}

interface SpendingChartProps {
  data?: SpendingData[]
}

const defaultData = [
  { name: 'Food & Dining', value: 450, color: '#f59e0b' },
  { name: 'Transportation', value: 320, color: '#3b82f6' },
  { name: 'Entertainment', value: 280, color: '#ec4899' },
  { name: 'Utilities', value: 210, color: '#10b981' },
  { name: 'Shopping', value: 340, color: '#8b5cf6' },
]

export const SpendingChart: React.FC<SpendingChartProps> = ({ data = defaultData }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      className="card-glass rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h3 className="text-lg font-bold text-white mb-6">Spending Overview</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => `$${value}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend & Stats */}
        <div className="flex flex-col justify-center space-y-3">
          <div className="mb-4">
            <p className="text-slate-400 text-sm">Total Spending (This Month)</p>
            <motion.p
              className="text-3xl font-bold text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${total}
            </motion.p>
          </div>

          <div className="space-y-2">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 text-sm">{item.name}</span>
                </div>
                <span className="text-white font-medium text-sm">
                  ${item.value}{' '}
                  <span className="text-slate-400 text-xs">
                    ({((item.value / total) * 100).toFixed(0)}%)
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
