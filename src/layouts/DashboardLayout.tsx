import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Bars3Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Sidebar from './SliderBar';
import Logo from '../assets/Minet_Logo.png';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Left side - Menu button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <img src={Logo} alt="Minet Zambia" className="h-10 sm:h-12" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Company Name</p>
                <p className="text-xs text-gray-500">Supplier</p>
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
        {/* Sidebar - hidden on mobile, shown via overlay */}
        <div
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-40 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 min-h-[calc(100vh-57px)] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
