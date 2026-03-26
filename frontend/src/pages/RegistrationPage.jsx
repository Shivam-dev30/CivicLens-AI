import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, User, Lock, ArrowLeft, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'user' })
      });
      
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.detail || 'Registration failed');
      
      setIsSuccess(true);
      setTimeout(() => navigate('/login/user'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Branding Side */}
      <div className="auth-brand-side">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.35 }}>
           <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, #05070a)' }}></div>
        </div>

        <Link to="/login/user" className="auth-link" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'auto', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
           <ArrowLeft size={18} /> BACK TO SIGN IN
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
               <ShieldAlert size={30} />
           </div>
           <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.03em' }}>
              Join the <br /> <span className="gradient-text">Initiative</span>
           </h1>
           <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', lineHeight: 1.6, fontWeight: 500 }}>
               Create your secure, anonymous digital identity and start making a measurable impact on your city's future.
           </p>
        </motion.div>

        <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', zIndex: 10, fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Sparkles size={16} color="#6366f1" /> ANONYMOUS VERIFICATION ENABLED
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card">
           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Create Identity</h2>
                      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>Register for CivicLens Network Access</p>
                  </div>

                  <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                      <div className="auth-input-group">
                          <label className="auth-label">CHOOSE CITIZEN ALIAS</label>
                          <div className="auth-input-wrapper">
                              <User className="auth-icon" size={22} />
                              <input 
                                  type="text" 
                                  className="auth-input"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="Preferred username or alias"
                                  required
                              />
                          </div>
                      </div>

                      <div className="auth-input-group">
                          <label className="auth-label">SECURITY PASSCODE</label>
                          <div className="auth-input-wrapper">
                              <Lock className="auth-icon" size={22} />
                              <input 
                                  type="password" 
                                  className="auth-input"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Minimum 6 strong characters"
                                  required
                              />
                          </div>
                      </div>

                      {error && (
                          <div style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                              {error}
                          </div>
                      )}

                      <button type="submit" className="auth-btn" disabled={isLoading}>
                          {isLoading ? (
                            <>PROVISIONING IDENTITY...</>
                          ) : (
                            <>INITIALIZE PROFILE <ChevronRight size={20} /></>
                          )}
                      </button>
                  </form>
               </motion.div>
             ) : (
               <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                  <div style={{ width: '84px', height: '84px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', margin: '0 auto 2.5rem' }}>
                      <CheckCircle size={44} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Identity Secured</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 500 }}>Your digital profile has been successfully initialized. Redirecting to access terminal...</p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="auth-footer">
              <p>Already Registered? <Link to="/login/user" className="auth-link">Secure Sign In</Link></p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
