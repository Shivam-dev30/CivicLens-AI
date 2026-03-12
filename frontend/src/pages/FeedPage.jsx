import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Calendar, Loader2, AlertTriangle, FileText } from 'lucide-react';

function FeedPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://localhost:8000/complaints');
            setComplaints(res.data.complaints || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load complaints feed. Is the backend server running?');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6rem', color: 'var(--text-secondary)' }}>
                <Loader2 className="upload-icon" style={{ animation: 'spin 2s linear infinite' }} />
                <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Loading live feed...</p>
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
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
                    {complaints.map((c) => (
                        <div key={c.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-img-wrapper" style={{ height: '240px' }}>
                                <img
                                    src={`http://localhost:8000/${c.image}`}
                                    alt={c.issue}
                                    className="card-img"
                                />
                            </div>
                            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <span className={`badge ${c.issue.replace(' ', '-')}`}>{c.issue}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                                        <Calendar size={14} />
                                        {new Date(c.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <p style={{ marginBottom: '1.5rem', flex: 1, color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.6 }}>"{c.description}"</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                                    <MapPin size={16} color="hsl(var(--primary))" />
                                    Lat: {c.latitude?.toFixed(4)}, Lng: {c.longitude?.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FeedPage;
