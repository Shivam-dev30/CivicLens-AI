import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, History, AlertCircle, RefreshCw, XCircle, Search, Filter, Mail, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/complaints');
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(`http://127.0.0.1:8000/complaint/${id}/status`, { status: newStatus });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
      case 'In Progress': return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)' };
      case 'Under Review': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'Duplicate': return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)' };
      default: return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="page-header" style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem 0.8rem', background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.2)', borderRadius: '12px', color: '#c084fc', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                    STRATEGIC OVERSIGHT
                </div>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>LIVE</span>
            </div>
            <h1 className="page-title gradient-text" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
               Command Center
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Administrative Oversight & Resolution Engine</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              <input 
                type="text" 
                placeholder="Search issues, descriptions, or IDs..." 
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '320px', paddingLeft: '3.5rem', background: 'rgba(255,255,255,0.02)', height: '56px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
                <Filter size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <select 
                    className="form-control"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ width: '200px', background: 'rgba(255,255,255,0.02)', paddingLeft: '3.5rem', height: '56px' }}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Duplicate">Duplicate</option>
                </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ShieldCheck size={14} color="#c084fc" /> <strong>Active Issues:</strong> {complaints.filter(c => c.status !== 'Resolved').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <CheckCircle2 size={14} color="#10b981" /> <strong>Resolved Today:</strong> {complaints.filter(c => c.status === 'Resolved').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
        <AnimatePresence>
          {filteredComplaints.map((c, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={c.id}
              className="card glass-panel"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img src={`http://127.0.0.1:8000/${c.image}`} alt={c.issue} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <div style={{ 
                    ...getStatusStyle(c.status),
                    padding: '0.5rem 1rem', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    border: `1px solid ${getStatusStyle(c.status).border}`,
                    background: getStatusStyle(c.status).bg,
                    backdropFilter: 'blur(10px)'
                  }}>
                    {c.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${c.issue.replace(' ', '-')}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}>{c.issue}</span>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <History size={14} /> {new Date(c.timestamp).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800 }}>ID: #{c.id}</div>
                </div>
                
                <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.5, color: '#fff', flex: 1 }}>"{c.description}"</p>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block', fontWeight: 800 }}>Resolution Action</label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => updateStatus(c.id, 'In Progress')}
                      disabled={updatingId === c.id}
                      style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <RefreshCw size={14} /> Start Fix
                    </button>
                    <button 
                      onClick={() => updateStatus(c.id, 'Resolved')}
                      disabled={updatingId === c.id}
                      style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <CheckCircle2 size={14} /> Resolve
                    </button>
                    <button 
                      onClick={() => updateStatus(c.id, 'Duplicate')}
                      disabled={updatingId === c.id}
                      style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(107, 114, 128, 0.1)', border: '1px solid rgba(107, 114, 128, 0.2)', color: '#6b7280', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <XCircle size={14} /> Duplicate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminDashboard;
