import './profile.css'
import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios"; 

const Profile = ()=>{
    const {id} = useParams()
    const [profile, setProfile] = useState(null)
    const [videos,setVideos] = useState([])
        // const tiles = Array.from({length:9}).map((_,i)=>({id:i, title:'video'}))
        useEffect(()=>{
            axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`,{withCredentials:true})
            .then(response =>{
                setProfile(response.data.foodPartner);
                setVideos(response.data.foodPartner.foodItems)
            })
        },[id]) 


        
        return (
                <div className="fp-profile">
                    <div className="fp-card">
                        <div className="fp-top-row">
                            <div className="fp-avatar"><img className="avatarImage" src="https://images.pexels.com/photos/936194/pexels-photo-936194.jpeg"/></div>
                            <div className="fp-meta">
                                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                    <div className="fp-pill">{profile?.name}</div>
                                    <div className="fp-pill" style={{opacity:0.95}}>{profile?.address}</div>
                                </div>
                            </div>
                        </div>

                        <div className="fp-stats">
                            <div className="fp-stat">
                                <div className="label">{profile?.totalMeals}</div>
                                <div className="value">43</div>
                            </div>
                            <div className="fp-stat">
                                <div className="label">{profile?.customerServed}</div>
                                <div className="value">15K</div>
                            </div>
                        </div>

                        <div className="fp-divider" />

                        <div className="fp-grid">
                            {videos.map((v) => (
                                <div key={v.id} className="profile-grid-item">
                                    {/* Placeholder tile; replace with <video> or <img> as needed */}


                                    <video
                                        className="profile-grid-video" 
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        src={v.video} muted ></video>


                                </div>
                            ))}
                        </div>
                    </div>
                </div>
        )
}

export default Profile