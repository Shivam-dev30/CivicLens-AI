import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, MapPin, CheckCircle, Loader2, Sparkles, Navigation } from 'lucide-react';

function DetectionPage({ data, updateData }) {
    const navigate = useNavigate();
    const [locationStatus, setLocationStatus] = useState('pending');

    useEffect(() => {
        if (!data || !data.imageUrl) {
            navigate('/');
        }
    }, [data, navigate]);

    const getLocation = () => {
        setLocationStatus('acquiring');
        if (!navigator.geolocation) {
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateData({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setLocationStatus('success');
            },
            (error) => {
                console.error(error);
                setLocationStatus('error');
            }
        );
    };

    const handleNext = () => {
        if (locationStatus !== 'success') {
            alert("Please allow location access to continue.");
            return;
        }
        navigate('/describe');
    };

    if (!data.imageUrl) return null;

    return (
        <div className="animate-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <Target size={40} style={{ color: '#10b981' }} />
                </div>
                <h1 className="page-title gradient-text">Analyze Success</h1>
                <p className="page-subtitle">AI has processed the sensor data and localized the infrastructure anomaly.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '100%', minHeight: '350px' }}>
                        <img src={data.imageUrl} alt="Detection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 40%)' }}></div>
                        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                            <span className={`badge ${data.issue.replace(' ', '-')}`} style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}>{data.issue}</span>
                        </div>
                    </div>
                </div>

                <div className="card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <Sparkles size={24} color="#a855f7" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Insights</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence Level</div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{(data.confidence * 100).toFixed(1)}%</div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden' }}>
                                    <div style={{ width: `${data.confidence * 100}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signal Strength</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    HD Visual
                                    <div style={{ display: 'flex', gap: '3px' }}>
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: '4px', height: `${i * 4}px`, background: i < 5 ? '#a855f7' : 'rgba(255,255,255,0.1)', borderRadius: '1px' }}></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        {locationStatus === 'pending' && (
                            <button className="btn btn-secondary" onClick={getLocation} style={{ width: '100%', gap: '1rem', padding: '1.25rem' }}>
                                <Navigation size={20} /> Secure GPS Lock
                            </button>
                        )}
                        {locationStatus === 'acquiring' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)', padding: '1.25rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                <Loader2 className="animate-spin" size={20} />
                                Synchronizing coordinates...
                            </div>
                        )}
                        {locationStatus === 'success' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <CheckCircle size={28} />
                                <div>
                                    <p style={{ fontWeight: '800', fontSize: '1rem' }}>Coordinates Verified</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Relativity Matrix: {data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={locationStatus !== 'success'}
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                    >
                        Proceed to Deployment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetectionPage;
