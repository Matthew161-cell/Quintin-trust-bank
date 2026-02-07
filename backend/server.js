import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config()

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
