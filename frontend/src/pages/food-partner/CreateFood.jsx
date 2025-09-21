import React, { useState } from 'react'
import '../../styles/auth.css'
import './createfood.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [videoFile, setVideoFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0]
        setVideoFile(file || null)
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        } else {
            setPreviewUrl(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("name",name);
        formData.append("description",description);
        formData.append("video",videoFile)
        const response = await axios.post("http://localhost:3000/api/food",formData,{headers: { "Content-Type": "multipart/form-data" },withCredentials:true})
        console.log(response.data);
        navigate("/");
         
    }
//     const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!name || !description || !videoFile) {
//     setMessage("Please fill all fields and select a video.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("name", name);
//   formData.append("description", description);
//   formData.append("video", videoFile);

//   try {
//     setLoading(true);
//     setMessage("");

//     const response = await axios.post(
//       "http://localhost:3000/api/food",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       }
//     );

//     console.log(response.data);
//     setMessage("Food uploaded successfully");
//     setLoading(false);

//     // optional: navigate to food list page
//     // navigate("/foods");
//   } catch (err) {
//     console.error(err);
//     setMessage("Upload failed ");
//     setLoading(false);
//   }
// };


    return (
        <div className="auth-root">
            <div className="auth-card create-food-card">
                <div className="auth-header">
                    <div className="brand-dot">F</div>
                    <div>
                        <h2>Create food item</h2>
                        <p className="lead">Add a short video, name and description for the meal.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="foodName">Name of food</label>
                        <input id="foodName" name="foodName" type="text" placeholder="e.g. Butter Chicken" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" placeholder="Short description" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="video">Video (mp4, mov)</label>
                        <input id="video" name="video" type="file" accept="video/*" onChange={handleFileChange} />
                        {previewUrl && (
                            <video className="preview-video" controls src={previewUrl} />
                        )}
                    </div>

                    {message && <div style={{color:'var(--muted)', marginBottom:10, fontSize:13}}>{message}</div>}

                    <button className="btn" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Create food'}</button>
                </form>
            </div>
        </div>
    )
}

export default CreateFood