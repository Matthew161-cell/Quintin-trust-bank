import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const FinalCTA = () => {
  const navigate = useNavigate()
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
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Lights */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/50 text-primary-300 text-sm font-medium flex items-center gap-2 justify-center">
              <Sparkles size={16} /> Ready to Transform Your Finances?
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              Join 2.5M+
              <span className="block text-transparent bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text">
                Smart Bankers Today
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Open your account in 2 minutes. No credit card required. Start banking smarter.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 mb-8"
          >
            {[
              { icon: '⚡', text: 'Instant Account Opening' },
              { icon: '🔒', text: 'Bank-Grade Security' },
              { icon: '🌍', text: 'Global Transfers' },
            ].map((stat, index) => (
              <motion.div
                key={stat.text}
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-slate-200">{stat.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth/signup')}
            >
              Open Account Now
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className="btn-outline px-8 py-4 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          {/* Trust Message */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-sm"
          >
            ✓ No hidden fees • ✓ FDIC Insured • ✓ 99.99% Uptime • ✓ 24/7 Support
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
