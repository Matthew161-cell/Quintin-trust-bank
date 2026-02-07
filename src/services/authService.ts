// Auth Service - Handles authentication logic and JWT simulation
// In production, this would connect to your backend API

interface User {
  id: string
  email: string
  fullName: string
  phone: string
  balance: number
  emailVerified: boolean
  twoFactorEnabled: boolean
  kycStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
  role?: 'admin' | 'user'
  permissions?: string[]
}

interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
}

interface SignupData {
  fullName: string
  email: string
  phone: string
  password: string
}

interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

// Get all registered users from localStorage
const getRegisteredUsers = (): Record<string, { password: string; user: User }> => {
  let stored = localStorage.getItem('users_registry')
  
  // Initialize with default users if empty
  if (!stored) {
    const defaultUsers = [
      {
        id: 'admin-001',
        email: 'admin@example.com',
        fullName: 'Admin User',
        phone: '+1 (555) 000-0001',
        password: 'admin123',
        balance: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        kycStatus: 'verified',
      },
      {
        id: 'demo-user-001',
        email: 'omembeledepaschal@gmail.com',
        fullName: 'Paschal Admin',
        phone: '+1 (555) 000-0000',
        password: 'test123',
        balance: 48392.50,
        status: 'active',
        joinDate: '2025-06-15',
        kycStatus: 'verified',
        role: 'admin',
        permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
      },
      {
        id: 'demo-user-002',
        email: 'demo@example.com',
        fullName: 'Demo User',
        phone: '+1 (555) 111-1111',
        password: 'demo123',
        balance: 22500.00,
        status: 'active',
        joinDate: '2025-07-20',
        kycStatus: 'verified',
      },
      {
        id: 'user-matthew-001',
        email: 'omembeledematthew@gmail.com',
        fullName: 'Matthew Demo',
        phone: '+1 (555) 000-0002',
        password: 'test1234',
        balance: 35000.00,
        status: 'active',
        joinDate: '2025-08-01',
        kycStatus: 'verified',
      },
      {
        id: 'admin-quintin-001',
        email: 'quintin64312@gmail.com',
        fullName: 'Quintin Admin',
        phone: '+1 (555) 000-0003',
        password: 'quin123$',
        balance: 100000.00,
        status: 'active',
        joinDate: '2025-06-01',
        kycStatus: 'verified',
        role: 'admin',
        permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
      },
    ]
    const stringified = JSON.stringify(defaultUsers)
    localStorage.setItem('users_registry', stringified)
    console.log('✅ Initialized default users in localStorage')
    stored = stringified
  }
  
  try {
    const registeredUsers = JSON.parse(stored) as any[]
    const result: Record<string, { password: string; user: User }> = {}
    
    console.log('📋 Loading users from localStorage:')
    console.log('Raw stored data:', stored)
    console.log('Parsed array:', registeredUsers)
    registeredUsers.forEach((registeredUser) => {
      const normalizedEmail = registeredUser.email.toLowerCase()
      console.log(`   ✓ ${normalizedEmail} (password: ${registeredUser.password})`)
      result[normalizedEmail] = {
        password: registeredUser.password || '',
        user: {
          id: registeredUser.id,
          email: registeredUser.email,
          fullName: registeredUser.fullName,
          phone: registeredUser.phone,
          balance: registeredUser.balance || 0,
          emailVerified: true,
          twoFactorEnabled: false,
          kycStatus: registeredUser.kycStatus || 'pending',
          createdAt: registeredUser.joinDate || new Date().toISOString(),
        role: (registeredUser.email === 'admin@example.com' || registeredUser.email === 'omembeledepaschal@gmail.com' || registeredUser.email === 'quintin64312@gmail.com') ? 'admin' : 'user',
          permissions: (registeredUser.email === 'admin@example.com' || registeredUser.email === 'omembeledepaschal@gmail.com' || registeredUser.email === 'quintin64312@gmail.com') ? ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'] : [],
        },
      }
    })
    
    console.log('✅ Final users object keys:', Object.keys(result))
    console.log('Full result object:', result)
    
    // ENSURE the test user exists - this is our primary user (ADMIN)
    if (!result['omembeledepaschal@gmail.com']) {
      console.warn('⚠️  Test user missing! Re-adding...')
      result['omembeledepaschal@gmail.com'] = {
        password: 'test123',
        user: {
          id: 'demo-user-001',
          email: 'omembeledepaschal@gmail.com',
          fullName: 'Paschal Admin',
          phone: '+1 (555) 000-0000',
          balance: 48392.50,
          emailVerified: true,
          twoFactorEnabled: false,
          kycStatus: 'verified',
          createdAt: '2025-06-15',
          role: 'admin',
          permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
        },
      }
      // Save back to localStorage
      const allUsers = registeredUsers.map(u => ({...u}))
      allUsers.push({
        id: 'demo-user-001',
        email: 'omembeledepaschal@gmail.com',
        fullName: 'Paschal Admin',
        phone: '+1 (555) 000-0000',
        password: 'test123',
        balance: 48392.50,
        status: 'active',
        joinDate: '2025-06-15',
        kycStatus: 'verified',
        role: 'admin',
        permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
      })
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }

    // ENSURE Matthew user exists
    if (!result['omembeledematthew@gmail.com']) {
      console.warn('⚠️  Matthew user missing! Re-adding...')
      result['omembeledematthew@gmail.com'] = {
        password: 'test1234',
        user: {
          id: 'user-matthew-001',
          email: 'omembeledematthew@gmail.com',
          fullName: 'Matthew Demo',
          phone: '+1 (555) 000-0002',
          balance: 35000.00,
          emailVerified: true,
          twoFactorEnabled: false,
          kycStatus: 'verified',
          createdAt: '2025-08-01',
          role: 'user',
          permissions: [],
        },
      }
      // Save back to localStorage
      const allUsers = registeredUsers.map(u => ({...u}))
      allUsers.push({
        id: 'user-matthew-001',
        email: 'omembeledematthew@gmail.com',
        fullName: 'Matthew Demo',
        phone: '+1 (555) 000-0002',
        password: 'test1234',
        balance: 35000.00,
        status: 'active',
        joinDate: '2025-08-01',
        kycStatus: 'verified',
      })
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }

    // ENSURE Quintin admin user exists
    if (!result['quintin64312@gmail.com']) {
      console.warn('⚠️  Quintin admin user missing! Re-adding...')
      result['quintin64312@gmail.com'] = {
        password: 'quin123$',
        user: {
          id: 'admin-quintin-001',
          email: 'quintin64312@gmail.com',
          fullName: 'Quintin Admin',
          phone: '+1 (555) 000-0003',
          balance: 100000.00,
          emailVerified: true,
          twoFactorEnabled: false,
          kycStatus: 'verified',
          createdAt: '2025-06-01',
          role: 'admin',
          permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
        },
      }
      // Save back to localStorage
      const allUsers = registeredUsers.map(u => ({...u}))
      allUsers.push({
        id: 'admin-quintin-001',
        email: 'quintin64312@gmail.com',
        fullName: 'Quintin Admin',
        phone: '+1 (555) 000-0003',
        password: 'quin123$',
        balance: 100000.00,
        status: 'active',
        joinDate: '2025-06-01',
        kycStatus: 'verified',
        role: 'admin',
        permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
      })
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }
    
    console.log('✅ Users loaded. Available:', Object.keys(result))
    return result
  } catch (error) {
    console.error('Error reading users from localStorage:', error)
    return {}
  }
}

// Local storage keys
const AUTH_STORAGE_KEY = 'auth_session'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Verify password against plaintext stored password
// NOTE: Storing plaintext for development only - use proper hashing in production
const verifyPassword = (password: string, storedPassword: string): boolean => {
  return password === storedPassword
}

// JWT-like token generation
const generateToken = (userId: string, type: 'access' | 'refresh' = 'access'): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Date.now()
  const expiresIn = type === 'access' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 15min or 7 days
  
  const payload = btoa(
    JSON.stringify({
      userId,
      type,
      iat: now,
      exp: now + expiresIn,
    })
  )
  
  const signature = btoa(`${header}.${payload}.secret`)
  return `${header}.${payload}.${signature}`
}

export const authService = {
  // Initialize default users
  initializeUsers() {
    const stored = localStorage.getItem('users_registry')
    if (!stored) {
      const defaultUsers = [
        {
          id: 'admin-001',
          email: 'admin@example.com',
          fullName: 'Admin User',
          phone: '+1 (555) 000-0001',
          password: 'admin123',
          balance: 0,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          kycStatus: 'verified',
        },
        {
          id: 'demo-user-001',
          email: 'omembeledepaschal@gmail.com',
          fullName: 'Paschal Admin',
          phone: '+1 (555) 000-0000',
          password: 'test123',
          balance: 48392.50,
          status: 'active',
          joinDate: '2025-06-15',
          kycStatus: 'verified',
          role: 'admin',
          permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
        },
        {
          id: 'demo-user-002',
          email: 'demo@example.com',
          fullName: 'Demo User',
          phone: '+1 (555) 111-1111',
          password: 'demo123',
          balance: 22500.00,
          status: 'active',
          joinDate: '2025-07-20',
          kycStatus: 'verified',
        },
        {
          id: 'user-matthew-001',
          email: 'omembeledematthew@gmail.com',
          fullName: 'Matthew Demo',
          phone: '+1 (555) 000-0002',
          password: 'test1234',
          balance: 35000.00,
          status: 'active',
          joinDate: '2025-08-01',
          kycStatus: 'verified',
        },
        {
          id: 'admin-quintin-001',
          email: 'quintin64312@gmail.com',
          fullName: 'Quintin Admin',
          phone: '+1 (555) 000-0003',
          password: 'quin123$',
          balance: 100000.00,
          status: 'active',
          joinDate: '2025-06-01',
          kycStatus: 'verified',
          role: 'admin',
          permissions: ['view_all', 'manage_users', 'manage_transactions', 'view_reports', 'system_settings'],
        },
      ]
      localStorage.setItem('users_registry', JSON.stringify(defaultUsers))
      console.log('✅ Default users initialized in localStorage')
    }
  },

  // Signup
  async signup(data: SignupData): Promise<{ user: User; requiresEmailVerification: boolean }> {
    // Check if user exists (case-insensitive)
    const email = data.email.trim().toLowerCase()
    const users = getRegisteredUsers()
    
    if (users[email]) {
      throw new Error('Email already registered')
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser: User = {
      id: userId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      balance: 0,
      emailVerified: false,
      twoFactorEnabled: false,
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Store to localStorage via users registry
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    allUsers.push({
      id: userId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      password: data.password.trim(),
      balance: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      kycStatus: 'pending',
    })
    localStorage.setItem('users_registry', JSON.stringify(allUsers))

    return {
      user: newUser,
      requiresEmailVerification: true,
    }
  },

  // Login
  async login(data: LoginData): Promise<AuthSession> {
    // Trim and lowercase email for matching
    const email = data.email.trim().toLowerCase()
    const users = getRegisteredUsers()
    
    console.log('Login attempt with email:', email)
    console.log('Available users:', Object.keys(users))
    console.log('Full users object:', users)
    
    const userRecord = users[email]

    if (!userRecord) {
      console.error(`❌ User not found for email: ${email}`)
      throw new Error('Invalid email or password')
    }

    console.log(`✓ User found: ${email}`)
    console.log(`  Stored password: "${userRecord.password}"`)
    console.log(`  Entered password: "${data.password.trim()}"`)
    console.log(`  Password match: ${verifyPassword(data.password.trim(), userRecord.password)}`)

    if (!verifyPassword(data.password.trim(), userRecord.password)) {
      throw new Error('Invalid email or password')
    }

    const accessToken = generateToken(userRecord.user.id, 'access')
    const refreshToken = generateToken(userRecord.user.id, 'refresh')
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    const session: AuthSession = {
      user: userRecord.user,
      accessToken,
      refreshToken,
      expiresAt,
    }

    // Store session
    if (data.rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    }

    return session
  },

  // Verify Email
  async verifyEmail(email: string, code: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getRegisteredUsers()
    const userRecord = users[normalizedEmail]
    
    if (!userRecord) throw new Error('User not found')

    // In production, verify the code with backend
    if (code !== '123456') {
      throw new Error('Invalid verification code')
    }

    // Update in localStorage
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    const userIndex = allUsers.findIndex((u: any) => u.email.toLowerCase() === normalizedEmail)
    if (userIndex !== -1) {
      allUsers[userIndex].emailVerified = true
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }

    return userRecord.user
  },

  // Send verification code
  async sendVerificationCode(email: string): Promise<void> {
    // In production, send real email
    console.log(`Verification code sent to ${email}: 123456`)
  },

  // Password reset
  async requestPasswordReset(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getRegisteredUsers()
    
    if (!users[normalizedEmail]) {
      throw new Error('Email not found')
    }
    // In production, send reset email
    console.log(`Password reset code sent to ${email}: 654321`)
  },

  // Reset password
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getRegisteredUsers()
    const userRecord = users[normalizedEmail]
    
    if (!userRecord) throw new Error('User not found')

    if (code !== '654321') {
      throw new Error('Invalid reset code')
    }

    // Update password in localStorage
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    const userIndex = allUsers.findIndex((u: any) => u.email.toLowerCase() === normalizedEmail)
    if (userIndex !== -1) {
      allUsers[userIndex].password = newPassword.trim()
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }
  },

  // Setup 2FA
  async setup2FA(_userId: string): Promise<{ secret: string; qrCode: string }> {
    // In production, use real 2FA library like speakeasy
    const secret = Math.random().toString(36).substring(2, 15)
    const qrCode = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${secret}`
    
    return { secret, qrCode }
  },

  // Verify 2FA
  async verify2FA(_userId: string, code: string): Promise<boolean> {
    // In production, verify with real 2FA
    return code === '000000'
  },

  // Get current session
  getCurrentSession(): AuthSession | null {
    const session = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY)
    return session ? JSON.parse(session) : null
  },

  // Logout
  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  },

  // Check if token is expired
  isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt
  },

  // Get device info for security
  getDeviceInfo(): {
    userAgent: string
    platform: string
    timestamp: string
  } {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      timestamp: new Date().toISOString(),
    }
  },

  // Register new user credentials (called by admin when creating users)
  registerUserCredentials(email: string, password: string, fullName: string, phone: string = ''): User {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getRegisteredUsers()
    
    // Check if user already exists
    if (users[normalizedEmail]) {
      throw new Error('Email already registered')
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser: User = {
      id: userId,
      email: email, // Store original email as provided
      fullName,
      phone,
      balance: 0,
      emailVerified: false,
      twoFactorEnabled: false,
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
      role: 'user',
    }

    // Store user credentials to localStorage
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    allUsers.push({
      id: userId,
      email: email,
      fullName,
      phone,
      password: password.trim(),
      balance: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      kycStatus: 'pending',
    })
    localStorage.setItem('users_registry', JSON.stringify(allUsers))

    return newUser
  },

  // Update user password (called by admin when changing user password)
  updateUserPassword(email: string, newPassword: string): void {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getRegisteredUsers()
    
    if (!users[normalizedEmail]) {
      throw new Error('User not found')
    }

    // Update password in localStorage
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    const userIndex = allUsers.findIndex((u: any) => u.email.toLowerCase() === normalizedEmail)
    if (userIndex !== -1) {
      allUsers[userIndex].password = newPassword.trim()
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }
  },

  // Update user email (called when admin changes user email)
  updateUserEmail(oldEmail: string, newEmail: string): void {
    const normalizedOldEmail = oldEmail.trim().toLowerCase()
    const normalizedNewEmail = newEmail.trim().toLowerCase()
    
    if (normalizedOldEmail === normalizedNewEmail) {
      return // No change needed
    }
    
    const users = getRegisteredUsers()
    if (!users[normalizedOldEmail]) {
      throw new Error('User not found')
    }
    
    // Update email in localStorage
    const allUsers = JSON.parse(localStorage.getItem('users_registry') || '[]')
    const userIndex = allUsers.findIndex((u: any) => u.email.toLowerCase() === normalizedOldEmail)
    if (userIndex !== -1) {
      allUsers[userIndex].email = newEmail
      localStorage.setItem('users_registry', JSON.stringify(allUsers))
    }
  },}

export default authService