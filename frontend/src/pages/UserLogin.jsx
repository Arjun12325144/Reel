import React from 'react'
import '../styles/auth.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const UserLogin = ()=>{
  const navigate = useNavigate();
  const handleSubmit =async (e)=>{

    e.preventDefault();
    const email  = e.target.email.value;
    const password = e.target.password.value;
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/user/login`,{
      email,
      password,
    },{
      withCredentials:true
    })
 
    console.log(response.data)
    navigate("/")
  }
  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-dot">U</div>
          <div>
            <h2>Welcome back</h2>
            <p className="lead">Sign in to continue to your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Your password" />
          </div>

          <div className="small-row">
            <label style={{display:'flex',alignItems:'center',gap:8}}><input name="remember" type="checkbox"/> Remember</label>
            <a className="switch-link" href="#">Forgot?</a>
          </div>

          <button className="btn" type="submit" style={{marginTop:12}}>Sign in</button>
        </form>

        <div className="footer-note">Don't have an account? <a className="switch-link" href="/user/register">Create one</a></div>
        <div className="footer-note" style={{marginTop:6}}>Or register as a food partner? <a className="switch-link" href="/food-partner/register">Register as partner</a></div>
      </div>
    </div>
  )
}
export default UserLogin
