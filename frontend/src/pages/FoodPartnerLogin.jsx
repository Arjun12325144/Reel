import React from 'react'
import '../styles/auth.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const FoodPartnerLogin = ()=>{
  const navigate = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // const response = await axios.post("http://localhost:3000/api/auth/food-partner/login",{
    //   email,
    //   password,
    // },{ withCredentials:true }) 
    const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/food-partner/login`,
  { email, password },
  { withCredentials: true }
);

      console.log(response.data);
      navigate("/create-food");
     
  }
  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-dot">F</div>
          <div>
            <h2>Partner sign in</h2>
            <p className="lead">Access your partner dashboard.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="partner@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Your password" />
          </div>

          <div className="small-row">
            <label style={{display:'flex',alignItems:'center',gap:8}}><input name="remember" type="checkbox"/> Remember</label>
            <a className="switch-link" href="#">Need help?</a>
          </div>

          <button className="btn" type="submit" style={{marginTop:12}}>Sign in</button>
        </form>

        <div className="footer-note">New partner? <a className="switch-link" href="/food-partner/register">Create account</a></div>
        <div className="footer-note" style={{marginTop:6}}>Or register as a normal user? <a className="switch-link" href="/user/register">Register as user</a></div>
      </div>
    </div>
  )
}
export default FoodPartnerLogin
