import axios from "axios";
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const isAuthenticated = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/is-authenticated`, { withCredentials: true });
        setAuth(response.data.success);
      } catch (err) {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return auth;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute; 