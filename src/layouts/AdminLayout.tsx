import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';
import Logo from '../assets/Minet_Logo.png';
import { getUserProfile } from '../apiservice/Apiservice';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user);
        if (data.user.role !== 'admin') {
           navigate('/dashboard'); // Limit access if not admin
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        navigate('/login');
      }
    };
    
    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Left side - Menu button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-800"
            >
              <Bars3Icon className="w-6 h-6 text-gray-300" />
            </button>
            <img src={Logo} alt="Minet Zambia" className="h-10 sm:h-12" />
            <span className="hidden sm:inline-block px-2 py-1 text-xs font-medium bg-red-600 text-white rounded">
              ADMIN
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-800 relative">
              <BellIcon className="w-6 h-6 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[57px] bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-40 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 min-h-[calc(100vh-57px)] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
