import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const issueData = [
    { name: 'Potholes', value: 400 },
    { name: 'Garbage', value: 300 },
    { name: 'Drains', value: 300 },
    { name: 'Streetlights', value: 200 },
];

const COLORS = ['#fbbf24', '#34d399', '#f87171', '#60a5fa'];

const timeData = [
    { time: '00:00', reports: 10 },
    { time: '04:00', reports: 5 },
    { time: '08:00', reports: 45 },
    { time: '12:00', reports: 70 },
    { time: '16:00', reports: 60 },
    { time: '20:00', reports: 30 },
];

const resolutionData = [
    { zone: 'Zone North', timeDays: 2.1 },
    { zone: 'Zone South', timeDays: 3.4 },
    { zone: 'Zone East', timeDays: 1.8 },
    { zone: 'Zone West', timeDays: 4.2 },
];

function AnalyticsPage() {
    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title gradient-text">Deep Analytics</h1>
                    <p className="page-subtitle">AI-driven insights into city infrastructure performance</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card glass-panel chart-card" style={{ gridColumn: 'span 1' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Issue Distribution</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {issueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,17,21,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                        {issueData.map((item, i) => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[i] }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card glass-panel chart-card" style={{ gridColumn: 'span 1' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Average Resolution Time</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resolutionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="zone" stroke="rgba(255,255,255,0.3)" />
                                <YAxis stroke="rgba(255,255,255,0.3)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,17,21,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="timeDays" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card glass-panel chart-card">
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Reporting Volume by Time of Day</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeData}>
                                <defs>
                                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" />
                                <YAxis stroke="rgba(255,255,255,0.3)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,17,21,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                                <Area type="monotone" dataKey="reports" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTime)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
