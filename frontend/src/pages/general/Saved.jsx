import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/reels.css'; // Reusing some styles
import '../../styles/home.css'; // Reusing home page styles
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Home as HomeIcon } from 'lucide-react';

const Saved = () => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRefs = useRef(new Map());
    const containerRef = useRef(null);

    const handleSave = async (foodId) => {
        try {
            // This endpoint toggles the save state
            await axios.post('http://localhost:3000/api/food/save', { foodId }, { withCredentials: true });
//              

            // Optimistically remove the video from the UI
            setSavedVideos(currentVideos => currentVideos.filter(v => v._id !== foodId));
        } catch (error) {
            console.error('Error unsaving food:', error);
        }
    };

    // Auto-play/pause videos based on visibility using IntersectionObserver
    useEffect(() => {
        if (!containerRef.current || savedVideos.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const section = entry.target;
                    const id = section.getAttribute('data-id');
                    const video = videoRefs.current.get(id);
                    if (!video) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { root: null, threshold: [0.6] }
        );

        const sections = containerRef.current.querySelectorAll('.reel');
        sections.forEach((s) => observer.observe(s));

        return () => observer.disconnect();
    }, [savedVideos]);

    useEffect(() => {
        const fetchSavedVideos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/food/saved`, { withCredentials: true });
 
// );

                // Initialize isSaved to true for all fetched videos
                const videosWithState = response.data.savedItems.map(video => ({
                    ...video,
                    isSaved: true,
                }));
                setSavedVideos(videosWithState);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch saved videos', err);
                setError('Could not load saved videos.');
                setLoading(false);
            }
        };

        fetchSavedVideos();
    }, []);

    if (loading) {
        return <div className="home-page-container"><div className="reels-container">Loading...</div></div>;
    }

    if (error) {
        return <div className="home-page-container"><div className="reels-container">{error}</div></div>;
    }

    return (
        <div className="home-page-container">
            <div className="reels-container" ref={containerRef}>
                {savedVideos.length > 0 ? savedVideos.map((v) => (
                    <section className="reel" key={v._id} data-id={String(v._id)}>
                        <video
                            className="reel-video"
                            src={v.video}
                            muted
                            loop
                            playsInline
                            autoPlay
                            ref={(el) => {
                                if (el) videoRefs.current.set(String(v._id), el);
                                else videoRefs.current.delete(String(v._id));
                            }}
                            onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                        />
                        <div className="reel-overlay">
                            <div className="reel-info">
                                <p className="reel-desc">{v.description}</p>
                                <Link to={"/food-partner/" + v.foodPartner} className="reel-visit">Visit Store</Link>
                            </div>
                            <div className="reel-actions">
                                <button className={`action-btn ${v.isSaved ? 'saved' : ''}`} onClick={() => handleSave(v._id)}>
                                    <Bookmark fill={v.isSaved ? 'currentColor' : 'none'} />
                                    <span>{v.isSaved ? 'Saved' : 'Save'}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                )) : <p className="empty-message">You have no saved videos.</p>}
            </div>
            <footer className="bottom-nav">
                <Link to="/" className="nav-item"><HomeIcon /><span>Home</span></Link>
                <Link to="/saved" className="nav-item"><Bookmark /><span>Saved</span></Link>
            </footer>
        </div>
    );
};

export default Saved
