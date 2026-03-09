import { Outlet } from 'react-router-dom';
import {
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Sidebar from './SliderBar';
import Logo from '../assets/Minet_Logo.png';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Minet Zambia" className="h-12" />
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

      {/* Main Content */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
