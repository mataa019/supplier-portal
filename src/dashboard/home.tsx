
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  FolderIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchMyApplications, fetchSupplierCategories } from '../apiservice/Apiservice';


export default function DashboardHome() {
  const [stats, setStats] = useState([
    { title: 'Total Applications', value: 0, icon: DocumentTextIcon },
    { title: 'Payment Pending', value: 0, icon: ClockIcon },
    { title: 'Draft Applications', value: 0, icon: CheckCircleIcon },
    { title: 'Categories Applied', value: 0, icon: FolderIcon },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const [applications] = await Promise.all([
          fetchMyApplications(),
          fetchSupplierCategories(),
        ]);

        // Calculate stats
        const totalApplications = applications.length;
        const paymentPending = applications.filter(app => app.status === 'payment_pending').length;
        const draftApplications = applications.filter(app => app.status === 'draft').length;
        // Unique categories applied for
        const uniqueCategoryIds = new Set(applications.map(app => app.categoryId));
        const categoriesApplied = uniqueCategoryIds.size;

        setStats([
          { title: 'Total Applications', value: totalApplications, icon: DocumentTextIcon },
          { title: 'Payment Pending', value: paymentPending, icon: ClockIcon },
          { title: 'Draft Applications', value: draftApplications, icon: CheckCircleIcon },
          { title: 'Categories Applied', value: categoriesApplied, icon: FolderIcon },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your supplier portal activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {loading ? (
          <div className="col-span-4 text-center py-8">Loading stats...</div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-600 py-8">{error}</div>
        ) : (
          stats.map((stat) => (
            <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))
        )}
      </div>

      {/* Application Process */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5">Application Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/dashboard/categories"
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white rounded text-sm font-semibold flex items-center justify-center">
              1
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900">Select Category</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Choose a supply category to apply for</p>
            </div>
          </Link>
          <Link
            to="/dashboard/apply"
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white rounded text-sm font-semibold flex items-center justify-center">
              2
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900">Download Form</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Get the application form for your category</p>
            </div>
          </Link>
          <Link
            to="/dashboard/documents"
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white rounded text-sm font-semibold flex items-center justify-center">
              3
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900">Upload Documents</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Submit required documents</p>
            </div>
          </Link>
          <Link
            to="/dashboard/payment"
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white rounded text-sm font-semibold flex items-center justify-center">
              4
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900">Make Payment</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Pay application fee and upload proof</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Link
            to="/dashboard/categories"
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FolderIcon className="w-5 h-5" />
            Apply for Category
          </Link>
          <Link
            to="/dashboard/documents"
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Upload Documents
          </Link>
          <Link
            to="/dashboard/payment"
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <CreditCardIcon className="w-5 h-5" />
            Make Payment
          </Link>
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600"
          >
            View all applications
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
