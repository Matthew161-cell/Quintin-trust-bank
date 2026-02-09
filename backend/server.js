import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Setup SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// In-memory store for OTPs (in production, use a database)
const otpStore = {}
const OTP_EXPIRY = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 5

// In-memory store for user data (cross-device sync)
const transactionsStore = {} // email -> [transactions]
const customerDataStore = {} // email -> { balance, fullName, phone, etc }
const adminDataStore = {} // email -> { role, permissions, adminSettings, etc }
let usersRegistry = [] // All registered users - synced across devices
let globalTransferSettings = { transfersEnabled: true, successRate: 100, dailyLimit: 100000 } // Global transfer settings
const userTransferSettingsStore = {} // userId -> { transfersEnabled, successRate }

// File-based persistence
const DATA_FILE = path.join(__dirname, 'sync_data.json')

// Load persistent data from file on startup
const loadPersistentData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8')
      const data = JSON.parse(raw)
      Object.assign(transactionsStore, data.transactions || {})
      Object.assign(customerDataStore, data.customerData || {})
      Object.assign(adminDataStore, data.adminData || {})
      Object.assign(userTransferSettingsStore, data.userTransferSettings || {})
      if (data.usersRegistry && Array.isArray(data.usersRegistry) && data.usersRegistry.length > 0) {
        usersRegistry = data.usersRegistry
      }
      if (data.globalTransferSettings) {
        globalTransferSettings = data.globalTransferSettings
      }
      console.log('✅ Loaded persistent data from file')
      console.log(`   Users: ${usersRegistry.length}, Customers: ${Object.keys(customerDataStore).length}, Transactions: ${Object.keys(transactionsStore).length}`)
    } else {
      console.log('ℹ️  No persistent data file found on startup - starting fresh')
    }
  } catch (e) {
    console.log('⚠️  Error loading persistent data:', e.message)
  }
}

// Save all data to file for persistence across restarts
const savePersistentData = () => {
  try {
    const data = {
      transactions: transactionsStore,
      customerData: customerDataStore,
      adminData: adminDataStore,
      usersRegistry: usersRegistry,
      globalTransferSettings: globalTransferSettings,
      userTransferSettings: userTransferSettingsStore,
      savedAt: new Date().toISOString(),
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch (e) {
    console.warn('⚠️  Failed to save persistent data:', e.message)
  }
}

// Auto-save every 30 seconds
setInterval(savePersistentData, 30000)

loadPersistentData()

/**
 * Generate random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP email via SendGrid
 */
const sendOTPEmail = async (email, code) => {
  try {
    const response = await sgMail.send({
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Your Quintin Trust Bank OTP',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .code-box { 
                background: linear-gradient(135deg, #00d9ff 0%, #0096d1 100%);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin: 30px 0;
              }
              .code { 
                font-size: 48px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .footer { 
                font-size: 12px;
                color: #999;
                text-align: center;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #00d9ff; margin: 0;">Quintin Trust Bank</h2>
                <p style="color: #999; margin: 5px 0 0 0;">Security Verification</p>
              </div>
              
              <p>Hello,</p>
              <p>Your One-Time Password (OTP) for Quintin Trust Bank is:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p style="color: #666;">
                This code will expire in <strong>10 minutes</strong>.
              </p>
              
              <p style="color: #666;">
                <strong>⚠️ Important:</strong> Never share this code with anyone, including Quintin Trust Bank staff.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <div class="footer">
                <p>If you didn't request this code, please ignore this email.</p>
                <p>© 2026 Quintin Trust Bank. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    process.stdout.write(`✅ Email delivered to ${email} (SendGrid message ID: ${response[0]?.headers?.['x-message-id'] || 'N/A'})\n`)
    return true
  } catch (error) {
    process.stdout.write(`❌ SendGrid error sending to ${email}:\n`)
    process.stdout.write(`   Status: ${error.code || error.status}\n`)
    process.stdout.write(`   Message: ${error.message}\n`)
    if (error.response?.body?.errors) {
      process.stdout.write(`   Details: ${JSON.stringify(error.response.body.errors)}\n`)
    }
    return false
  }
}

/**
 * POST /api/send-otp - Request OTP
 */
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const otp = generateOTP()
    const now = Date.now()

    // Store OTP
    otpStore[normalizedEmail] = {
      code: otp,
      createdAt: now,
      expiresAt: now + OTP_EXPIRY,
      attempts: 0,
      verified: false,
    }

    // Log OTP for development/testing
    const logMessage = `
╔════════════════════════════════════════╗
║        🔐 OTP GENERATED (DEV MODE)             ║
╚════════════════════════════════════════╝
Email: ${normalizedEmail}
OTP Code: ${otp}
Expires in ${OTP_EXPIRY / 1000 / 60} minutes
════════════════════════════════════════
    `
    process.stdout.write(logMessage)

    // Send email
    const sent = await sendOTPEmail(normalizedEmail, otp)

    if (!sent) {
      process.stdout.write(`⚠️ Email send failed (likely unverified sender). Use OTP from logs above for testing.\n`)
      // In development, still allow OTP to work via logs
      return res.json({
        success: true,
        message: `OTP sent to ${normalizedEmail}. Check backend console for code (development mode)`,
        expiresIn: OTP_EXPIRY / 1000,
      })
    }

    res.json({
      success: true,
      message: `OTP sent to ${normalizedEmail}`,
      expiresIn: OTP_EXPIRY / 1000, // seconds
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/verify-otp - Verify OTP code
 */
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const record = otpStore[normalizedEmail]

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Request a new one.',
      })
    }

    // Check expiry
    if (Date.now() > record.expiresAt) {
      delete otpStore[normalizedEmail]
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Request a new one.',
      })
    }

    // Check attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      delete otpStore[normalizedEmail]
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Request a new OTP.',
      })
    }

    // Verify code
    if (code.trim() !== record.code) {
      record.attempts += 1
      const remaining = MAX_ATTEMPTS - record.attempts
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining.`,
      })
    }

    // Verified!
    record.verified = true
    res.json({ success: true, message: 'OTP verified successfully' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/clear-otp - Clear OTP after successful action
 */
app.post('/api/clear-otp', (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    delete otpStore[normalizedEmail]

    res.json({ success: true, message: 'OTP cleared' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/check-otp-status - Check if OTP is verified
 */
app.post('/api/check-otp-status', (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const record = otpStore[normalizedEmail]

    if (!record) {
      return res.json({ verified: false, message: 'No OTP found' })
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[normalizedEmail]
      return res.json({ verified: false, message: 'OTP expired' })
    }

    res.json({
      verified: record.verified,
      remainingTime: Math.ceil((record.expiresAt - Date.now()) / 1000),
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/transactions - Save a transaction
 */
app.post('/api/sync/transactions', (req, res) => {
  try {
    const { email, transaction } = req.body

    if (!email || !transaction) {
      return res.status(400).json({ success: false, message: 'Email and transaction required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    
    if (!transactionsStore[normalizedEmail]) {
      transactionsStore[normalizedEmail] = []
    }

    // Add or update transaction
    const existingIndex = transactionsStore[normalizedEmail].findIndex(
      (t) => t.id === transaction.id
    )

    if (existingIndex >= 0) {
      transactionsStore[normalizedEmail][existingIndex] = transaction
    } else {
      transactionsStore[normalizedEmail].push(transaction)
    }

    console.log(`✅ Transaction saved for ${normalizedEmail}`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Transaction saved',
      transaction,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/transactions/:email - Get all transactions for a user
 */
app.get('/api/sync/transactions/:email', (req, res) => {
  try {
    const normalizedEmail = req.params.email.toLowerCase().trim()
    const transactions = transactionsStore[normalizedEmail] || []

    res.json({
      success: true,
      transactions,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/customer - Save/update customer data
 */
app.post('/api/sync/customer', (req, res) => {
  try {
    const { email, data } = req.body

    if (!email || !data) {
      return res.status(400).json({ success: false, message: 'Email and data required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Merge with existing data
    customerDataStore[normalizedEmail] = {
      ...customerDataStore[normalizedEmail],
      ...data,
      email: normalizedEmail,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`✅ Customer data updated for ${normalizedEmail}`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Customer data saved',
      data: customerDataStore[normalizedEmail],
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/customer/:email - Get customer data
 */
app.get('/api/sync/customer/:email', (req, res) => {
  try {
    const normalizedEmail = req.params.email.toLowerCase().trim()
    const data = customerDataStore[normalizedEmail] || null

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/balance - Update user balance
 */
app.post('/api/sync/balance', (req, res) => {
  try {
    const { email, balance } = req.body

    if (!email || balance === undefined) {
      return res.status(400).json({ success: false, message: 'Email and balance required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!customerDataStore[normalizedEmail]) {
      customerDataStore[normalizedEmail] = {}
    }

    customerDataStore[normalizedEmail].balance = balance
    customerDataStore[normalizedEmail].lastUpdated = new Date().toISOString()

    console.log(`✅ Balance updated for ${normalizedEmail}: ${balance}`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Balance updated',
      balance,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/admin - Save/update admin data
 */
app.post('/api/sync/admin', (req, res) => {
  try {
    const { email, data } = req.body

    if (!email || !data) {
      return res.status(400).json({ success: false, message: 'Email and data required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Merge with existing admin data
    adminDataStore[normalizedEmail] = {
      ...adminDataStore[normalizedEmail],
      ...data,
      email: normalizedEmail,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`✅ Admin data synced for ${normalizedEmail}`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Admin data saved',
      data: adminDataStore[normalizedEmail],
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/admin/:email - Get admin data
 */
app.get('/api/sync/admin/:email', (req, res) => {
  try {
    const normalizedEmail = req.params.email.toLowerCase().trim()
    const data = adminDataStore[normalizedEmail] || null

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/admin-settings - Save admin settings/preferences
 */
app.post('/api/sync/admin-settings', (req, res) => {
  try {
    const { email, settings } = req.body

    if (!email || !settings) {
      return res.status(400).json({ success: false, message: 'Email and settings required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!adminDataStore[normalizedEmail]) {
      adminDataStore[normalizedEmail] = {}
    }

    adminDataStore[normalizedEmail].settings = settings
    adminDataStore[normalizedEmail].settingsUpdatedAt = new Date().toISOString()

    console.log(`✅ Admin settings updated for ${normalizedEmail}`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Admin settings saved',
      settings,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/users - Get all registered users
 */
app.get('/api/sync/users', (req, res) => {
  try {
    res.json({
      success: true,
      users: usersRegistry,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/users - Save/update all users registry
 */
app.post('/api/sync/users', (req, res) => {
  try {
    const { users } = req.body

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ success: false, message: 'Users array required' })
    }

    // Replace entire users registry with new data
    usersRegistry = users

    console.log(`✅ Users registry synced: ${users.length} users`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Users registry updated',
      userCount: users.length,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/transfer-settings - Get global transfer settings
 */
app.get('/api/sync/transfer-settings', (req, res) => {
  try {
    res.json({
      success: true,
      settings: globalTransferSettings,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/transfer-settings - Save global transfer settings
 */
app.post('/api/sync/transfer-settings', (req, res) => {
  try {
    const { settings } = req.body

    if (!settings) {
      return res.status(400).json({ success: false, message: 'Settings required' })
    }

    globalTransferSettings = {
      ...globalTransferSettings,
      ...settings,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`✅ Global transfer settings updated:`, globalTransferSettings)
    savePersistentData()

    res.json({
      success: true,
      message: 'Transfer settings saved',
      settings: globalTransferSettings,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/user-transfer-settings - Get all user transfer settings
 */
app.get('/api/sync/user-transfer-settings', (req, res) => {
  try {
    res.json({
      success: true,
      settings: userTransferSettingsStore,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/sync/user-transfer-settings/:userId - Get transfer settings for a specific user
 */
app.get('/api/sync/user-transfer-settings/:userId', (req, res) => {
  try {
    const userId = req.params.userId
    const settings = userTransferSettingsStore[userId] || {
      userId,
      transfersEnabled: true,
      successRate: 100,
    }

    res.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/user-transfer-settings - Save user transfer settings
 */
app.post('/api/sync/user-transfer-settings', (req, res) => {
  try {
    const { userId, settings } = req.body

    if (!userId || !settings) {
      return res.status(400).json({ success: false, message: 'userId and settings required' })
    }

    userTransferSettingsStore[userId] = {
      userId,
      transfersEnabled: settings.transfersEnabled !== undefined ? settings.transfersEnabled : true,
      successRate: settings.successRate !== undefined ? settings.successRate : 100,
      lastUpdated: new Date().toISOString(),
    }

    console.log(`✅ User transfer settings updated for ${userId}:`, userTransferSettingsStore[userId])
    savePersistentData()

    res.json({
      success: true,
      message: 'User transfer settings saved',
      settings: userTransferSettingsStore[userId],
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/sync/user-transfer-settings/bulk - Save all user transfer settings at once
 */
app.post('/api/sync/user-transfer-settings/bulk', (req, res) => {
  try {
    const { settings } = req.body

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings object required' })
    }

    Object.assign(userTransferSettingsStore, settings)

    console.log(`✅ Bulk user transfer settings synced: ${Object.keys(settings).length} users`)
    savePersistentData()

    res.json({
      success: true,
      message: 'Bulk user transfer settings saved',
      count: Object.keys(settings).length,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' })
})

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🏦 Quintin Trust Bank Backend        ║
║  Running on http://localhost:${PORT}       ║
║  Mode: ${process.env.NODE_ENV}                    ║
╚════════════════════════════════════════╝
  `)

  // Check SendGrid API key
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
    console.log('⚠️  WARNING: SendGrid API key not configured!')
    console.log('   OTP emails will not be sent.')
    console.log('   See backend/.env file to add your API key.')
  } else {
    console.log('✅ SendGrid configured')
  }
})
