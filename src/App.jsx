import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPswdOTP from './pages/auth/ForgotPswdOTP';
import Dashboard from './pages/main/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OTP from './pages/auth/OTP';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css'
import { Toaster } from 'react-hot-toast';
import AllMembers from './pages/main/AllMembers';
import Finance from './pages/main/Finance';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ErrorPage from './components/ErrorPage';
import ManagerLogin from './pages/auth/ManagerLogin';
import ResetPswd from './pages/auth/ResetPswd';

export const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
        <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/manager-login" element={<ManagerLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTP />} />
            <Route path="/forgot-password/otp-verification" element={<ForgotPswdOTP />} />
            <Route path="/reset-password" element={<ResetPswd />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
              errorElement={<ErrorPage />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<AllMembers />} />
              <Route path="finance" element={<Finance />} />
            </Route>
            <Route
              path="/manager"
              element={
                <ManagerRoute>
                  <ManagerLayout />
                </ManagerRoute>
              }
              errorElement={<ErrorPage />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<AllMembers />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}
