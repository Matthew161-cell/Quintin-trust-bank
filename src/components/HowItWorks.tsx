import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account in 2 minutes with just an email and phone number.',
      icon: '📱',
    },
    {
      number: '02',
      title: 'Verify Identity',
      description: 'Complete KYC verification using AI-powered document scanning.',
      icon: '🔐',
    },
    {
      number: '03',
      title: 'Fund Your Account',
      description: 'Link your bank account or deposit crypto instantly.',
      icon: '💳',
    },
    {
      number: '04',
      title: 'Start Banking',
      description: 'Access all features and begin managing your finances.',
      icon: '🚀',
    },
    {
      number: '05',
      title: 'Grow Your Wealth',
      description: 'Invest, save, and earn with our AI-powered recommendations.',
      icon: '📈',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
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
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/50 text-primary-300 text-sm font-medium flex items-center gap-2">
              <Zap size={16} /> Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Started in 5 Simple Steps
          </h2>
          <p className="text-slate-300 text-lg">
            From zero to banking hero in minutes. No complexity, no confusion.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical Connector Line - Mobile */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-cyan-500 md:hidden" />

          {/* Horizontal Connector Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 z-0" />

          {/* Steps */}
          <div className="grid md:grid-cols-5 gap-4 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="md:relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 ml-16 md:ml-0"
              >
                {/* Mobile Dot */}
                <div className="absolute -left-9 w-8 h-8 bg-slate-900 border-2 border-primary-400 rounded-full flex items-center justify-center md:hidden z-10">
                  <span className="text-xs font-bold text-primary-400">{step.number.split('').join('')}</span>
                </div>

                {/* Desktop Circle */}
                <motion.div
                  className="hidden md:flex w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-6 relative z-10 mx-auto"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <motion.div
                  className="md:text-center"
                  whileHover={{ x: [0, 5, 0] }}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute -left-9 top-32 h-12 flex items-center">
                    <ArrowRight size={16} className="text-primary-400 transform -rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Your Account Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
