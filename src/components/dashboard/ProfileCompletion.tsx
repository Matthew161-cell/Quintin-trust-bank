import React from 'react'
import { motion } from 'framer-motion'
import { Check, User, Mail, Phone, FileText } from 'lucide-react'

interface ProfileCompletionProps {
  completionPercentage?: number
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercentage = 75,
}) => {
  const tasks = [
    { icon: User, label: 'Complete Profile', completed: true },
    { icon: Mail, label: 'Verify Email', completed: true },
    { icon: Phone, label: 'Add Phone', completed: true },
    { icon: FileText, label: 'KYC Documents', completed: false },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="card-glass rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h3 className="text-lg font-bold text-white mb-4">Profile Completion</h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Progress</span>
          <motion.span
            className="text-lg font-bold text-primary-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {completionPercentage}%
          </motion.span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task, index) => {
          const Icon = task.icon
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                task.completed ? 'bg-green-500/10' : 'bg-white/5 hover:bg-white/10'
              } transition-colors cursor-pointer`}
              whileHover={{ x: 5 }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.completed
                    ? 'bg-green-500/20 border border-green-400/50'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                {task.completed ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Icon size={16} className="text-slate-400" />
                )}
              </div>
              <span
                className={`text-sm ${
                  task.completed ? 'text-green-400 line-through' : 'text-slate-300'
                }`}
              >
                {task.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <motion.button
        className="w-full mt-6 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm font-medium border border-primary-400/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Complete Profile →
      </motion.button>
    </motion.div>
  )
}
