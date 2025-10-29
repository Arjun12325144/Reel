import React from 'react'
import '../styles/auth.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
const UserRegister = ()=>{
  const navigate = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const firstName = e.target.fullName.value; 
    const email = e.target.email.value;
    const password = e.target.password.value
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/user/register`,{
        fullName : firstName,
        email,
        password
    }, 
    {
      withCredentials:true // jb tk hm withCredentials:true ko pass nhi krege to cookies ka andar token save nhi hoga
    }
  )
 

    console.log(response.data);
    navigate("/")
  }
  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-dot">U</div>
          <div>
            <h2>Create account</h2>
            <p className="lead">Sign up as a user to order delicious meals.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" type="text" placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="At least 8 characters" />
          </div>

          <button className="btn" type="submit">Create account</button>
        </form>

        <div className="footer-note">Already have an account? <a className="switch-link" href="/user/login">Sign in</a></div>
        <div className="footer-note" style={{marginTop:6}}>Also a food partner? <a className="switch-link" href="/food-partner/register">Register as partner</a></div>
      </div>
    </div>
  )
}
export default UserRegister
