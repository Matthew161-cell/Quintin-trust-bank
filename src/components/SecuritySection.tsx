import { motion } from 'framer-motion'
import { Lock, CheckCircle, Server, Shield } from 'lucide-react'

export const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Military-Grade Encryption',
      description: 'AES-256 encryption for all data at rest and in transit.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Shield,
      title: 'AI Fraud Detection',
      description: 'Machine learning detects and prevents fraud 24/7.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'ISO 27001 Certified',
      description: 'Internationally recognized information security standards.',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Server,
      title: '99.99% Uptime',
      description: 'Bank-grade infrastructure with redundant systems.',
      color: 'from-orange-400 to-orange-600',
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bank-Grade
            <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
              Security & Compliance
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Your security is our top priority. Military-grade encryption protects your every transaction.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {securityFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="card-glass text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon size={32} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Security Visual */}
        <motion.div
          className="card-glass mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Lock size={64} className="text-primary-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Enterprise-Grade Infrastructure
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Distributed across multiple data centers with real-time replication. Biometric authentication, 2FA, and device fingerprinting protect your account.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Encryption', value: 'AES-256' },
                { label: 'Data Centers', value: '5+' },
                { label: 'Security Audits', value: 'Quarterly' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <p className="text-primary-400 font-bold text-xl">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          className="grid md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { badge: '🏛️', text: 'SOC 2 Type II' },
            { badge: '✅', text: 'GDPR Compliant' },
            { badge: '🛡️', text: 'PCI DSS Level 1' },
            { badge: '📋', text: 'ISO 27001' },
          ].map((compliance) => (
            <motion.div
              key={compliance.text}
              variants={itemVariants}
              className="glass rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl block mb-2">{compliance.badge}</span>
              <p className="text-white font-semibold text-sm">{compliance.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
