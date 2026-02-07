import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export const Footer = () => {
  const [email, setEmail] = useState('')

  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thanks for subscribing: ${email}`)
    setEmail('')
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-5 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <span className="font-bold text-xl text-white">Quintin</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              The future of banking is here. Intelligent, secure, and built for you.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {['Smart Accounts', 'Instant Payments', 'Crypto', 'Business', 'Investments'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Security', 'Compliance', 'Cookies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest fintech insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary-400 text-sm"
              />
              <motion.button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-r-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-12 py-8 border-t border-b border-white/10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { badge: '🏛️', text: 'FDIC Insured' },
            { badge: '✅', text: 'SOC 2 Type II' },
            { badge: '🛡️', text: 'ISO 27001' },
            { badge: '🌍', text: 'GDPR Compliant' },
          ].map((compliance) => (
            <motion.div
              key={compliance.text}
              variants={itemVariants}
              className="flex items-center gap-2 text-sm text-slate-300"
              whileHover={{ x: 5 }}
            >
              <span className="text-lg">{compliance.badge}</span>
              <span>{compliance.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© {currentYear} Quintin Trust Bank. All rights reserved.</p>
          <p>Built for the future of finance 🚀</p>
        </motion.div>
      </div>
    </footer>
  )
}
