import { Eye, EyeOff, LogIn, Mail, User, Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { BUTTONCLASSES, INPUTWRAPPER } from '../assets/dummy';
import 'react-toastify/dist/ReactToastify.css';

// Import the custom CSS file
import './Login.css';

const INITIAL_FORM = { email: "", password: "" }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()
  const url = "http://localhost:4000"

  // REMOVED/COMMENTED OUT: Session Restoration Logic
  // We are commenting out this block so the page does NOT automatically redirect
  // if a token exists. This is necessary for debugging the login form itself.
  /*
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success("Success restored. Redirecting ...")
            navigate('/')
          } else {
            localStorage.clear()
          }
        } catch {
          localStorage.clear()
        }
      })() 
    }
  }, []) 
  */

  // Add a placeholder useEffect to avoid warnings if axios/url were only used above
  useEffect(() => {
      // You can keep this empty or add other necessary mount logic here.
      // For now, we leave it empty to ensure the login page stays put.
  }, []); 
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rememberMe) {
      toast.error('Yours Must enable "Remember Me" to login.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData)
      if (!data.token) throw new Error(data.message || "Login Failed")

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)
      setFormData(INITIAL_FORM)
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
      toast.success("Login Successfull ! Redirecting ...")
      // This is the intended redirect that happens ONLY after successful login
      setTimeout(() => navigate('/'), 1000) 
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  const FIELDS = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock, isPassword: true },
  ]

  return (
    // Applied the main page background class
    <div className='login-page-container'> 
      
      {/* Login Card with custom border class */}
      <div className='max-w-md w-full login-card-border'>
        
        {/* Inner wrapper for content and padding */}
        <div className='login-card-content p-8'>

          <ToastContainer position='top-center' autoClose={3000} hideProgressBar />

          <div className='mb-6 text-center'>
            {/* Class for icon circle styling */}
            <div className='icon-circle w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4'>
              <LogIn className='w-8 h-8 text-white' />
            </div>
            {/* Custom classes for text/title styling */}
            <h2 className='login-title text-2xl font-bold'>Welcome Back</h2>
            <p className='login-subtitle text-sm mt-1'>Sign in to continue to TaskFlow</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
              // Combining imported INPUTWRAPPER with custom dark theme class
              <div className={`${INPUTWRAPPER} input-wrapper-dark`} key={name}>
                {/* Icon classes are now solely for size/spacing, color is CSS-managed */}
                <Icon className='w-5 h-5 mr-2' />
                <input 
                  type={isPassword && showPassword ? "text" : type} 
                  placeholder={placeholder} 
                  value={formData[name]} 
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} 
                  // Input styles managed by CSS, only functional classes remain
                  className='w-full focus-outline-none text-sm' 
                  required 
                />

                {isPassword && (
                  <button type='button' onClick={() => setShowPassword((prev) => (!prev))} className="password-toggle ml-2 transition-colors">
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                )}
              </div>
            ))}

            <div className="flex items-center">
              {/* Checkbox styling managed by CSS */}
              <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className='checkbox-input h-4 w-4 rounded' required />
              {/* Label styling managed by CSS */}
              <label htmlFor='rememberMe' className='checkbox-label ml-2 block text-sm'>Remember Me</label>
            </div>

            <button 
              type='submit' 
              // Combining imported BUTTONCLASSES with custom dark gradient class
              className={`${BUTTONCLASSES} button-gradient-dark text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`} 
              disabled={loading}
            >
              {loading ? (
                "Logging In ..."
              ) : (
                <>
                  <LogIn className='w-4 h-4 mr-2' />Login
                </>
              )}
            </button>
          </form>
          {/* Link text styling managed by CSS */}
          <p className='text-center login-link-text text-sm mt-6'>
            Dont Have An Account ?{" "}
            <button type='button' className='login-switch-button font-medium transition-colors' onClick={handleSwitchMode}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
      {/*  */}
    </div>
  );
};

export default Login;
