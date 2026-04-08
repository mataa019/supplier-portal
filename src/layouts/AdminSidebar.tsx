import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  FolderIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: HomeIcon },
  { path: '/admin/suppliers', label: 'Suppliers', icon: UsersIcon },
  { path: '/admin/applications', label: 'Applications', icon: ClipboardDocumentListIcon },
  { path: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
  { path: '/admin/categories', label: 'Categories', icon: FolderIcon },
  { path: '/admin/users', label: 'Users', icon: UserGroupIcon },
  { path: '/admin/audit-log', label: 'Audit Log', icon: Cog6ToothIcon },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('pendingLoginEmail');
    handleClick();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-60 bg-gray-900 lg:sticky lg:top-[57px] h-full lg:h-[calc(100vh-57px)] flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleClick}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings & Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <Link
          to="/admin/settings"
          onClick={handleClick}
          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-1"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
