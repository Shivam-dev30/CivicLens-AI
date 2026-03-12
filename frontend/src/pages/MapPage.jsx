import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Filter, Download, Zap, MapPin as MapPinIcon, Camera } from 'lucide-react';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = 'http://localhost:8000';

function MapPage() {
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({
        pothole: 0,
        garbage: 0,
        'open drain': 0,
        'broken streetlight': 0,
        other: 0
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts`);
                const fetchedPosts = res.data.posts || [];
                setPosts(fetchedPosts);

                // Calculate stats
                const s = { pothole: 0, garbage: 0, 'open drain': 0, 'broken streetlight': 0, other: 0 };
                fetchedPosts.forEach(p => {
                    const issue = p.issue.toLowerCase();
                    if (s.hasOwnProperty(issue)) s[issue]++;
                    else s.other++;
                });
                setStats(s);
            } catch (err) {
                console.error("Failed to fetch posts for map", err);
            }
        };
        fetchPosts();
    }, []);

    // Center map on the first post or a default location (e.g., Noida coordinates)
    const mapCenter = posts.length > 0 ? [posts[0].latitude, posts[0].longitude] : [28.467, 77.514];

    return (
        <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '80vh' }}>
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <MapPinIcon size={40} style={{ color: '#a855f7' }} />
                </div>
                <h1 className="page-title gradient-text">Geo-Spatial Intelligence</h1>
                <p className="page-subtitle">Real-time mapping of citizen-reported infrastructure anomalies.</p>
            </div>

            <div className="card glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 0, minHeight: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Leaflet Map */}
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <ZoomControl position="bottomright" />

                    {posts.map((post) => (
                        <Marker
                            key={post.post_id}
                            position={[post.latitude, post.longitude]}
                        >
                            <Popup maxWidth={300}>
                                <div style={{ background: '#1a1d28', color: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #a855f7' }}>
                                    <h4 style={{ color: '#a855f7', marginBottom: '5px' }}>#{post.issue}</h4>
                                    <p style={{ fontSize: '0.8rem', marginBottom: '10px' }}>{post.description}</p>
                                    <img
                                        src={`${API_URL}/${post.image}`}
                                        alt={post.issue}
                                        style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '8px' }}>📍 {post.address.split(',').slice(0, 3).join(',')}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Floating Map Controls & Legend */}
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, width: '280px' }}>
                    <div className="card glass-panel" style={{ padding: '1.5rem', background: 'rgba(13, 16, 23, 0.9)', backdropFilter: 'blur(12px)' }}>
                        <h4 style={{ marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', fontWeight: 800 }}>
                            <Zap size={20} color="#a855f7" /> SENSOR LEGEND
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.entries(stats).map(([label, count]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', fontWeight: 600 }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: label === 'pothole' ? '#ef4444' : label === 'garbage' ? '#f59e0b' : '#3b82f6', boxShadow: `0 0 10px ${label === 'pothole' ? '#ef4444' : label === 'garbage' ? '#f59e0b' : '#3b82f6'}` }} />
                                        {label}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Banner */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 10, display: 'flex', gap: '1rem' }}>
                    <div className="card glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{posts.length} ACTIVE SENSORS</span>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
                .leaflet-popup-tip { background: #1a1d28 !important; border: 1px solid #a855f7; }
                .leaflet-container { font-family: 'Outfit', sans-serif !important; }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
}

export default MapPage;
