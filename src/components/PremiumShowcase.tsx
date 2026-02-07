import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, TrendingUp } from 'lucide-react'

export const PremiumShowcase = () => {
  const showcaseItems = [
    {
      title: 'For Entrepreneurs',
      description: 'Build your empire with advanced business banking tools.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
      icon: Briefcase,
      stats: '500K+ Businesses',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'For Teams',
      description: 'Collaborate seamlessly with real-time transaction insights.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
      icon: Users,
      stats: '2.5M+ Users',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'For Growth',
      description: 'Invest intelligently with AI-powered recommendations.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop',
      icon: TrendingUp,
      stats: '$50B+ Managed',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for
            <span className="block bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Every Ambition
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Whether you're launching a startup, leading a team, or building wealth, Quintin adapts to your goals.
          </p>
        </motion.div>

        {/* Showcase Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {showcaseItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-30 mix-blend-multiply`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-96 p-6 flex flex-col justify-between">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-200 text-sm leading-relaxed">{item.description}</p>
                    </div>

                    {/* Stats and CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary-300 bg-primary-500/20 px-3 py-1 rounded-full">
                        {item.stats}
                      </span>
                      <motion.button
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowRight size={18} className="text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Hover Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-400/50 transition-colors pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-300 mb-4">Ready to transform your financial future?</p>
          <motion.button
            className="btn-primary inline-flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
