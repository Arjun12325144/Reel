import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/reels.css'
import '../../styles/home.css'
import { Heart, MessageCircle, Bookmark, Home as HomeIcon, Send } from 'lucide-react';
import axios from 'axios'

const COMMENT_LOAD_COUNT = 5;

const Home = () => {
    const [videos, setVideos] = useState([])
    const videoRefs = useRef(new Map())
    const containerRef = useRef(null)
    const [commentVisible,setCommentVisible] = useState({})
    const navigate = useNavigate();
    const [comments,setComments] = useState({})
    const handleLike = async (foodId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId }, { withCredentials: true });
           

            // Optimistically update UI or refetch data
            setVideos(videos.map(v => v._id === foodId ? { ...v, isLiked: !v.isLiked, likeCount: v.isLiked ? v.likeCount - 1 : v.likeCount + 1 } : v));
        } catch (error) {
            console.error('Error liking food:', error);
        }
    };
    const [commentText,setCommentText] = useState("");
    // const handleCommentToggle = (foodId)=>{
    //     setCommentVisible(prevState => ({
    //         ...prevState,
    //         [foodId]: !prevState[foodId]
    //     }))
    // }
    const handleCommentToggle =  async(foodId) =>{
        //if comments are not loaded fetch them
        if(!comments[foodId]){
            try{
                const response = await axios.get(`http://localhost:3000/api/food/comment/${foodId}`,{withCredentials:true});
                

                setComments(prevComments =>({
                    ...prevComments,
                    [foodId]:{
                        data:response.data.comments,
                        visibleCount:Math.min(COMMENT_LOAD_COUNT, response.data.comments.length)
                    },
                }));
            }catch(err){
                console.error(err);
            }
        }
        setCommentVisible(prevCommentVisible =>({
            ...prevCommentVisible,
            [foodId]:!prevCommentVisible[foodId],
        }))
         
    }
     const showMoreComments = (foodId) => {
        setComments(prevComments => {
            return{...prevComments,[foodId]:{...prevComments[foodId],visibleCount:Math.min((prevComments[foodId]?.visibleCount || 0) + COMMENT_LOAD_COUNT,prevComments[foodId]?.data?.length || 0)}}})
    }
    const handleCommentSubmit = async(foodId)=>{
        try{
            await axios.post('http://localhost:3000/api/food/comment',{foodId,text:commentText},{withCredentials:true});
 
            setVideos(videos.map(v=>{
                if(v._id === foodId){
                    return {...v, commentCount:(v.commentCount || 0)+1};
                }
                return v;
            }));
            setCommentText("")
        }catch(err){
            console.error(err);
        }
    }

    const handleSave = async (foodId) => {
        try {
            await axios.post('http://localhost:3000/api/food/save', { foodId }, { withCredentials: true });
 
            // Optimistically update UI or refetch data
            setVideos(videos.map(v => v._id === foodId ? { ...v, isSaved: !v.isSaved } : v));
        } catch (error) {
            console.error('Error saving food:', error);
        }
    };
    // Auto-play/pause videos based on visibility using IntersectionObserver
    useEffect(() => {
        if (!containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const section = entry.target
                    const id = section.getAttribute('data-id')
                    const video = videoRefs.current.get(id)
                    if (!video) return

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        // try to play; ignore errors
                        video.play().catch(() => {})
                    } else {
                        video.pause()
                    }
                })
            },
            { root: null, threshold: [0.6] }
        )

        const sections = containerRef.current.querySelectorAll('.reel')
        sections.forEach((s) => observer.observe(s))

        return () => observer.disconnect()
    }, [videos])

    // Fetch videos from backend API (example) and replace demo data
    useEffect(() => {
        axios.get('http://localhost:3000/api/food',{ withCredentials:true }) 

            .then((response) => {
                    console.log(response.data);
                    const videosWithState = response.data.foodItems.map(video => ({
                        ...video,
                        isLiked: video.isLiked || false, // You need to add this logic to your backend
                        isSaved: video.isSaved || false, // You need to add this logic to your backend
                    }));
                    setVideos(videosWithState);
                    // setVideos(response.data.foodItems)
                
            })
            .catch((err) => {
                // If the error is 401 (Unauthorized), redirect to login
                if (err.response && err.response.status === 401) {
                    navigate('/user/login');
                } else {
                    console.error('Failed to fetch videos', err);
                }
            })
    }, [])

    const handleScreenClick = (e, foodId) => {
        // Close the comment section if the click is outside the comment section
        if (commentVisible[foodId]) {
            handleCommentToggle(foodId);
        }
    };

    return (
        // <div className="reels-container" ref={containerRef}>
        //     {/* <h1>hello</h1> */}
        //     {videos.map((v) => (
        //         <section className="reel" key={v._id} data-id={String(v._id)}>
        //             <video
        //                 className="reel-video"
        //                 src={v.video}
        //                 muted
        //                 loop
        //                 playsInline
        //                 autoPlay
        //                 ref={(el) => {
        //                     if (el) videoRefs.current.set(String(v._id), el)
        //                     else videoRefs.current.delete(String(v._id))
        //                 }}
        //             />
        
        
            
        <div className="home-page-container">
        <div className="reels-container" ref={containerRef}>
                {videos.map((v) => (
                    <section className="reel" key={v._id} data-id={String(v._id)}>
                        <video
                            className="reel-video"
                            src={v.video}
                            muted
                            loop
                            playsInline
                            autoPlay
                            ref={(el) => {
                                if (el) videoRefs.current.set(String(v._id), el)
                                else videoRefs.current.delete(String(v._id))
                            }}
                            onClick={(e) => {handleScreenClick(e, v._id); e.target.paused ? e.target.play() : e.target.pause()}}
                        />
                        <div className="reel-overlay">
                            <div className="reel-info">
                                <p className="reel-desc">{v.description}</p>
                                <Link to={"/food-partner/" + v.foodPartner} className="reel-visit">Visit Store</Link>
                            </div>
                            <div className="reel-actions">
                                <button className={`action-btn ${v.isLiked ? 'liked' : ''}`} onClick={() => handleLike(v._id)}>
                                    <Heart fill={v.isLiked ? 'currentColor' : 'none'} />
                                    <span>{v.likeCount || 0}</span>
                                </button>
                                <button className="action-btn" onClick={()=> handleCommentToggle(v._id)}>
                                    <MessageCircle />
                                    <span>{v.commentCount || 0} Comment</span>
                                </button>
                                {commentVisible[v._id] && (
                                    <div className='comment-section active'>
                                         <div className="comment-input-area">
                                            <textarea rows='2' placeholder='Add a comment...' value={commentText} onChange={(e)=>setCommentText(e.target.value)} />
                                             <button className='submit-comment' onClick={()=>handleCommentSubmit(v._id)}>
                                            <Send/>
                                            </button>
                                         </div>

                                        

                                        {comments[v._id]?.data?.slice(0, comments[v._id]?.visibleCount).map(comment => (
                                        <div key={comment._id} className="comment">
                                            <span className="comment-author">{comment.user.fullName}:</span>
                                            <p className="comment-text">{comment.text}</p>
                                        </div>
                                    ))}
                                    {comments[v._id]?.visibleCount < comments[v._id]?.data?.length && (
                                        <button className="show-more-comments" onClick={() => showMoreComments(v._id)}>
                                            Show More Comments
                                        </button>
                                    )}
                                    </div>
                                )}
                                <button className={`action-btn ${v.isSaved ? 'saved' : ''}`} onClick={() => handleSave(v._id)}>
                                    <Bookmark fill={v.isSaved ? 'currentColor' : 'none'} />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
            <footer className="bottom-nav">
                <Link to="/" className="nav-item"><HomeIcon /><span>Home</span></Link>
                <Link to="/saved" className="nav-item"><Bookmark /><span>Saved</span></Link>
            </footer>
            </div>
        
                     
    )
}

export default Home