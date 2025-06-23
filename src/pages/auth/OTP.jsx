import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function OTP() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email } = useLocation().state || {};
    const { login } = useUser();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
                {
                    email: email,
                    inputOtp: otp.join(""),
                },
                { withCredentials: true }
            );

            if (response.data.success) { 
                toast.success("Email verified successfully!");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/is-authenticated`, {
                // Add necessary parameters for resending OTP
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted overflow-hidden fixed top-0 left-0">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
                    <p className="text-sm text-muted-foreground">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            );
                        })}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Verify Email"
                        )}
                    </button>
                </form> 
            </div>
        </div>
    );
}
