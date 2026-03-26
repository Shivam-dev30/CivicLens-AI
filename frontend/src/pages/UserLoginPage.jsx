import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowLeft, Sparkles, LogIn, ChevronRight } from 'lucide-react';
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
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.25 }}>
            <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
         </div>

         <Link to="/login" className="auth-link" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'auto' }}>
            <ArrowLeft size={18} /> BACK TO GATEWAY
         </Link>

         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '2rem' }}>
                <User size={28} />
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Citizen <br /> Access</h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.6 }}>
                Sign in to report infrastructure issues, earn civic points, and track your contribution to the city.
            </p>
         </motion.div>

         <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', zIndex: 10 }}>
            <Sparkles size={14} style={{ marginRight: '0.5rem' }} color="#6366f1" /> SECURE CITIZEN NETWORK v2.4
         </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
         <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome Back</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Log in to your citizen profile</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="auth-input-group">
                    <label className="auth-label">CITIZEN USERNAME</label>
                    <div className="auth-input-wrapper">
                        <User className="auth-icon" size={20} />
                        <input 
                            type="text" 
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your registered username"
                            required
                        />
                    </div>
                </div>

                <div className="auth-input-group">
                    <label className="auth-label">PASSWORD</label>
                    <div className="auth-input-wrapper">
                        <Lock className="auth-icon" size={20} />
                        <input 
                            type="password" 
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your secure password"
                            required
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'ESTABLISHING CONNECTION...' : 'SIGN IN TO PORTAL'}
                </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '2.5rem' }}>
                <p>New to CivicLens? <Link to="/register" className="auth-link">Initialize Account <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></Link></p>
            </div>
         </div>
      </div>
    </div>
  );
}

export default UserLoginPage;
