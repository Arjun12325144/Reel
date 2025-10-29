import React from 'react'
import '../styles/auth.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const FoodPartnerRegister = ()=>{
  const navigate = useNavigate();
  const handleSubmit =async (e)=>{
      e.preventDefault();
      const name = e.target.businessName.value;
      const email =  e.target.email.value;
      const contactName=e.target.contactName.value;
      const phone =  e.target.phone.value;
      const address =  e.target.address.value;
      const password =  e.target.password.value;
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/register",{
          name,
          email,
          contactName,
          phone,
          address,
          password,
      },{ withCredentials:true })
 
      .then(response => {
        console.log(response.data);
        navigate("/create-food");
      })
      .catch(error=>{
        console.error("There was an error registering",error);
      })
  }
  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-dot">F</div>
          <div>
            <h2>Partner sign up</h2>
            <p className="lead">Create a food partner account to list your kitchen.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessName">Business name</label>
            <input id="businessName" name="businessName" type="text" placeholder="e.g. Joe's Kitchen" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Contact email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="contactName">Contact name</label>
            <input id="contactName" name="contactName" type="text" placeholder="Name of primary contact" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="e.g. +1 555 123 4567" />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" placeholder="Street, city, state, ZIP" rows={3}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a password" />
          </div>

          <button className="btn" type="submit">Create account</button>
        </form>

        <div className="footer-note">Already partner? <a className="switch-link" href="/food-partner/login">Sign in</a></div>
        <div className="footer-note" style={{marginTop:6}}>Also a user? <a className="switch-link" href="/user/register">Register as user</a></div>
      </div>
    </div>
  )
}
export default FoodPartnerRegister
