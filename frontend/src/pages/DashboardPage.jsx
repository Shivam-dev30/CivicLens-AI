import React from 'react';
import { Layers, CheckCircle, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <TrendingUp size={12} /> LIVE UPDATES
                        </div>
                    </div>
                    <h1 className="page-title gradient-text">Command Center</h1>
                    <p className="page-subtitle">Real-time city analytics and infrastructural health monitor.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card glass-panel stat-card info">
                    <div className="stat-icon" style={{ color: '#3b82f6' }}>
                        <Layers size={24} />
                    </div>
                    <div>
                        <div className="stat-value">1,204</div>
                        <div className="stat-label">System Reports</div>
                    </div>
                </div>

                <div className="card glass-panel stat-card warning">
                    <div className="stat-icon" style={{ color: '#f59e0b' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="stat-value">245</div>
                        <div className="stat-label">Pending Issues</div>
                    </div>
                </div>

                <div className="card glass-panel stat-card success">
                    <div className="stat-icon" style={{ color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className="stat-value">8,091</div>
                        <div className="stat-label">Total Resolved</div>
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
            </div>
        </div>
    );
}

export default DashboardPage;
