import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user } = useUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
} 