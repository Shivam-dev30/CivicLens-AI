import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, Camera, List,
  Map as MapIcon, Settings, BarChart3, User, LogOut, Film
} from 'lucide-react';

import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import DescriptionPage from './pages/DescriptionPage';
import FeedPage from './pages/FeedPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import PostFeed from './pages/PostFeed';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/', label: 'Report Issue', icon: <Camera size={20} /> },
    { path: '/social', label: 'Community Feed', icon: <Film size={20} /> },
    { path: '/feed', label: 'Live Feed', icon: <List size={20} /> },
    { path: '/map', label: 'City Map', icon: <MapIcon size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <ShieldAlert size={32} color="#c084fc" />
        <span className="gradient-text">CivicLens AI</span>
      </div>

      <div className="nav-menu">
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem', paddingLeft: '1rem', fontWeight: 700 }}>
          Main Menu
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
        <div className="avatar">AD</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Admin User</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Officer #8022</div>
        </div>
        <LogOut size={18} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
      </div>
    </aside>
  );
}

function MobileNav() {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <LayoutDashboard size={24} /> },
    { path: '/social', label: 'Feed', icon: <Film size={24} /> },
    { path: '/', label: 'Report', icon: <Camera size={24} /> },
    { path: '/feed', label: 'Stats', icon: <List size={24} /> },
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
    <Router>
      <div className="mesh-bg"></div>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<HomePage updateData={updateComplaintData} />} />
            <Route path="/detect" element={<DetectionPage data={complaintData} updateData={updateComplaintData} />} />
            <Route path="/describe" element={<DescriptionPage data={complaintData} updateData={updateComplaintData} />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/social" element={<PostFeed />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </Router>
  );
}

export default App;
