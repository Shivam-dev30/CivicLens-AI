import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowLeft, Terminal, ShieldAlert, Fingerprint } from 'lucide-react';
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
    <div style={{ height: '100vh', display: 'flex', background: '#05070a', color: 'white' }}>
      {/* Brand Side - Visual Side */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '4rem' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }}>
            <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Background" />
         </div>
         
         <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'auto', zIndex: 10 }}>
            <ArrowLeft size={18} /> BACK TO GATEWAY
         </Link>

         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative', zIndex: 10 }}
         >
            <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.2)', borderRadius: '20px', color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '2rem' }}>
                <Terminal size={14} style={{ marginRight: '0.5rem' }} /> SECURE ENCLAVE 01
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Officer <br /> Terminal</h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.6 }}>
                Strategic management interface for municipal officials. Unauthorized access is monitored & strictly prohibited.
            </p>
         </motion.div>

         <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', zIndex: 10 }}>
            <span>TRUSTED SYSTEM</span>
            <span>PROTECTED ENCRYPT</span>
         </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 0.8, background: '#080a0f', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
         <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ width: '72px', height: '72px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
                    <ShieldCheck size={36} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Authorize Entry</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Input official credentials below</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.6rem', display: 'block' }}>OFFICIAL IDENTIFIER</label>
                    <div style={{ position: 'relative' }}>
                        <Fingerprint size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                        <input 
                            type="text" 
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. admin"
                            required
                            style={{ paddingLeft: '3.5rem', height: '56px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>SECURITY PASSCODE</label>
                        <Link to="/contact-admin" style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600, textDecoration: 'none' }}>Forgot?</Link>
                   </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                        <input 
                            type="password" 
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ paddingLeft: '3.5rem', height: '56px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(248,113,113,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(248,113,113,0.2)' }}
                        >
                            <ShieldAlert size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoading} 
                    style={{ height: '56px', background: 'linear-gradient(135deg, #c084fc, #8b5cf6)', border: 'none', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em', marginTop: '1rem' }}
                >
                    {isLoading ? 'PROTOCOL VERIFICATION...' : 'ACCESS TERMINAL'}
                </button>
            </form>

            <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
                System under monitoring by CivicLens High-Level API.
            </p>
         </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
