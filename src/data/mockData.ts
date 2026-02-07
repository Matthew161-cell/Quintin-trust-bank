// Mock/Fake data for dashboard
// This file contains all fake data that will be replaced by real API calls

export const mockDashboardData = {
  // Account Overview
  account: {
    totalBalance: 125480.50,
    fiatBalance: 45230.75,
    cryptoBalance: 80249.75,
    monthlyChange: 12.5,
    accountNumber: '••• •••• •••• 4892',
    accountType: 'Premium',
    createdAt: '2025-06-15',
  },

  // Portfolio
  portfolio: {
    totalValue: 126750.25,
    dayChange: 2450.50,
    dayChangePercent: 1.97,
    monthChange: 14250.50,
    monthChangePercent: 12.6,
    yearChange: 26750.50,
    yearChangePercent: 26.8,
    bestPerformer: 'Bitcoin',
    worstPerformer: 'Solana',
  },

  // Cards
  cards: [
    {
      id: 'card-1',
      name: 'Primary Card',
      type: 'Visa',
      lastFour: '4892',
      balance: 48392.50,
      limit: 75000.00,
      spent: 26607.50,
      status: 'active',
      expiryDate: '12/26',
    },
    {
      id: 'card-2',
      name: 'Secondary Card',
      type: 'Mastercard',
      lastFour: '7521',
      balance: 22500.00,
      limit: 50000.00,
      spent: 27500.00,
      status: 'active',
      expiryDate: '08/25',
    },
  ],

  // Transactions
  recentTransactions: [
    {
      id: 'tx-1',
      type: 'receive',
      title: 'Salary Deposit',
      description: 'Monthly salary from Acme Corp',
      amount: 5000.00,
      currency: 'USD',
      date: '2026-02-05 14:32:00',
      status: 'completed',
      icon: '↓',
    },
    {
      id: 'tx-2',
      type: 'send',
      title: 'Payment to Alice',
      description: 'Dinner split',
      amount: 45.50,
      currency: 'USD',
      date: '2026-02-05 12:15:00',
      status: 'completed',
      icon: '↑',
    },
    {
      id: 'tx-3',
      type: 'buy',
      title: 'Crypto Purchase',
      description: 'Bought 0.5 BTC',
      amount: 21425.00,
      currency: 'USD',
      date: '2026-02-05 10:42:00',
      status: 'completed',
      icon: '💳',
    },
    {
      id: 'tx-4',
      type: 'send',
      title: 'AWS Subscription',
      description: 'Monthly cloud services',
      amount: 234.50,
      currency: 'USD',
      date: '2026-02-04 16:28:00',
      status: 'completed',
      icon: '↑',
    },
    {
      id: 'tx-5',
      type: 'receive',
      title: 'Freelance Payment',
      description: 'Project completion bonus',
      amount: 1250.00,
      currency: 'USD',
      date: '2026-02-04 09:15:00',
      status: 'completed',
      icon: '↓',
    },
  ],

  // Crypto Holdings
  cryptoHoldings: [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      amount: 2.45,
      price: 42850.00,
      value: 104882.50,
      change24h: 2.5,
      change7d: 5.2,
      percentOfPortfolio: 42.1,
      icon: '₿',
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      amount: 15.8,
      price: 2340.00,
      value: 36972.00,
      change24h: 1.8,
      change7d: 3.1,
      percentOfPortfolio: 14.8,
      icon: 'Ξ',
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      amount: 125.5,
      price: 98.50,
      value: 12356.75,
      change24h: -0.5,
      change7d: -2.1,
      percentOfPortfolio: 5.0,
      icon: '◎',
    },
    {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      amount: 25000.00,
      price: 1.00,
      value: 25000.00,
      change24h: 0.0,
      change7d: 0.0,
      percentOfPortfolio: 10.0,
      icon: 'U',
    },
  ],

  // Spending Analytics
  spendingByCategory: [
    { category: 'Food & Dining', amount: 450, percentage: 28 },
    { category: 'Transportation', amount: 320, percentage: 20 },
    { category: 'Entertainment', amount: 280, percentage: 17 },
    { category: 'Utilities', amount: 210, percentage: 13 },
    { category: 'Shopping', amount: 340, percentage: 22 },
  ],

  totalSpending: 1600.00,
  monthlyBudget: 3000.00,
  budgetRemaining: 1400.00,

  // Performance Chart Data
  performanceData: [
    { month: 'Aug', balance: 95000, portfolio: 94500 },
    { month: 'Sep', balance: 98500, portfolio: 97800 },
    { month: 'Oct', balance: 102000, portfolio: 101200 },
    { month: 'Nov', balance: 108000, portfolio: 107500 },
    { month: 'Dec', balance: 115000, portfolio: 114200 },
    { month: 'Jan', balance: 120000, portfolio: 119500 },
    { month: 'Feb', balance: 125480, portfolio: 126750 },
  ],

  // Key Metrics
  metrics: {
    totalTransactions: 247,
    activeInvestments: 4,
    savingsGoal: 150000,
    savingsProgress: 83.65,
    accountAge: '8 months',
    referrals: 24,
    referralEarnings: 1245.50,
  },

  // Loans
  loans: {
    activeLoans: [
      {
        id: 'loan-1',
        type: 'Personal Loan',
        amount: 25000,
        remaining: 18500,
        monthlyPayment: 750,
        dueDate: 'Feb 15, 2026',
        status: 'active',
        rate: 6.5,
        progress: 26,
      },
    ],
    totalLoaned: 25000,
    totalRemaining: 18500,
  },

  // Security & KYC
  security: {
    kycStatus: 'verified',
    twoFactorEnabled: true,
    passwordLastChanged: '45 days ago',
    loginHistory: [
      { date: '2026-02-05 08:30', location: 'New York, USA', device: 'Chrome on Windows' },
      { date: '2026-02-04 15:45', location: 'New York, USA', device: 'Safari on iPhone' },
      { date: '2026-02-03 10:20', location: 'New York, USA', device: 'Chrome on Windows' },
    ],
  },

  // Notifications
  notifications: [
    {
      id: 'notif-1',
      type: 'transaction',
      title: 'Large Transaction',
      message: 'You sent $5,000 to savings account',
      date: '2026-02-05 14:32',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'alert',
      title: 'New Device Login',
      message: 'Your account was accessed from a new device',
      date: '2026-02-04 09:15',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'info',
      title: 'Portfolio Update',
      message: 'Your investment gained 2.5% this week',
      date: '2026-02-03 16:00',
      read: true,
    },
  ],
}

// Export individual mock data for easier component updates
export const getMockCardData = () => mockDashboardData.cards
export const getMockTransactions = () => mockDashboardData.recentTransactions
export const getMockCryptoHoldings = () => mockDashboardData.cryptoHoldings
export const getMockPortfolioData = () => mockDashboardData.performanceData
export const getMockMetrics = () => mockDashboardData.metrics
export const getMockAccount = () => mockDashboardData.account
