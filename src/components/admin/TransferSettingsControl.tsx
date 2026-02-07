import React from 'react'
import { motion } from 'framer-motion'
import { Settings, ToggleRight, ToggleLeft } from 'lucide-react'
import { useTransferSettings } from '../../contexts/TransferSettingsContext'

export const TransferSettingsControl: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useTransferSettings()

  const handleToggleTransfers = () => {
    updateSettings({ transfersEnabled: !settings.transfersEnabled })
  }

  const handleSuccessRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
    updateSettings({ successRate: value })
  }

  const handleDailyLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0)
    updateSettings({ dailyLimit: value })
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Transfer Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Transfers */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white mb-1">Enable Transfers</p>
              <p className="text-sm text-slate-400">
                {settings.transfersEnabled ? 'All transfers are currently enabled' : 'All transfers are currently disabled'}
              </p>
            </div>
            <motion.button
              onClick={handleToggleTransfers}
              className={`p-2 rounded-lg transition-all ${
                settings.transfersEnabled
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {settings.transfersEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="mb-4">
            <label className="block font-semibold text-white mb-2">
              Transfer Success Rate
            </label>
            <p className="text-sm text-slate-400 mb-3">
              Percentage of transfers that will succeed (0-100%)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.successRate}
                onChange={handleSuccessRateChange}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-cyan-300 font-semibold min-w-[3.5rem]">
                {settings.successRate}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <motion.button
              onClick={() => updateSettings({ successRate: 0 })}
              className="bg-red-500/20 text-red-300 py-2 rounded hover:bg-red-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Fail
            </motion.button>
            <motion.button
              onClick={() => updateSettings({ successRate: 50 })}
              className="bg-yellow-500/20 text-yellow-300 py-2 rounded hover:bg-yellow-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              50/50
            </motion.button>
            <motion.button
              onClick={() => updateSettings({ successRate: 100 })}
              className="bg-green-500/20 text-green-300 py-2 rounded hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Pass
            </motion.button>
          </div>
        </div>

        {/* Daily Limit */}
        <div className="bg-white/10 rounded-lg p-4">
          <label className="block font-semibold text-white mb-2">
            Daily Transfer Limit
          </label>
          <p className="text-sm text-slate-400 mb-3">
            Maximum total transfers allowed per day
          </p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">$</span>
            <input
              type="number"
              value={settings.dailyLimit}
              onChange={handleDailyLimitChange}
              min="0"
              step="1000"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Current Settings Display */}
        <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-cyan-300 mb-2">Current Configuration</p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Transfers: <span className={settings.transfersEnabled ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'}>{settings.transfersEnabled ? 'Enabled' : 'Disabled'}</span></li>
            <li>• Success Rate: <span className="text-cyan-300 font-semibold">{settings.successRate}%</span></li>
            <li>• Daily Limit: <span className="text-cyan-300 font-semibold">${settings.dailyLimit.toLocaleString()}</span></li>
          </ul>
        </div>

        {/* Reset Button */}
        <motion.button
          onClick={resetSettings}
          className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-slate-300 font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset to Defaults
        </motion.button>
      </div>
    </motion.div>
  )
}
