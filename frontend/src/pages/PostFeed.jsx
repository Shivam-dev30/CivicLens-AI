import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Loader2, Film, Sparkles } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

const API_URL = 'http://127.0.0.1:8000';

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    const [stats, setStats] = useState({ points: 0, badges: [] });

    useEffect(() => {
        // Initialize or retrieve Anonymous User ID
        let id = localStorage.getItem('civic_anon_id');
        if (!id) {
            id = `anon_${Math.random().toString(36).substring(2, 8)}`;
            localStorage.setItem('civic_anon_id', id);
        }
        setUserId(id);
        
        axios.get(`${API_URL}/user/${id}/stats`)
             .then(res => setStats(res.data))
             .catch(console.error);

        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API_URL}/posts`);
            setPosts(res.data.posts || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                    <Skeleton circle width={80} height={80} style={{ marginBottom: '1.5rem' }} baseColor="rgba(255,255,255,0.03)" highlightColor="rgba(255,255,255,0.08)" />
                    <Skeleton width={200} height={32} style={{ marginBottom: '0.5rem' }} baseColor="rgba(255,255,255,0.03)" highlightColor="rgba(255,255,255,0.08)" />
                    <Skeleton width={300} height={20} baseColor="rgba(255,255,255,0.03)" highlightColor="rgba(255,255,255,0.08)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <SkeletonTheme baseColor="rgba(255,255,255,0.03)" highlightColor="rgba(255,255,255,0.08)">
                        {[1, 2].map(n => (
                            <div key={n} className="card glass-panel" style={{ padding: 0 }}>
                                <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                                    <Skeleton width={40} height={40} borderRadius={12} />
                                    <div style={{ flex: 1 }}>
                                        <Skeleton width={120} />
                                        <Skeleton width={80} style={{ marginTop: '0.25rem' }} />
                                    </div>
                                </div>
                                <Skeleton height={300} borderRadius={0} />
                                <div style={{ padding: '1.25rem' }}>
                                    <Skeleton width={150} height={30} style={{ marginBottom: '1rem' }} />
                                    <Skeleton count={2} />
                                </div>
                            </div>
                        ))}
                    </SkeletonTheme>
                </div>
            </div>
        );
    }

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${API_URL}/post/${postId}?user_id=${userId}`);
            setPosts(posts.filter(p => p.post_id !== postId));
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <Film size={40} style={{ color: '#a855f7' }} />
                </div>
                <h1 className="page-title gradient-text">Civic Reels</h1>
                <p className="page-subtitle" style={{ maxWidth: '400px' }}>
                    Visualizing city issues through the eyes of its citizens.
                </p>
                {userId && (
                    <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem' }}>Active as <span style={{ color: '#d8b4fe', fontWeight: 'bold' }}>{userId}</span></span>
                        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Sparkles size={14}/> {stats.points || 0} Civic Points</span>
                    </div>
                )}
            </div>

            {posts.length === 0 ? (
                <div className="card glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
                    <Sparkles size={48} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Reports Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Be the hero your neighborhood needs. Start by reporting a new issue.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {posts.map((post, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={post.post_id}>
                            <PostCard post={post} currentUserId={userId} onDelete={handleDeletePost} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostFeed;
