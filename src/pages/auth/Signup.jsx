import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", gym_name: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email } = useLocation().state || {};
    const { login } = useUser();

    // Handle input changes and update formData
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
                name: formData.name,
                email: formData.email,
                gym_name: formData.gym_name,
                password: formData.password,
            }, { withCredentials: true });
            
            // Store user data in context
            login({
                name: formData.name,
                email: formData.email,
                gym_name: formData.gym_name
            });
            
            toast.success("Account created successfully!");
            navigate("/otp-verification", { state: { email: formData.email } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted overflow-hidden fixed top-0 left-0">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                    <p className="text-sm text-muted-foreground">Enter your details below to sign up</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 text-start">Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                            placeholder="Your name" 
                            required 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 text-start">Gym Name</label>
                        <input 
                            type="text" 
                            name="gym_name"
                            value={formData.gym_name}
                            onChange={handleInputChange}
                            className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                            placeholder="Your gym name" 
                            required 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 text-start">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input input-bordered px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                            placeholder="you@example.com" 
                            required 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 text-start">Password</label>
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
                            "Sign Up"
                        )}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500">
                    Already have an account? <NavLink to="/" className="underline hover:text-black">Sign In</NavLink>
                </p>
            </div>
        </div>
    );
}