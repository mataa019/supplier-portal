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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 sticky top-[57px] h-[calc(100vh-57px)] flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
