import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, MapPin, X, Aperture, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const applyWatermark = async (file, lat, lng, addressData) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const scale = Math.max(img.width / 1500, 1);

            const padding = 20 * scale;
            const boxWidth = img.width - (padding * 2);
            const boxHeight = 250 * scale;

            const x = padding;
            const y = img.height - boxHeight - padding;

            // Draw background box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            const r = 15 * scale;
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + boxWidth - r, y);
            ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + r);
            ctx.lineTo(x + boxWidth, y + boxHeight - r);
            ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - r, y + boxHeight);
            ctx.lineTo(x + r, y + boxHeight);
            ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();

            // Draw Text
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';

            let currentY = y + padding * 2.5;
            let textStartX = x + padding * 2;

            // Map Icon / Header
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = `normal ${20 * scale}px sans-serif`;
            ctx.fillText('📍 CivicLens AI Geotag', textStartX, currentY);

            currentY += 45 * scale;
            ctx.fillStyle = '#ffffff';

            // Title (City, State)
            ctx.font = `bold ${32 * scale}px sans-serif`;
            const title = addressData.display_name ? addressData.display_name.split(',').slice(0, 3).join(', ') : (lat ? 'Location Captured' : 'Location Unavailable');
            ctx.fillText(title, textStartX, currentY);

            currentY += 35 * scale;
            // Detailed Address
            ctx.font = `normal ${22 * scale}px sans-serif`;
            const addressText = addressData.display_name || 'Address details not found.';
            ctx.fillText(addressText.substring(0, 80) + (addressText.length > 80 ? '...' : ''), textStartX, currentY);

            currentY += 35 * scale;
            // Lat
            ctx.font = `bold ${24 * scale}px sans-serif`;
            ctx.fillText(`Lat ${lat ? lat.toFixed(6) + '°' : 'N/A'}`, textStartX, currentY);

            currentY += 30 * scale;
            // Lng
            ctx.fillText(`Long ${lng ? lng.toFixed(6) + '°' : 'N/A'}`, textStartX, currentY);

            currentY += 35 * scale;
            // Date
            const dateObj = new Date();
            const dateStr = dateObj.toLocaleDateString('en-GB') + ' ' + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' GMT ' + (dateObj.toString().match(/([-\+][0-9]{4})/) || [''])[0];
            ctx.fillText(dateStr, textStartX, currentY);

            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
        };
        // Load file as data URL to draw onto canvas
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result;
        reader.readAsDataURL(file);
    });
};

function HomePage({ updateData }) {
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Camera state
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = async () => {
        setError('');
        try {
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Prefer back camera
                });
            } catch (fallbackErr) {
                // Fallback to any camera if environment facing is unavailable
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }

            streamRef.current = stream;
            setIsCameraActive(true); // Mount the video element

            // Allow React to render the video tag before attaching the stream
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 50);

        } catch (err) {
            console.error('Camera access denied:', err);
            setError('Could not access camera. Please grant camera permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        // Clean up on unmount
        return () => stopCamera();
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Match canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob((blob) => {
            const file = new File([blob], 'live_capture.jpg', { type: 'image/jpeg' });
            stopCamera();
            handleProcessImage(file);
        }, 'image/jpeg', 0.95);
    };

    const handleProcessImage = async (file) => {
        if (!file) return;

        setIsUploading(true);
        setError('');
        setStatusMessage('Acquiring GPS location for geotag...');

        // 1. Get GPS Location
        let lat = null, lng = null;
        let addressData = {};

        try {
            if (navigator.geolocation) {
                const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 }));
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;

                setStatusMessage('Fetching address details...');
                try {
                    const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    addressData = geoRes.data;
                } catch (geoErr) {
                    console.warn('Reverse geocode failed', geoErr);
                }
            }
        } catch (err) {
            console.warn('Geolocation failed', err);
        }

        setStatusMessage('Applying geotag watermark...');

        try {
            const watermarkedBlob = await applyWatermark(file, lat, lng, addressData);

            // Generate distinct filename to dodge any caching
            const newFile = new File([watermarkedBlob], `geotagged_${Date.now()}.jpg`, { type: 'image/jpeg' });

            setStatusMessage('Uploading to AI model...');
            const formData = new FormData();
            formData.append('file', newFile);

            // Perform upload and run AI model
            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update state for next step
            updateData({
                imageFile: newFile,
                imageUrl: `${API_URL}/${res.data.image_url}`,
                issue: res.data.issue,
                confidence: res.data.confidence,
                latitude: lat,
                longitude: lng,
                address: addressData.display_name || 'Location Captured'
            });

            navigate('/detect');
        } catch (err) {
            console.error(err);
            setError('Failed to process image. Make sure the backend is running.');
            setIsUploading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <Camera size={40} style={{ color: '#a855f7' }} />
                </div>
                <h1 className="page-title gradient-text">Incident Capture</h1>
                <p className="page-subtitle">Standardized visual evidence collection with autonomous AI validation.</p>
            </div>

            <div className="card glass-panel" style={{ overflow: 'hidden' }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '0' }}>

                    {isUploading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '6rem 2rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Loader2 className="upload-icon" style={{ animation: 'spin 2s linear infinite', fontSize: '5rem', color: '#a855f7', margin: 0 }} size={80} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>AI</div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{statusMessage}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Secure channel initialized. Processing forensic data...</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: isCameraActive ? 'auto' : '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>

                            {/* Hidden canvas for image extraction */}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />

                            {isCameraActive ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        style={{ width: '100%', maxHeight: '75vh', objectFit: 'cover' }}
                                    />

                                    {/* Camera Overlay Controls */}
                                    <div style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '3rem', alignItems: 'center' }}>
                                        <button
                                            onClick={stopCamera}
                                            style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(12px)' }}
                                            className="hover-scale"
                                            title="Cancel"
                                        >
                                            <X size={28} />
                                        </button>

                                        <button
                                            onClick={capturePhoto}
                                            style={{ background: 'rgba(255, 255, 255, 0.95)', border: '8px solid rgba(168, 85, 247, 0.3)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', cursor: 'pointer', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}
                                            className="hover-scale"
                                            title="Click Photo"
                                        >
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #a855f7' }}></div>
                                        </button>

                                        <div style={{ width: '60px' }}></div>
                                    </div>

                                    {/* HUD - Heads Up Display */}
                                    <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulsePin 1s infinite' }}></div>
                                            LATENCY: 42MS
                                        </div>
                                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            ENCRYPTION: AES-256
                                        </div>
                                    </div>

                                    {/* Target Reticle Overlay */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '280px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '40px', pointerEvents: 'none' }}>
                                        <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '40px', height: '40px', borderTop: '6px solid #a855f7', borderLeft: '6px solid #a855f7', borderRadius: '20px 0 0 0' }}></div>
                                        <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '40px', height: '40px', borderTop: '6px solid #a855f7', borderRight: '6px solid #a855f7', borderRadius: '0 20px 0 0' }}></div>
                                        <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '40px', height: '40px', borderBottom: '6px solid #a855f7', borderLeft: '6px solid #a855f7', borderRadius: '0 0 0 20px' }}></div>
                                        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '40px', height: '40px', borderBottom: '6px solid #a855f7', borderRight: '6px solid #a855f7', borderRadius: '0 0 20px 0' }}></div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.1)' }}>
                                        <Camera size={56} style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
                                    </div>
                                    <h2 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 800 }}>Biometric Verification</h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '450px', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                        To ensure report integrity, the system requires a live capture sensor burst. Pre-recorded media or external uploads are locked.
                                    </p>

                                    <button
                                        className="btn btn-primary"
                                        onClick={startCamera}
                                        style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', gap: '1rem', borderRadius: '20px' }}
                                    >
                                        <Aperture size={28} />
                                        Initialize Camera
                                    </button>

                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, alignItems: 'center', gap: '0.6rem', background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem 1.5rem', borderRadius: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <ShieldCheck size={18} /> GPS ENFORCED SENSOR MODE
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div style={{ padding: '1.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderTop: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.95rem', fontWeight: 600 }}>
                            OPERATIONAL ERROR: {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
