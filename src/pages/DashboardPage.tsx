import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MainDashboard } from '../components/dashboard/MainDashboard'
import { AdminDashboard } from './admin/AdminDashboard'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  // Show admin dashboard if user is admin
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  return <MainDashboard />
}
