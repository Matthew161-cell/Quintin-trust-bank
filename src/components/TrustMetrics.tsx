import { motion } from 'framer-motion'
import { useCountUp } from 'use-count-up'

export const TrustMetrics = () => {
  const metrics = [
    { label: 'Active Users', value: 2500000, suffix: '+' },
    { label: 'Assets Processed', value: 85000000000, prefix: '$', suffix: '' },
    { label: 'Countries', value: 150, suffix: '+' },
    { label: 'Uptime', value: 99, suffix: '.99%' },
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-slate-900 via-primary-900 to-slate-900 py-16 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 1 }}
              >
                <NumberCounter value={metric.value} metric={metric} />
              </motion.div>
              <p className="text-slate-300 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

interface NumberCounterProps {
  value: number
  metric: { label: string; prefix?: string; suffix?: string }
}

const NumberCounter: React.FC<NumberCounterProps> = ({ value, metric }) => {
  const { value: displayValue } = useCountUp({
    isCounting: true,
    duration: 2.5,
    end: value,
    formatter: (displayValue: number) => {
      if (displayValue >= 1000000000) {
        return (displayValue / 1000000000).toFixed(1) + 'B'
      } else if (displayValue >= 1000000) {
        return (displayValue / 1000000).toFixed(1) + 'M'
      } else if (displayValue >= 1000) {
        return (displayValue / 1000).toFixed(0) + 'K'
      }
      return displayValue.toString()
    },
  })

  return (
    <>
      {metric.prefix}
      {displayValue}
      {metric.suffix}
    </>
  )
}
