import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Send, CreditCard, Shield, Zap } from 'lucide-react'

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/50 text-primary-300 text-sm font-medium">
                🚀 The Future of Banking
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-white leading-tight"
            >
              Banking for the
              <span className="block bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                AI Era
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-300 leading-relaxed"
            >
              Experience the next generation of digital banking. Instant payments, intelligent insights, and trusted security—all in one powerful platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                className="btn-primary flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Open Account Today
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                className="btn-outline flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-primary-400" />
                <span className="text-sm text-slate-300">Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-primary-400" />
                <span className="text-sm text-slate-300">Instant Transfers</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              className="glass-dark rounded-3xl p-6 relative"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Dashboard Header */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Balance</span>
                  <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard size={16} className="text-primary-400" />
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h3 className="text-4xl font-bold text-white">$48,392.50</h3>
                </motion.div>
              </div>

              {/* Transaction Cards */}
              <div className="space-y-3 mb-6">
                <motion.div
                  className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Investment Gain</p>
                      <p className="text-slate-400 text-xs">Today</p>
                    </div>
                  </div>
                  <span className="text-primary-400 font-semibold">+$1,250</span>
                </motion.div>

                <motion.div
                  className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Send size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Payment Sent</p>
                      <p className="text-slate-400 text-xs">2 min ago</p>
                    </div>
                  </div>
                  <span className="text-slate-400 font-semibold">-$500</span>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                {['Send', 'Request', 'Invest'].map((action) => (
                  <motion.button
                    key={action}
                    className="bg-primary-500/20 hover:bg-primary-500/40 text-primary-300 py-2 rounded-lg text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
