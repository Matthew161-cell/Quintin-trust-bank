import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Check } from 'lucide-react'

export const LoanSection = () => {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [loanTerm, setLoanTerm] = useState(24)

  const monthlyPayment = (loanAmount / loanTerm).toFixed(2)
  const totalInterest = (loanAmount * 0.05).toFixed(2)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Smart Lending at
                <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
                  Lightning Speed
                </span>
              </h2>
              <p className="text-slate-300 text-lg">
                Get approved instantly with transparent rates. No hidden fees, no complex processes.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                'Instant approval within seconds',
                'Competitive rates starting at 4.99%',
                'Flexible repayment terms',
                'No prepayment penalties',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-slate-200">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="btn-primary w-full md:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
          </motion.div>

          {/* Right Calculator */}
          <motion.div
            variants={itemVariants}
            className="card-glass"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap size={24} className="text-primary-400" />
              <h3 className="text-xl font-bold text-white">Loan Calculator</h3>
            </div>

            {/* Loan Amount Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-300 font-medium">Loan Amount</label>
                <motion.span
                  className="text-2xl font-bold text-primary-400"
                  key={loanAmount}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  ${(loanAmount / 1000).toFixed(0)}K
                </motion.span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>$10K</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Loan Term Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-300 font-medium">Repayment Term</label>
                <motion.span
                  className="text-2xl font-bold text-cyan-400"
                  key={loanTerm}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {loanTerm} months
                </motion.span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="6"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>1 year</span>
                <span>5 years</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Monthly Payment</span>
                <motion.span
                  className="text-xl font-bold text-primary-400"
                  key={monthlyPayment}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  ${monthlyPayment}
                </motion.span>
              </div>
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <span className="text-slate-300">Total Interest</span>
                <span className="text-white font-semibold">${totalInterest}</span>
              </div>
            </div>

            {/* Instant Approval Badge */}
            <motion.div
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/50 rounded-lg p-4 text-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-300 font-semibold">Instant Approval Available</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
