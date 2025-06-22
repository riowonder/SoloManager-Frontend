import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <main className="flex-1 p-0 sm:p-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
} 