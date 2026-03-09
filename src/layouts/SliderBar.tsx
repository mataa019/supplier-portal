import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/dashboard/categories', label: 'Categories', icon: '📁' },
  { path: '/dashboard/apply', label: 'Apply', icon: '📝' },
  { path: '/dashboard/documents', label: 'Documents', icon: '📄' },
  { path: '/dashboard/payment', label: 'Payment', icon: '💳' },
  { path: '/dashboard/applications', label: 'My Applications', icon: '📋' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-semibold">Supplier Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Company Name</p>
            <p className="text-xs text-gray-400">supplier@email.com</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-2 mt-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
