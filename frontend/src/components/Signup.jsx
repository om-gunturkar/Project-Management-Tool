import { User, Mail, Lock, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { INPUTWRAPPER, PRIMARY_BUTTON } from '../assets/dummy';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

// Initial empty form
const INITIAL_FORM = { name: "", email: "", password: "" };

const SignUp = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const url = "http://localhost:4000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${url}/api/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!data.success) throw new Error(data.message || "Signup failed");

      toast.success("Signed up successfully!");

      onSubmit?.(data.user);
      setFormData(INITIAL_FORM);

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      toast.error(msg);
      console.error("Signup Error:", err.response || err);
    } finally {
      setLoading(false);
    }
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

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="icon-circle w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="login-title text-2xl font-bold">Create Account</h2>
            <p className="login-subtitle text-sm mt-1">Sign up to continue to TaskFlow</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
              <div key={name} className={INPUTWRAPPER}>
                <Icon className="w-5 h-5 mr-2 text-white" />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                  required
                />
              </div>
            ))}

            {/* Button */}
            <button
              type="submit"
              className={`w-full ${PRIMARY_BUTTON}`}
              disabled={loading}
            >
              {loading ? (
                "Signing Up..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign Up
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center login-link-text text-sm mt-6">
            Already Have An Account?{" "}
            <button
              type="button"
              className="login-switch-button font-medium transition-colors"
              onClick={onSwitchMode}
            >
              Login
            </button>
          </p>

        </div>
      </div>

    </div>
  );
};

export default SignUp;