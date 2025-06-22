import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function ManagerRoute({ children }) {
  const { user } = useUser();
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  return children;
} 