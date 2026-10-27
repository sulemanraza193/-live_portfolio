import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
