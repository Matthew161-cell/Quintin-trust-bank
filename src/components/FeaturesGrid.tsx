import { motion } from 'framer-motion'
import { 
  Wallet, Zap, Bitcoin, Building2, Shield, Globe, 
  ArrowRight, Sparkles
} from 'lucide-react'

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Smart Accounts',
      description: 'AI-powered accounts that learn your spending patterns and optimize savings automatically.',
      color: 'from-primary-400 to-primary-600',
      delay: 0,
      image: 'https://images.unsplash.com/photo-1554224231-beab60d8376b?w=400&h=300&fit=crop',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Send money globally in seconds. No delays, no hidden fees, no complexity.',
      color: 'from-cyan-400 to-cyan-600',
      delay: 0.1,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
    },
    {
      icon: Bitcoin,
      title: 'Crypto Integration',
      description: 'Seamless crypto-to-fiat conversion with real-time market rates and low fees.',
      color: 'from-orange-400 to-orange-600',
      delay: 0.2,
      image: 'https://images.unsplash.com/photo-1605792657692-4a78635c3c3a?w=400&h=300&fit=crop',
    },
    {
      icon: Building2,
      title: 'Business Banking',
      description: 'Complete business banking suite designed for modern startups and enterprises.',
      color: 'from-purple-400 to-purple-600',
      delay: 0.3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    },
    {
      icon: Shield,
      title: 'AI Fraud Detection',
      description: 'Machine learning protects your account 24/7 with zero-day threat detection.',
      color: 'from-red-400 to-red-600',
      delay: 0.4,
      image: 'https://images.unsplash.com/photo-1548050228-7898dc481cde?w=400&h=300&fit=crop',
    },
    {
      icon: Globe,
      title: 'Global Transfers',
      description: 'Access 150+ countries with optimized exchange rates and multi-currency support.',
      color: 'from-green-400 to-green-600',
      delay: 0.5,
      image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=400&h=300&fit=crop',
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/50 text-primary-300 text-sm font-medium flex items-center gap-2">
              <Sparkles size={16} /> Powerful Features
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
              Manage Your Finances
            </span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover="hover"
                className="group card-glass overflow-hidden"
              >
                {/* Image */}
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                >
                  <Icon size={28} className="text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <motion.div
                  className="flex items-center gap-2 text-primary-400 font-semibold text-sm group-hover:text-primary-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <ArrowRight size={16} />
                </motion.div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-cyan-400 opacity-0 group-hover:opacity-5 blur-lg transition-all duration-300 -z-10" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
