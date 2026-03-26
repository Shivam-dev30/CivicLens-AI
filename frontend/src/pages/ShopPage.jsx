import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Gift, Star, Award, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://127.0.0.1:8000';

const rewards = [
    { id: 1, name: 'Amazon Pay ₹100', cost: 100, company: 'Amazon', icon: 'https://cdn.worldvectorlogo.com/logos/amazon-icon.svg', color: '#ff9900' },
    { id: 2, name: 'Zomato Pro ₹250', cost: 250, company: 'Zomato', icon: 'https://cdn.worldvectorlogo.com/logos/zomato-1.svg', color: '#cb202d' },
    { id: 3, name: 'Starbucks ₹500', cost: 500, company: 'Starbucks', icon: 'https://cdn.worldvectorlogo.com/logos/starbucks-coffee-logo.svg', color: '#00704a' },
    { id: 4, name: 'Nike Voucher ₹1000', cost: 1000, company: 'Nike', icon: 'https://cdn.worldvectorlogo.com/logos/nike-11.svg', color: '#000000' },
    { id: 5, name: 'Amazon Pay ₹500', cost: 500, company: 'Amazon', icon: 'https://cdn.worldvectorlogo.com/logos/amazon-icon.svg', color: '#ff9900' },
    { id: 6, name: 'Uber Credits ₹200', cost: 200, company: 'Uber', icon: 'https://cdn.worldvectorlogo.com/logos/uber-15.svg', color: '#000000' },
];

function ShopPage() {
    const { user } = useAuth();
    const [userPoints, setUserPoints] = useState(user?.points || 0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            axios.get(`${API_URL}/user/${user.username}/stats`)
                .then(res => setUserPoints(res.data.points))
                .catch(console.error);
        }
    }, [user]);

    const handleRedeem = async (reward) => {
        setSuccessMessage('');
        setErrorMessage('');
        
        if (userPoints < 100) {
            setErrorMessage("Minimum 100 points required to start redeeming.");
            return;
        }

        if (userPoints < reward.cost) {
            setErrorMessage(`Insufficient points for ${reward.name}. You need ${reward.cost - userPoints} more.`);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/redeem`, {
                user_id: user.username,
                points: reward.cost,
                item: reward.name
            });
            setUserPoints(res.data.new_balance);
            setSuccessMessage(res.data.message);
        } catch (err) {
            setErrorMessage(err.response?.data?.detail || "Redemption failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header / Wallet Section */}
            <div className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 className="page-title gradient-text">Civic Store</h1>
                    <p className="page-subtitle">Convert your social contribution into real-world rewards. (1 Point = ₹1)</p>
                </div>
                
                <div className="glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--primary)' }}>
                    <div style={{ background: 'rgba(192, 132, 252, 0.1)', padding: '1rem', borderRadius: '16px' }}>
                        <Award size={32} color="var(--primary)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Available Balance</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>₹{userPoints}</div>
                    </div>
                </div>
            </div>

            {/* Threshold Warning */}
            {userPoints < 100 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem 2rem', borderRadius: '16px', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#f59e0b' }}>
                    <AlertCircle size={24} />
                    <span style={{ fontWeight: 600 }}>Threshold Alert: You need at least ₹100 to start redeeming gift cards. Keep improving the city!</span>
                </div>
            )}

            {/* Notification Area */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981' }}>
                        <CheckCircle2 size={24} />
                        <span style={{ fontWeight: 700 }}>{successMessage}</span>
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                        <span style={{ fontWeight: 700 }}>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rewards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {rewards.map((reward, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={reward.id} 
                        className="card glass-panel" 
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s ease' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: '60px', height: '600x', padding: '0.5rem', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={reward.icon} alt={reward.company} style={{ maxWidth: '100%', maxHeight: '40px' }} />
                            </div>
                            <div style={{ background: userPoints >= reward.cost ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', color: userPoints >= reward.cost ? '#10b981' : 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800 }}>
                                COST: ₹{reward.cost}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{reward.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Digital Gift Card • Delivery within 24h</p>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <button 
                                onClick={() => handleRedeem(reward)}
                                disabled={loading || userPoints < reward.cost}
                                className={userPoints >= reward.cost ? "btn btn-primary" : "btn"}
                                style={{ 
                                    width: '100%', 
                                    padding: '1.25rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '1rem',
                                    borderRadius: '16px',
                                    background: userPoints >= reward.cost ? 'linear-gradient(135deg, #c084fc, #6366f1)' : 'rgba(255,255,255,0.05)',
                                    color: userPoints >= reward.cost ? 'white' : 'rgba(255,255,255,0.2)',
                                    cursor: userPoints >= reward.cost ? 'pointer' : 'not-allowed',
                                    border: 'none',
                                    fontWeight: 800
                                }}
                            >
                                {loading ? 'Processing...' : (userPoints >= reward.cost ? 'Redeem Voucher' : 'Not Enough Points')}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Terms */}
            <div style={{ marginTop: '5rem', padding: '3rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'white' }}>
                    <Star size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Terms of Service</span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem' }}>
                    <li>The exchange rate is fixed at 1 Civic Point = ₹1 INR.</li>
                    <li>Points are awarded exclusively for reports that reach the "Resolved" status.</li>
                    <li>A minimum wallet balance of ₹100 is required to initiate any redemption request.</li>
                    <li>Gift cards will be sent to the registered communication channel within 24 operational hours.</li>
                    <li>Once redeemed, points cannot be reversed or refunded.</li>
                </ul>
            </div>
        </div>
    );
}

export default ShopPage;
