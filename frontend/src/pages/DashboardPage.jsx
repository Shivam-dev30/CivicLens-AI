import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle, AlertTriangle, Users, TrendingUp, Award, Zap, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const data = [
    { name: 'Mon', active: 40, resolved: 24 },
    { name: 'Tue', active: 30, resolved: 13 },
    { name: 'Wed', active: 20, resolved: 98 },
    { name: 'Thu', active: 27, resolved: 39 },
    { name: 'Fri', active: 18, resolved: 48 },
    { name: 'Sat', active: 23, resolved: 38 },
    { name: 'Sun', active: 34, resolved: 43 },
];

function DashboardPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/complaints')
            .then(res => {
                const myReports = (res.data.complaints || []).filter(c => c.user_id === user?.username);
                setReports(myReports.slice(0, 5));
            })
            .catch(console.error);
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Zap size={12} fill="#a855f7" /> PERSONAL IMPACT SCORE
                        </div>
                    </div>
                    <h1 className="page-title gradient-text">Welcome back, {user?.username}</h1>
                    <p className="page-subtitle">Your local hero dashboard and civic contribution statistics.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card glass-panel stat-card info" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}>
                    <div className="stat-icon" style={{ color: '#3b82f6' }}>
                        <Star size={24} fill="#3b82f6" />
                    </div>
                    <div>
                        <div className="stat-value">{user?.points || 0}</div>
                        <div className="stat-label">Civic Points</div>
                    </div>
                </div>

                <div className="card glass-panel stat-card success" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
                    <div className="stat-icon" style={{ color: '#10b981' }}>
                        <Award size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{user?.badges?.length || 0}</div>
                        <div className="stat-label">Earned Badges</div>
                    </div>
                </div>

                <div className="card glass-panel stat-card">
                    <div className="stat-icon" style={{ color: '#a855f7' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="stat-value">14.2k</div>
                        <div className="stat-label">Active Citizens</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="card glass-panel" style={{ padding: '2rem', minHeight: '450px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>Resolution vs Reports Trend</h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }}></div> Active
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}></div> Resolved
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                <YAxis stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(13, 16, 23, 0.95)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '0.9rem' }}
                                />
                                <Area type="monotone" dataKey="active" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#1a1d28' }} />
                                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#1a1d28' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, marginBottom: '2rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reports.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No recent reports found.</p>
                        ) : (
                            reports.map(r => (
                                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <img src={`http://127.0.0.1:8000/${r.image}`} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.issue}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(r.timestamp).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: r.status === 'Resolved' ? '#10b981' : '#f59e0b', background: r.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '6px', fontWeight: 800 }}>
                                        {r.status || 'Pending'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
