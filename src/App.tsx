import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import { CustomerDataProvider } from './contexts/CustomerDataContext'
import { UsersRegistryProvider } from './contexts/UsersRegistryContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute'
import { TransferSettingsProvider } from './contexts/TransferSettingsContext'
import { UserTransferSettingsProvider } from './contexts/UserTransferSettingsContext'

// Pages
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { TrustMetrics } from './components/TrustMetrics'
import { FeaturesGrid } from './components/FeaturesGrid'
import { DashboardPreview } from './components/DashboardPreview'
import { LoanSection } from './components/LoanSection'
import { HowItWorks } from './components/HowItWorks'
import { PremiumShowcase } from './components/PremiumShowcase'
import { Testimonials } from './components/Testimonials'
import { SecuritySection } from './components/SecuritySection'
import { AIAssistant } from './components/AIAssistant'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'

// Auth Pages
import { SignupPage } from './pages/auth/SignupPage'
import { LoginPage } from './pages/auth/LoginPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { Setup2FAPage } from './pages/auth/Setup2FAPage'
import { DashboardPage } from './pages/DashboardPage'

// Dashboard Pages
import { WalletsPage } from './pages/dashboard/WalletsPage'
import { TransactionsPage } from './pages/dashboard/TransactionsPage'
import { TransferPage } from './pages/dashboard/TransferPage'
import { InvestmentsPage } from './pages/dashboard/InvestmentsPage'
import { SettingsPage } from './pages/dashboard/SettingsPage'

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

const HomePage = () => (
  <div className="bg-slate-900 text-white overflow-hidden">
    <Navigation />
    <Hero />
    <TrustMetrics />
    <FeaturesGrid />
    <PremiumShowcase />
    <DashboardPreview />
    <LoanSection />
    <HowItWorks />
    <Testimonials />
    <SecuritySection />
    <AIAssistant />
    <FinalCTA />
    <Footer />
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <CustomerDataProvider>
            <UsersRegistryProvider>
              <TransferSettingsProvider>
                <UserTransferSettingsProvider>
                  <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/setup-2fa" element={<Setup2FAPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <AdminUsersPage />
                </AdminProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/wallets"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <WalletsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transactions"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/send-receive"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <TransferPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/investments"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <InvestmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute requiredEmailVerification={false}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </UserTransferSettingsProvider>
              </TransferSettingsProvider>
            </UsersRegistryProvider>
          </CustomerDataProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
