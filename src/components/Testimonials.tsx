import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Founder, TechVentures',
      content: 'Quintin transformed how I manage my startup finances. Instant transfers, real-time insights, and zero hidden fees.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
    },
    {
      name: 'Marcus Johnson',
      title: 'Crypto Investor',
      content: 'The crypto-to-fiat integration is seamless. I finally have a bank that understands the modern digital economy.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      verified: true,
    },
    {
      name: 'Elena Rodriguez',
      title: 'Freelancer, Designer',
      content: 'Getting paid by international clients is now simple. No middlemen, no delays. Just instant payments.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      verified: true,
    },
    {
      name: 'James Wilson',
      title: 'Business Owner, EU',
      content: 'The business banking features are incredible. Multi-currency support saved me thousands in conversion fees.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      verified: true,
    },
  ]

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getVisibleIndices = () => {
    const indices = []
    for (let i = 0; i < (window.innerWidth >= 1024 ? 3 : 1); i++) {
      indices.push((activeIndex + i) % testimonials.length)
    }
    return indices
  }

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by
            <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
              2.5M+ Users Worldwide
            </span>
          </h2>
          <p className="text-slate-300 text-lg">
            See what our community is saying about their Quintin experience.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Testimonial Cards */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="wait">
              {getVisibleIndices().map((index) => {
                const testimonial = testimonials[index]
                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="card-glass"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-primary-400 text-primary-400"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-slate-300 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{testimonial.name}</p>
                          {testimonial.verified && (
                            <motion.div
                              className="w-5 h-5 bg-primary-400 rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="text-white text-xs">✓</span>
                            </motion.div>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={prev}
              className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-primary-400 w-8'
                      : 'bg-white/30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
