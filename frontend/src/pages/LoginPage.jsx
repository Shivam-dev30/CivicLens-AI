import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, User, ShieldCheck, ArrowRight, Sparkles, Globe } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-gateway" style={{ height: '100vh', display: 'flex', background: '#080a0f', overflow: 'hidden' }}>
      {/* Brand Side (Visible on Large Screens) */}
      <div className="brand-side" style={{ flex: 1.2, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem', background: '#05070a', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4, pointerEvents: 'none' }}>
            <img src="/assets/login_bg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Civil Intelligence" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, transparent, #080a0f)' }}></div>
        </div>

        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 5 }}
        >
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #c084fc, #6366f1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <ShieldAlert size={34} color="white" />
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
            CivicLens <span className="gradient-text">AI</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
            The next generation of urban intelligence and infrastructure reporting. Autonomous, Decentralized, Efficient.
          </p>

          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Globe size={16} color="#c084fc" /> GLOBAL NETWORK 2.0
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Sparkles size={16} color="#6366f1" /> SMART CITY PROTOCOL
            </div>
          </div>
        </motion.div>
      </div>

      {/* Choice Side */}
      <div className="choice-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080a0f', padding: '3rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Identity Portal</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please select your access level to enter the secure environment.</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
             {/* Portal Cards refined */}
             <motion.div
                whileHover={{ x: 12, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                onClick={() => navigate('/login/user')}
                className="glass-panel"
                style={{ padding: '2.8rem', cursor: 'pointer', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '2rem', transition: 'border-color 0.3s ease' }}
             >
                <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', flexShrink: 0, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.1)' }}>
                  <User size={32} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.01em' }}>Citizen Portal</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Report infrastructure & earn rewards.</div>
                </div>
                <ArrowRight size={22} color="var(--text-secondary)" />
             </motion.div>

             <motion.div
                whileHover={{ x: 12, background: 'rgba(192, 132, 252, 0.05)', borderColor: 'rgba(192, 132, 252, 0.4)' }}
                onClick={() => navigate('/login/admin')}
                className="glass-panel"
                style={{ padding: '2.8rem', cursor: 'pointer', borderRadius: '28px', border: '1px solid rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(192, 132, 252, 0.02)', transition: 'border-color 0.3s ease' }}
             >
                <div style={{ width: '64px', height: '64px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', flexShrink: 0, boxShadow: '0 8px 16px rgba(192, 132, 252, 0.1)' }}>
                  <ShieldCheck size={32} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.01em' }}>Officer Terminal</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Official strategic management.</div>
                </div>
                <ArrowRight size={22} color="var(--text-secondary)" />
             </motion.div>
          </div>

          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
             <div style={{ display: 'inline-flex', padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={14} color="#c084fc" /> V2.4 CORE PROTOCOL ACTIVE
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
