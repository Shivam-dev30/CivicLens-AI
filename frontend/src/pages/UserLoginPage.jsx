import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowLeft, Sparkles, LogIn, ChevronRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function UserLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('The credentials provided do not match our citizen records.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Visual Branding Side */}
      <div className="auth-brand-side">
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.35 }}>
            <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, #05070a)' }}></div>
         </div>

         <Link to="/login" className="auth-link" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'auto', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
            <ArrowLeft size={18} /> BACK TO GATEWAY
         </Link>

         <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ 
              width: '56px', height: '56px', 
              background: 'rgba(99, 102, 241, 0.15)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#6366f1', marginBottom: '2.5rem' 
            }}>
                <User size={30} />
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.03em' }}>
              Citizen <br /> <span className="gradient-text">Access</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', lineHeight: 1.6, fontWeight: 500 }}>
                Securely authenticate to report infrastructure issues, earn civic influence, and contribute to your community.
            </p>
         </motion.div>

         <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', zIndex: 10, fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#6366f1" /> SECURE CITIZEN NETWORK PROTOCOL V2.4
         </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
         <div className="auth-card">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Welcome Back</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>Access your encrypted citizen profile</p>
            </motion.div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="auth-input-group">
                    <label className="auth-label">Authentication ID</label>
                    <div className="auth-input-wrapper">
                        <User className="auth-icon" size={22} />
                        <input 
                            type="text" 
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your citizen alias"
                            required
                        />
                    </div>
                </div>

                <div className="auth-input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label className="auth-label" style={{ marginBottom: 0 }}>Security Key</label>
                        <Link to="#" className="auth-link" style={{ fontSize: '0.8rem', opacity: 0.6 }}>Recovery Access?</Link>
                    </div>
                    <div className="auth-input-wrapper">
                        <Lock className="auth-icon" size={22} />
                        <input 
                            type="password" 
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type your secure password"
                            required
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          style={{ 
                            color: '#f87171', 
                            background: 'rgba(248,113,113,0.08)', 
                            border: '1px solid rgba(248,113,113,0.15)',
                            padding: '1.25rem', 
                            borderRadius: '16px', 
                            fontSize: '0.9rem', 
                            textAlign: 'center', 
                            fontWeight: 600 
                          }}
                        >
                            <ShieldAlert size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>ESTABLISHING CONNECTION...</>
                    ) : (
                      <>SIGN IN TO PORTAL <ChevronRight size={20} /></>
                    )}
                </button>
            </form>

            <div className="auth-footer">
                <p>New to CivicLens AI? <Link to="/register" className="auth-link">Initialize Account</Link></p>
            </div>
         </div>
      </div>
    </div>
  );
}

export default UserLoginPage;

