import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Calendar, Loader2, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

const getStatusColor = (status) => {
    switch (status) {
        case 'Resolved': return '#10b981';
        case 'In Progress': return '#8b5cf6';
        case 'Under Review': return '#3b82f6';
        case 'Duplicate': return '#6b7280';
        default: return '#f59e0b'; // Pending
    }
};
function FeedPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        let id = localStorage.getItem('civic_anon_id');
        if (id) {
            setUserId(id);
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/complaints');
            setComplaints(res.data.complaints || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load complaints feed. Is the backend server running?');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComplaint = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/complaint/${id}?user_id=${userId}`);
            setComplaints(complaints.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete complaint:', err);
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
                <div className="page-header" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 className="page-title gradient-text">Live Civic Feed</h1>
                        <p className="page-subtitle">Real-time stream of citizen-reported infrastructure issues.</p>
                    </div>
                </div>
                <div className="feed-grid">
                    <SkeletonTheme baseColor="rgba(255,255,255,0.03)" highlightColor="rgba(255,255,255,0.08)">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                                <Skeleton height={240} style={{ borderRadius: '24px 24px 0 0' }} />
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <Skeleton width={80} height={24} />
                                        <Skeleton width={100} height={24} />
                                    </div>
                                    <Skeleton count={2} style={{ marginBottom: '1.5rem' }} />
                                    <div style={{ marginTop: 'auto', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                        <Skeleton width={150} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </SkeletonTheme>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                <AlertTriangle size={64} color="hsl(var(--danger))" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <h2 style={{ color: 'hsl(var(--danger))', marginBottom: '1rem' }}>Connection Error</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title gradient-text">Live Civic Feed</h1>
                    <p className="page-subtitle">Real-time stream of citizen-reported infrastructure issues.</p>
                </div>
            </div>

            {complaints.length === 0 ? (
                <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <FileText size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>No issues reported yet</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Be the first to help keep your city clean and safe.</p>
                </div>
            ) : (
                <div className="feed-grid">
                    {complaints.map((c, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            key={c.id} 
                            className="card glass-panel" 
                            style={{ display: 'flex', flexDirection: 'column', padding: 0 }}
                        >
                            <div className="card-img-wrapper">
                                <img
                                    src={`http://127.0.0.1:8000/${c.image}`}
                                    alt={c.issue}
                                    className="card-img"
                                />
                                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <span 
                                        style={{ 
                                            fontSize: '0.7rem', 
                                            padding: '0.4rem 0.8rem', 
                                            borderRadius: '50px', 
                                            fontWeight: 800, 
                                            background: 'rgba(0,0,0,0.6)', 
                                            backdropFilter: 'blur(10px)',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        ID: #{c.id}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', display: 'flex', gap: '0.6rem' }}>
                                    <span className={`badge ${c.issue.toLowerCase().replace(/\s+/g, '-')}`}>{c.issue}</span>
                                </div>
                            </div>
                            
                            <div className="card-body" style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '50px', fontWeight: 800, color: getStatusColor(c.status || 'Pending'), background: `${getStatusColor(c.status || 'Pending')}15`, border: `1px solid ${getStatusColor(c.status || 'Pending')}30` }}>
                                        {c.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                        <Calendar size={14} />
                                        {new Date(c.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <p style={{ marginBottom: '1.5rem', flex: 1, color: '#fff', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>"{c.description}"</p>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                                        <MapPin size={18} style={{ color: 'var(--primary)', marginTop: '0.1rem' }} />
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Reported Location</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{c.address || 'Location data available in coordinates.'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                                        LAT: {c.latitude?.toFixed(6)} / LNG: {c.longitude?.toFixed(6)}
                                    </div>
                                    
                                    {(!c.user_id || c.user_id === userId) && (
                                        <button 
                                            onClick={() => handleDeleteComplaint(c.id)} 
                                            className="hover-scale"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'all 0.2s' }} 
                                            title="Delete Complaint"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FeedPage;
