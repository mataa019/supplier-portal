import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/dashboard/categories', label: 'Categories', icon: FolderIcon },
  { path: '/dashboard/apply', label: 'Apply', icon: PencilSquareIcon },
  { path: '/dashboard/documents', label: 'Documents', icon: DocumentTextIcon },
  { path: '/dashboard/payment', label: 'Payment', icon: CreditCardIcon },
  { path: '/dashboard/applications', label: 'My Applications', icon: ClipboardDocumentListIcon },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="w-60 bg-red-700 lg:sticky lg:top-[57px] h-screen lg:h-[calc(100vh-57px)] flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 pt-12 lg:pt-6 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold text-red-200 uppercase tracking-wider">Navigation</p>
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
                      ? 'bg-white text-red-700'
                      : 'text-white/90 hover:bg-red-600 hover:text-white'
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

      {/* Logout */}
      <div className="px-4 py-4 border-t border-red-600">
        <Link
          to="/login"
          onClick={handleClick}
          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
