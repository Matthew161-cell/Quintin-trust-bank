import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Navigation = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    { name: 'Smart Accounts', href: '#' },
    { name: 'Instant Payments', href: '#' },
    { name: 'Crypto Integration', href: '#' },
    { name: 'Business Banking', href: '#' },
  ]

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="font-bold text-xl text-white hidden sm:block">Quintin</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors">
              Services
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'services' && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-48 glass rounded-xl py-2 px-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {services.map((service) => (
                    <motion.a
                      key={service.name}
                      href={service.href}
                      className="block px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {service.name}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#" className="text-slate-200 hover:text-white transition-colors">
            Security
          </a>
          <a href="#" className="text-slate-200 hover:text-white transition-colors">
            Blog
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            className="px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/login')}
          >
            Sign In
          </motion.button>
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/signup')}
          >
            Open Account
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden glass mt-4 mx-4 rounded-xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                Services
              </a>
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                Security
              </a>
              <a href="#" className="text-slate-200 hover:text-white transition-colors">
                Blog
              </a>
              <hr className="border-white/10 my-2" />
              <motion.button
                className="px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors text-left w-full"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  navigate('/auth/login')
                  setIsOpen(false)
                }}
              >
                Sign In
              </motion.button>
              <motion.button
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  navigate('/auth/signup')
                  setIsOpen(false)
                }}
              >
                Open Account
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
