import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import DotRoster from './screens/DotRoster'
import DriverDetail from './screens/DriverDetail'
import Reports from './screens/Reports'
import Settings from './screens/Settings'
import WellnessTrends from './screens/WellnessTrends'
import EngagementAnalytics from './screens/EngagementAnalytics'
import ActivityFeed from './screens/ActivityFeed'
import DotRenewalTracker from './screens/DotRenewalTracker'
import Integrations from './screens/Integrations'
import InsuranceReport from './screens/InsuranceReport'
import Pricing from './screens/Pricing'
import InviteDrivers from './screens/InviteDrivers'
import AccountSettings from './screens/AccountSettings'
import Support from './screens/Support'
import RiskIntelligence from './screens/RiskIntelligence'

const PrivateRoutes = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/roster"       element={<DotRoster />} />
        <Route path="/driver/:id"   element={<DriverDetail />} />
        <Route path="/reports"      element={<Reports />} />
        <Route path="/settings"     element={<Settings />} />
        <Route path="/trends"       element={<WellnessTrends />} />
        <Route path="/analytics"    element={<EngagementAnalytics />} />
        <Route path="/activity"     element={<ActivityFeed />} />
        <Route path="/renewals"     element={<DotRenewalTracker />} />
        <Route path="/integrations"      element={<Integrations />} />
        <Route path="/insurance-report"  element={<InsuranceReport />} />
        <Route path="/pricing"           element={<Pricing />} />
        <Route path="/invite"            element={<InviteDrivers />} />
        <Route path="/account"           element={<AccountSettings />} />
        <Route path="/support"           element={<Support />} />
        <Route path="/risk"              element={<RiskIntelligence />} />
        <Route path="*"                  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*"     element={<PrivateRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
