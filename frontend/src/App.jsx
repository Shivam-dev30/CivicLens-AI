import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, Camera, List,
  Map as MapIcon, Settings, BarChart3, User, LogOut, Film, Target, Zap
} from 'lucide-react';

import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import DescriptionPage from './pages/DescriptionPage';
import FeedPage from './pages/FeedPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import PostFeed from './pages/PostFeed';
import LoginPage from './pages/LoginPage';
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ContactAdmin from './pages/ContactAdmin';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith('/login') || 
                     location.pathname === '/register' || 
                     location.pathname === '/contact-admin';

  if (!user || isAuthPage) return null;

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    ...(user.role === 'admin' 
        ? [
            { path: '/admin', label: 'Operational Hub', icon: <ShieldAlert size={20} /> },
            { path: '/verification', label: 'AI Verification', icon: <Target size={20} /> },
            { path: '/emergency', label: 'Priority Override', icon: <Zap size={20} /> }
          ] 
        : [
            { path: '/', label: 'Report Issue', icon: <Camera size={20} /> },
            { path: '/social', label: 'Community Feed', icon: <Film size={20} /> },
            { path: '/feed', label: 'Live Feed', icon: <List size={20} /> }
          ]
    ),
    { path: '/map', label: 'Strategic Map', icon: <MapIcon size={20} /> },
    { path: '/analytics', label: 'City Insights', icon: <BarChart3 size={20} /> },
    { path: '/settings', label: 'Security Panel', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <ShieldAlert size={32} color="#c084fc" />
        <span className="gradient-text">CivicLens AI</span>
      </div>

      <div className="nav-menu">
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem', paddingLeft: '1rem', fontWeight: 700 }}>
          {user.role === 'admin' ? 'Admin Panel' : 'Main Menu'}
        </label>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="user-profile-bottom">
        <div className="avatar" style={{ background: user.role === 'admin' ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'linear-gradient(135deg, #c084fc, #6366f1)' }}>
          {user.username.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.username}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {user.role === 'admin' ? 'Strategic Officer' : `${user.points} Civic Points`}
          </div>
        </div>
        <LogOut size={18} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={logout} />
      </div>
    </aside>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LoginPage />;
  if (adminOnly && user.role !== 'admin') return <DashboardPage />;
  return children;
}

function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isAuthPage = location.pathname.startsWith('/login') || 
                     location.pathname === '/register' || 
                     location.pathname === '/contact-admin';

  if (!user || isAuthPage) return null;

  const navItems = user.role === 'admin' ? [
    { path: '/dashboard', label: 'Home', icon: <LayoutDashboard size={24} /> },
    { path: '/admin', label: 'Hub', icon: <ShieldAlert size={24} /> },
    { path: '/verification', label: 'AI', icon: <Target size={24} /> },
    { path: '/emergency', label: 'Alert', icon: <Zap size={24} /> },
    { path: '/settings', label: 'Config', icon: <Settings size={24} /> },
  ] : [
    { path: '/dashboard', label: 'Home', icon: <LayoutDashboard size={24} /> },
    { path: '/social', label: 'Feed', icon: <Film size={24} /> },
    { path: '/', label: 'Report', icon: <Camera size={24} /> },
    { path: '/feed', label: 'Live', icon: <List size={24} /> },
    { path: '/map', label: 'Map', icon: <MapIcon size={24} /> },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// Fake settings page placeholder
function SettingsPage() {
  return (
    <div className="animate-up">
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">System Settings</h1>
          <p className="page-subtitle">Configure your civic platform preferences</p>
        </div>
      </div>
      <div className="card glass-panel card-body" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Settings size={40} style={{ opacity: 0.5 }} color="var(--text-secondary)" />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Configuration Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          Local admin privileges are required to modify system-level parameters and AI thresholding.
        </p>
      </div>
    </div>
  );
}

function AIVerificationPage() {
  return (
    <div className="animate-up">
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">AI Verification Terminal</h1>
          <p className="page-subtitle">Human-in-the-Loop review for low-confidence infrastructure anomalies.</p>
        </div>
      </div>
      <div className="card glass-panel card-body" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Target size={40} style={{ color: '#10b981' }} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Zero Low-Confidence Flags</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
          Model performing within nominal parameters. No incidents currently require manual verification from the "Human Oversight" protocol.
        </p>
      </div>
    </div>
  );
}

function EmergencyOverridePage() {
  return (
    <div className="animate-up">
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Priority Override</h1>
          <p className="page-subtitle">Immediate tactical escalation for critical municipal failures.</p>
        </div>
      </div>
      <div className="card glass-panel card-body" style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Zap size={40} style={{ color: '#ef4444' }} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>No Active Emergencies</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
          Strategic sectors are reporting operational stability. The emergency override system is currently in "Standby Mode."
        </p>
      </div>
    </div>
  );
}

function App() {
  const [complaintData, setComplaintData] = useState({
    imageFile: null,
    imageUrl: '',
    issue: '',
    confidence: 0,
    latitude: null,
    longitude: null,
    address: '',
    description: ''
  });

  const updateComplaintData = (data) => {
    setComplaintData(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthProvider>
      <Router>
        <AppContent 
           complaintData={complaintData} 
           updateData={updateComplaintData} 
        />
      </Router>
    </AuthProvider>
  );
}

function AppContent({ complaintData, updateData }) {
  return (
    <Routes>
      {/* Auth Routes - No Sidebar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/user" element={<UserLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/contact-admin" element={<ContactAdmin />} />

      {/* Main App Routes - Wrapped in AppLayout with Sidebar */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/" element={<HomePage updateData={updateData} />} />
              <Route path="/detect" element={<DetectionPage data={complaintData} updateData={updateData} />} />
              <Route path="/describe" element={<DescriptionPage data={complaintData} updateData={updateData} />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/social" element={<PostFeed />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/verification" element={<ProtectedRoute adminOnly={true}><AIVerificationPage /></ProtectedRoute>} />
              <Route path="/emergency" element={<ProtectedRoute adminOnly={true}><EmergencyOverridePage /></ProtectedRoute>} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <div className="mesh-bg"></div>
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

export default App;

