import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap } from 'lucide-react'

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
      {/* Full Background Image Gallery */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {[
          'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1635236066449-5b45769be233?w=1200&h=800&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNyeXB0byUyMGludGVyZ3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1666875758412-5957b60d7969?w=1200&h=800&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJhdWQlMjBkZXRlY3Rpb258ZW58MHx8MHx8fDA%3D',
          'https://images.unsplash.com/photo-1731910549709-bfaffd5e73d9?w=1200&h=800&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2xvYmFsJTIwdHJhbnNmZXJ8ZW58MHx8MHx8fDA%3D',
        ].map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Feature ${index}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === 0 ? [0, 1, 1, 0] : index === 1 ? [0, 0, 1, 1, 0] : index === 2 ? [0, 0, 0, 1, 1, 0] : [0, 0, 0, 0, 1, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ))}
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900/40" />
      </div>

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
              Smart Money,
              <span className="block bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Smart Banking
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
        </motion.div>
      </div>
    </div>
  )
}
