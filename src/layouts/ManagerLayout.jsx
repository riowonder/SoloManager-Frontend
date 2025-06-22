import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function ManagerLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
} 