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
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.25 }}>
           <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
        </div>

        <Link to="/login/user" className="auth-link" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'auto' }}>
           <ArrowLeft size={18} /> BACK TO SIGN IN
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 10 }}>
           <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '2rem' }}>
               <ShieldAlert size={28} />
           </div>
           <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Join the <br /> Initiative</h1>
           <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.6 }}>
               Create your anonymous digital identity and start making a measurable impact on your city today.
           </p>
        </motion.div>

        <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', zIndex: 10 }}>
           <Sparkles size={14} style={{ marginRight: '0.5rem' }} color="#6366f1" /> ANONYMOUS VERIFICATION ENABLED
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card">
           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Create Identity</h2>
                      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Register for CivicLens Network</p>
                  </div>

                  <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="auth-input-group">
                          <label className="auth-label">CHOOSE USERNAME</label>
                          <div className="auth-input-wrapper">
                              <User className="auth-icon" size={20} />
                              <input 
                                  type="text" 
                                  className="auth-input"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="Preferred username/alias"
                                  required
                              />
                          </div>
                      </div>

                      <div className="auth-input-group">
                          <label className="auth-label">SECURE PASSWORD</label>
                          <div className="auth-input-wrapper">
                              <Lock className="auth-icon" size={20} />
                              <input 
                                  type="password" 
                                  className="auth-input"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="At least 6 characters"
                                  required
                              />
                          </div>
                      </div>

                      {error && (
                          <div style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'center' }}>
                              {error}
                          </div>
                      )}

                      <button type="submit" className="auth-btn" disabled={isLoading}>
                          {isLoading ? 'PROCESSING REGISTRATION...' : 'INITIALIZE CITIZEN PROFILE'}
                      </button>
                  </form>
               </motion.div>
             ) : (
               <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', margin: '0 auto 2rem' }}>
                      <CheckCircle size={40} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Success!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>Your secure identity has been created. Redirecting to login...</p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="auth-footer" style={{ marginTop: '3rem' }}>
              <p>Existing User? <Link to="/login/user" className="auth-link">Sign In <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></Link></p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
