import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Base URL : ", import.meta.env.VITE_API_BASE_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          data: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );
      
      // Store user data in context and localStorage
      login(response.data.user);
      toast.success("Logged in successfully!");
      
      // Navigate based on user role
      if (response.data.user.role === 'manager') {
        navigate("/manager/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted overflow-hidden fixed top-0 left-0">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
          <p className="text-sm text-muted-foreground">Enter your email and password below to login</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 text-start">Email or Username</label>
            <input 
              type="text" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="you@example.com or username" 
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 text-start">Password</label>
              <NavLink to="/forgot-password" className="text-sm text-gray-600 hover:text-black">Forgot password?</NavLink>
            </div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <NavLink to="/signup" className="underline hover:text-black">Sign Up</NavLink>
        </p>
        <p className="text-sm text-center mt-2">
          <NavLink to="/manager-login" className="underline text-cyan-700 hover:text-cyan-900 font-medium">
            Login as manager
          </NavLink>
        </p>
      </div>
    </div>
  );
}