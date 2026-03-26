import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowLeft, Terminal, ShieldAlert, Fingerprint, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {
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
      const user = await login(username, password);
      if (user.role !== 'admin') {
        setError('Restricted: This portal is for official use only.');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('System verification failed: Invalid Credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Brand Side - Visual Side */}
      <div className="auth-brand-side">
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.35 }}>
            <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, #05070a)' }}></div>
         </div>
         
         <Link to="/login" className="auth-link" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'auto' }}>
            <ArrowLeft size={18} /> BACK TO GATEWAY
         </Link>

         <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative', zIndex: 10 }}
         >
            <div style={{ display: 'inline-flex', padding: '0.6rem 1.25rem', background: 'rgba(192, 132, 252, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(192, 132, 252, 0.2)', borderRadius: '24px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '2.5rem' }}>
                <Terminal size={14} style={{ marginRight: '0.6rem' }} /> SECURE ENCLAVE 01
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Officer <br /> <span style={{ color: '#c084fc' }}>Terminal</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', maxWidth: '440px', lineHeight: 1.6, fontWeight: 500 }}>
                Strategic management interface for municipal officials. Access to this sector is strictly monitored and logged.
            </p>
         </motion.div>

         <div style={{ marginTop: 'auto', display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', zIndex: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldAlert size={14} /> TRUSTED SYSTEM</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Fingerprint size={14} /> PROTECTED ENCRYPT</span>
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
                <div style={{ width: '80px', height: '80px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
                    <ShieldCheck size={40} />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Authorize Entry</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', marginTop: '0.75rem', fontWeight: 500 }}>Operational credential verification required</p>
            </motion.div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="auth-input-group">
                    <label className="auth-label">Official Identifier</label>
                    <div className="auth-input-wrapper">
                        <Fingerprint className="auth-icon" size={22} style={{ color: '#c084fc' }} />
                        <input 
                            type="text" 
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter official ID"
                            required
                            style={{ borderFocusColor: '#c084fc' }}
                        />
                    </div>
                </div>

                <div className="auth-input-group">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label className="auth-label" style={{ marginBottom: 0 }}>Security Passcode</label>
                        <Link to="/contact-admin" className="auth-link" style={{ fontSize: '0.8rem', color: '#c084fc', opacity: 0.6 }}>Reset Protocol?</Link>
                   </div>
                    <div className="auth-input-wrapper">
                        <Lock className="auth-icon" size={22} style={{ color: '#c084fc' }} />
                        <input 
                            type="password" 
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                              fontSize: '0.9rem', 
                              fontWeight: 600, 
                              background: 'rgba(248,113,113,0.08)', 
                              border: '1px solid rgba(248,113,113,0.15)',
                              padding: '1.25rem', 
                              borderRadius: '16px', 
                              textAlign: 'center' 
                            }}
                        >
                            <ShieldAlert size={18} style={{ verticalAlign: 'middle', marginRight: '0.6rem' }} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button 
                    type="submit" 
                    className="auth-btn" 
                    disabled={isLoading} 
                    style={{ background: 'linear-gradient(135deg, #c084fc, #8b5cf6)', boxShadow: '0 10px 25px -5px rgba(192, 132, 252, 0.3)' }}
                >
                    {isLoading ? 'PROTOCOL VERIFICATION...' : <>ACCESS TERMINAL <ChevronRight size={20} /></>}
                </button>
            </form>

            <p style={{ marginTop: '3.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.05em' }}>
                REAL-TIME SECURITY MONITORING ACTIVE
            </p>
         </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
