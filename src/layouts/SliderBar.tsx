import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
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
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-200">
        <span className="text-base font-semibold text-gray-800">Supplier Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2 px-3 py-2">
          <UserCircleIcon className="w-6 h-6 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">Company Name</p>
            <p className="text-xs text-gray-400 truncate">supplier@email.com</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-2 mt-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
