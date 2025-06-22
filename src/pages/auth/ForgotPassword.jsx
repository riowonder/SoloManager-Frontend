import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
        email: email
      });
      toast.success("Reset code sent successfully!");
        navigate("/forgot-password/otp-verification", { state: { email } });
      } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted overflow-hidden fixed top-0 left-0">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
          <p className="text-sm text-muted-foreground">Enter your email address and we'll send you a verification code</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 text-start">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="you@example.com" 
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
              "Send Reset Code"
            )}
          </button>
        </form>
        <div className="flex flex-col gap-2 text-center text-sm">
          <p className="text-gray-500">
            Remember your password? <NavLink to="/" className="underline hover:text-black">Sign In</NavLink>
          </p>
          <p className="text-gray-500">
            Don't have an account? <NavLink to="/signup" className="underline hover:text-black">Sign Up</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}