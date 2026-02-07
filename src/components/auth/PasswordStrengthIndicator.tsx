import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
}

const getPasswordStrength = (
  password: string
): { strength: 'weak' | 'fair' | 'good' | 'strong'; score: number; feedback: string[] } => {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 6) score++
  else feedback.push('At least 6 characters')

  if (password.length >= 12) score++
  else feedback.push('Consider using 12+ characters')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Add lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score++
  else feedback.push('Add numbers')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Add special characters')

  let strength: 'weak' | 'fair' | 'good' | 'strong'
  if (score <= 2) strength = 'weak'
  else if (score <= 3) strength = 'fair'
  else if (score <= 4) strength = 'good'
  else strength = 'strong'

  return { strength, score, feedback }
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  if (!password) return null

  const { strength, score, feedback } = getPasswordStrength(password)

  const strengthColors = {
    weak: 'bg-red-500',
    fair: 'bg-orange-500',
    good: 'bg-yellow-500',
    strong: 'bg-green-500',
  }

  const strengthLabels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  }

  return (
    <motion.div
      className="mt-2 space-y-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* Strength Bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < score ? strengthColors[strength] : 'bg-slate-700'
            }`}
            animate={{ scaleX: i < score ? 1 : 0.8 }}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Password Strength</span>
        <span className={`text-xs font-semibold ${
          strength === 'weak'
            ? 'text-red-400'
            : strength === 'fair'
            ? 'text-orange-400'
            : strength === 'good'
            ? 'text-yellow-400'
            : 'text-green-400'
        }`}>
          {strengthLabels[strength]}
        </span>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {feedback.map((tip, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-xs text-slate-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <X size={12} className="text-red-400" />
              <span>{tip}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Requirements Met */}
      {strength === 'strong' && (
        <motion.div
          className="flex items-center gap-2 text-xs text-green-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Check size={12} className="text-green-400" />
          <span>Strong password! Ready to go.</span>
        </motion.div>
      )}
    </motion.div>
  )
}
