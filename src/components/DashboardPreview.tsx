import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Eye, DollarSign, PieChart as PieChartIcon } from 'lucide-react'

export const DashboardPreview = () => {
  const chartData = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 5200 },
    { month: 'Mar', value: 4800 },
    { month: 'Apr', value: 6100 },
    { month: 'May', value: 7300 },
    { month: 'Jun', value: 8900 },
  ]

  const expenseData = [
    { name: 'Utilities', value: 35, fill: '#36a7ff' },
    { name: 'Food', value: 28, fill: '#10b981' },
    { name: 'Transport', value: 22, fill: '#f59e0b' },
    { name: 'Entertainment', value: 15, fill: '#ec4899' },
  ]

  const transactions = [
    { id: 1, title: 'Salary Deposit', amount: '+$5,000', time: '2 hours ago', icon: '💰' },
    { id: 2, title: 'Subscription', amount: '-$12.99', time: '5 hours ago', icon: '🔄' },
    { id: 3, title: 'Coffee Shop', amount: '-$4.50', time: '1 day ago', icon: '☕' },
    { id: 4, title: 'Investment Returns', amount: '+$850', time: '3 days ago', icon: '📈' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Financial Dashboard,
            <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
              Reimagined
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Real-time insights, beautiful visualizations, and intelligent recommendations all in one place.
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6 mb-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Portfolio Overview */}
          <motion.div
            variants={cardVariants}
            className="card-glass lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-400" />
                Portfolio Growth
              </h3>
              <span className="text-primary-400 font-semibold text-sm">+12.5% YoY</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
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
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={cardVariants}
            className="card-glass"
          >
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Total Balance</span>
                  <DollarSign size={16} className="text-primary-400" />
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  $48,392.50
                </motion.p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">This Month</span>
                  <Eye size={16} className="text-cyan-400" />
                </div>
                <p className="text-2xl font-bold text-white">$3,250</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Investments</span>
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">$12,450</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Expense Breakdown and Transactions */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Expense Pie Chart */}
          <motion.div
            variants={cardVariants}
            className="card-glass"
          >
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary-400" />
              Spending Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            variants={cardVariants}
            className="card-glass"
          >
            <h3 className="text-white font-bold text-lg mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{tx.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{tx.title}</p>
                      <p className="text-slate-400 text-xs">{tx.time}</p>
                    </div>
                  </div>
                  <motion.span
                    className={`font-semibold text-sm ${
                      tx.amount.startsWith('+') ? 'text-green-400' : 'text-slate-300'
                    }`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {tx.amount}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
