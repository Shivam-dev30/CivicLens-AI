import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, MapPin, ArrowLeft, Send, Github, Linkedin, Briefcase } from 'lucide-react';

function ContactAdmin() {
  const navigate = useNavigate();

  return (
    <div className="login-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px', background: '#0b0e14' }}>
      <button 
        onClick={() => navigate('/login/admin')}
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> BACK TO TERMINAL
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card glass-panel"
        style={{ width: '100%', maxWidth: '600px', padding: '4rem', border: '1px solid rgba(192, 132, 252, 0.2)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
            <ShieldCheck size={120} />
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }} className="gradient-text">Credential Inquiry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>Admin records are restricted. If you are a city official or system architect, please contact the lead administrator to request a Government ID and Secure Terminal PIN.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(192, 132, 252, 0.05)', borderRadius: '16px', border: '1px solid rgba(192, 132, 252, 0.1)' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Mail size={24} />
            </div>
            <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>EMAIL ENQUIRY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>student18171@gmail.com</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <Phone size={24} />
            </div>
            <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>OFFICE HELPLINE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>+91 (800) CIVIC-AI</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <MapPin size={24} />
            </div>
            <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>HQ LOCATION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Innovation Hub, Sector 42</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#c084fc'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}><Github size={20} /></a>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#c084fc'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}><Linkedin size={20} /></a>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#c084fc'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}><Briefcase size={20} /></a>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactAdmin;
