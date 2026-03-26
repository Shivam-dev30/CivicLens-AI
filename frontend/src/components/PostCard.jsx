import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MapPin, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const getStatusColor = (status) => {
    switch (status) {
        case 'Resolved': return '#10b981';
        case 'In Progress': return '#8b5cf6';
        case 'Under Review': return '#3b82f6';
        case 'Duplicate': return '#6b7280';
        default: return '#f59e0b';
    }
};

const PostCard = ({ post, currentUserId, onDelete }) => {
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const isLiked = likes.includes(currentUserId);

    const handleLike = async () => {
        try {
            await axios.post(`${API_URL}/like/${post.post_id}`, { user_id: currentUserId });
            if (isLiked) {
                setLikes(likes.filter(id => id !== currentUserId));
            } else {
                setLikes([...likes, currentUserId]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(`${API_URL}/comment/${post.post_id}`, {
                user_id: currentUserId,
                text: newComment
            });
            setComments([...comments, res.data.comment]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card glass-panel animate-up" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {post.user_id.substring(5, 7).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{post.user_id}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{new Date(post.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                        <MapPin size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.address.split(',').slice(0, 3).join(',')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Image Container */}
            <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
                <img
                    src={`${API_URL}/${post.image}`}
                    alt={post.issue}
                    style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
                />
            </div>

            {/* Post Interaction */}
            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                    <button onClick={handleLike} style={{ background: 'none', border: 'none', color: isLiked ? '#ef4444' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }} className="hover-scale">
                        <Heart size={26} fill={isLiked ? '#ef4444' : 'none'} style={{ filter: isLiked ? 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' : 'none' }} />
                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>{likes.length}</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }}>
                        <MessageCircle size={26} />
                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>{comments.length}</span>
                    </button>
                    {post.user_id === currentUserId && (
                        <button onClick={() => onDelete && onDelete(post.post_id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }} className="hover-scale" title="Delete Post">
                            <Trash2 size={26} />
                        </button>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge">#{post.issue}</span>
                        <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontWeight: 'bold', background: `${getStatusColor(post.status || 'Pending')}20`, color: getStatusColor(post.status || 'Pending'), border: `1px solid ${getStatusColor(post.status || 'Pending')}40` }}>
                            {post.status || 'Pending'}
                        </span>
                    </div>
                    <p style={{ fontSize: '1.05rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.9)' }}>{post.description}</p>
                </div>

                {showComments && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comments.map((c, i) => (
                                <div key={i} style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                                    <span style={{ fontWeight: '700', color: '#a855f7', marginRight: '0.5rem' }}>{c.user_id}:</span>
                                    <span>{c.text}</span>
                                </div>
                            ))}
                            {comments.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Be the first to comment!</div>}
                        </div>

                        <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.75rem' }}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1.25rem', color: 'white', fontSize: '0.9rem' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
