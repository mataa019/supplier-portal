import { Link } from 'react-router-dom';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { title: 'Total Suppliers', value: 156, change: '+12%', icon: UsersIcon, color: 'red' },
  { title: 'Pending Applications', value: 23, change: '+5', icon: ClockIcon, color: 'yellow' },
  { title: 'Approved This Month', value: 18, change: '+8%', icon: CheckCircleIcon, color: 'green' },
  { title: 'Pending Payments', value: 7, change: '-2', icon: CreditCardIcon, color: 'blue' },
];

const recentApplications: { id: string; company: string; category: string; status: 'pending' | 'approved' | 'rejected'; date: string }[] = [
  { id: 'APP-2026-0045', company: 'ABC Construction Ltd', category: 'Construction Materials', status: 'pending', date: '2026-03-09' },
  { id: 'APP-2026-0044', company: 'Tech Solutions Inc', category: 'IT Equipment & Services', status: 'approved', date: '2026-03-08' },
  { id: 'APP-2026-0043', company: 'CleanPro Services', category: 'Cleaning Services', status: 'pending', date: '2026-03-08' },
  { id: 'APP-2026-0042', company: 'SafeGuard Security', category: 'Security Services', status: 'rejected', date: '2026-03-07' },
  { id: 'APP-2026-0041', company: 'Office Plus', category: 'Office Supplies', status: 'approved', date: '2026-03-07' },
];

const pendingPayments = [
  { id: 'PAY-001', company: 'ABC Construction Ltd', amount: 'K2,550', submitted: '2026-03-09' },
  { id: 'PAY-002', company: 'Fresh Foods Catering', amount: 'K1,550', submitted: '2026-03-08' },
  { id: 'PAY-003', company: 'QuickFix IT', amount: 'K3,050', submitted: '2026-03-08' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of supplier portal activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                stat.color === 'red' ? 'bg-red-50' :
                stat.color === 'yellow' ? 'bg-yellow-50' :
                stat.color === 'green' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'red' ? 'text-red-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                  stat.color === 'green' ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowTrendingUpIcon className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
              View all <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Application</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.id}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{app.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[app.status]}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Pending Payments</h2>
            <Link to="/admin/payments" className="text-sm text-red-600 hover:text-red-700">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.company}</p>
                  <p className="text-xs text-gray-500">{payment.submitted}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{payment.amount}</p>
                  <button className="text-xs text-red-600 hover:text-red-700">Verify</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Review Applications
          </Link>
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <CreditCardIcon className="w-5 h-5" />
            Verify Payments
          </Link>
          <Link
            to="/admin/suppliers"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <UsersIcon className="w-5 h-5" />
            Manage Suppliers
          </Link>
        </div>
      </div>
    </div>
  );
}
