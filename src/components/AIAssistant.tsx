import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Sparkles } from 'lucide-react'

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m Quintin AI. How can I help you manage your finances today?',
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setMessages([
      ...messages,
      { id: messages.length + 1, type: 'user', text: inputValue },
      {
        id: messages.length + 2,
        type: 'bot',
        text: 'Thanks for that. I\'m analyzing your request with AI insights to give you the best recommendation.',
      },
    ])
    setInputValue('')
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            <div>
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50">
                <span className="text-cyan-300 text-sm font-medium flex items-center gap-2">
                  <Sparkles size={16} /> AI-Powered
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Personal AI
                <span className="block text-transparent bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text">
                  Financial Assistant
                </span>
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Meet Quintin AI—your intelligent financial copilot. Get personalized advice, investment recommendations, and financial insights powered by advanced machine learning.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                'Smart spending analysis & budget optimization',
                'Real-time market insights & investment alerts',
                'Instant financial questions answered 24/7',
                'Personalized wealth-building recommendations',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
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
              Chat with Quintin AI
            </motion.button>
          </motion.div>

          {/* Chat UI - Right Side */}
          <motion.div
            variants={containerVariants}
            className="card-glass h-[500px] flex flex-col"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Chat Header */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                Quintin AI
              </h3>
              <p className="text-xs text-slate-400">Online and ready to help</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'bg-white/10 text-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary-400/50"
              />
              <motion.button
                type="submit"
                className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Chat Button - Bottom Right */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle size={28} />
      </motion.button>
    </section>
  )
}
