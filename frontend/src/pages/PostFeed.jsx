import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Loader2, Film, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // Initialize or retrieve Anonymous User ID
        let id = localStorage.getItem('civic_anon_id');
        if (!id) {
            id = `anon_${Math.random().toString(36).substring(2, 8)}`;
            localStorage.setItem('civic_anon_id', id);
        }
        setUserId(id);

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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} color="#a855f7" />
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing with community...</p>
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
                    Visualizing city issues through the eyes of its citizens. Active as <span style={{ color: '#d8b4fe', fontWeight: 'bold' }}>{userId}</span>
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="card glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
                    <Sparkles size={48} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Reports Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Be the hero your neighborhood needs. Start by reporting a new issue.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {posts.map((post) => (
                        <PostCard key={post.post_id} post={post} currentUserId={userId} onDelete={handleDeletePost} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostFeed;
