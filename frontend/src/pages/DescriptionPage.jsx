import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, Loader2, Sparkles, UserCheck } from 'lucide-react';
import axios from 'axios';

function DescriptionPage({ data, updateData }) {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!data || !data.imageUrl || !data.latitude) {
            if (!data?.imageUrl) navigate('/');
            else navigate('/detect');
        }
    }, [data, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Operational context is required for resolution.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 2. Create Social Post & Add User ID to complaint
            let anonId = localStorage.getItem('civic_anon_id');
            if (!anonId) {
                anonId = `anon_${Math.random().toString(36).substring(2, 8)}`;
                localStorage.setItem('civic_anon_id', anonId);
            }

            const payload = {
                issue: data.issue,
                confidence: data.confidence,
                description: description,
                latitude: data.latitude,
                longitude: data.longitude,
                image: data.imageUrl.split('/').slice(3).join('/'),
                user_id: anonId
            };

            await axios.post('http://localhost:8000/complaint', payload);
            const postPayload = {
                user_id: anonId,
                issue: data.issue,
                confidence: data.confidence,
                description: description,
                latitude: data.latitude,
                longitude: data.longitude,
                address: data.address || 'Location Captured',
                image: data.imageUrl.split('/').slice(3).join('/')
            };

            await axios.post('http://localhost:8000/create-post', postPayload);

            updateData({ description });
            navigate('/social');
        } catch (err) {
            console.error(err);
            setError('Network timeout or Server offline.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!data.imageUrl) return null;

    return (
        <div className="animate-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <FileText size={40} style={{ color: '#a855f7' }} />
                </div>
                <h1 className="page-title gradient-text">Finalize Record</h1>
                <p className="page-subtitle">Add tactical details to ensure high-priority resolution by city teams.</p>
            </div>

            <div className="card glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '150px', height: '150px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                            <img
                                src={data.imageUrl}
                                alt="Thumbnail"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span className={`badge ${data.issue.replace(' ', '-')}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{data.issue}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <Sparkles size={14} /> AI VERIFIED
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a855f7' }}></div>
                                    Lat: {data.latitude?.toFixed(6)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1' }}></div>
                                    Lng: {data.longitude?.toFixed(6)}
                                </div>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{data.address}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={16} color="#a855f7" /> Detailed Description
                            </label>
                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Describe the severity and impact on the local community..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem' }}
                            ></textarea>
                        </div>

                        {error && (
                            <div style={{ color: '#ef4444', marginBottom: '1.5rem', padding: '1rem 1.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.9rem', fontWeight: 600 }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', gap: '0.75rem' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Deploying...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} /> Deploy Official Report
                                    </>
                                )}
                            </button>
                            <div style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} title="Identity Shield Active">
                                <UserCheck size={24} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DescriptionPage;
