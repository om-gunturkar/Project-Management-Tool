import { User, Mail, Lock, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { BUTTONCLASSES, INPUTWRAPPER } from '../assets/dummy';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // ✅ reuse same styles

const INITIAL_FORM = { name: "", email: "", password: "" }

const SignUp = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Signed Up Successfully!");
    setFormData(INITIAL_FORM);
  };

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ];

  return (
    <div className="login-page-container">
      <div className="max-w-md w-full login-card-border">
        <div className="login-card-content p-8">

          <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

          <div className="mb-6 text-center">
            <div className="icon-circle w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="login-title text-2xl font-bold">Create Account</h2>
            <p className="login-subtitle text-sm mt-1">Sign up to continue to TaskFlow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
              <div key={name} className={`${INPUTWRAPPER} input-wrapper-dark`}>
                <Icon className="w-5 h-5 mr-2" />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  className="w-full focus-outline-none text-sm"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className={`${BUTTONCLASSES} button-gradient-dark text-white font-semibold flex items-center justify-center space-x-2`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Sign Up
                </>
              )}
            </button>
          </form>

          <p className="text-center login-link-text text-sm mt-6">
            Already Have An Account?{" "}
            <button type="button" className="login-switch-button font-medium" onClick={onSwitchMode}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
