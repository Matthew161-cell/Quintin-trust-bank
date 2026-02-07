// OTP Service - Communicates with backend for OTP management
// Backend handles SendGrid email sending
// @ts-ignore
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001'

export const otpService = {
  /**
   * Request OTP for an email address
   */
  async requestOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to send OTP',
        }
      }

      return {
        success: true,
        message: `OTP sent to ${email}`,
      }
    } catch (error) {
      console.error('Error requesting OTP:', error)
      return {
        success: false,
        message: 'Network error. Please try again.',
      }
    }
  },

  /**
   * Verify OTP code for an email
   */
  async verifyOTP(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: code.trim(),
        }),
      })

      const data = await response.json()

      return {
        success: response.ok,
        message: data.message || (response.ok ? 'OTP verified' : 'Verification failed'),
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return {
        success: false,
        message: 'Network error. Please try again.',
      }
    }
  },

  /**
   * Check if OTP is verified for an email
   */
  async isOTPVerified(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/check-otp-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await response.json()
      return data.verified || false
    } catch (error) {
      console.error('Error checking OTP status:', error)
      return false
    }
  },

  /**
   * Clear OTP for an email (after successful login/transfer)
   */
  async clearOTP(email: string): Promise<void> {
    try {
      await fetch(`${API_URL}/api/clear-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })
    } catch (error) {
      console.error('Error clearing OTP:', error)
    }
  },

  /**
   * Get remaining time for OTP (in seconds)
   */
  async getOTPRemainingTime(email: string): Promise<number> {
    try {
      const response = await fetch(`${API_URL}/api/check-otp-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await response.json()
      return data.remainingTime || 0
    } catch (error) {
      console.error('Error getting remaining time:', error)
      return 0
    }
  },
}
