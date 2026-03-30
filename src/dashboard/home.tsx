import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  FolderIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { title: 'Total Applications', value: 3, icon: DocumentTextIcon },
  { title: 'Payment Pending ', value: 1, icon: ClockIcon },
  { title: 'Draft Applications', value: 1, icon: CheckCircleIcon },
  { title: 'Categories Applied', value: 2, icon: FolderIcon },
];

const steps = [
  { number: 1, title: 'Select Category', description: 'Choose a supply category to apply for', link: '/dashboard/categories' },
  { number: 2, title: 'Download Form', description: 'Get the application form for your category', link: '/dashboard/apply' },
  { number: 3, title: 'Upload Documents', description: 'Submit required documents', link: '/dashboard/documents' },
  { number: 4, title: 'Make Payment', description: 'Pay application fee and upload proof', link: '/dashboard/payment' },
];

export default function DashboardHome() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your supplier portal activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Application Process */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5">Application Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step) => (
            <Link
              key={step.number}
              to={step.link}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white rounded text-sm font-semibold flex items-center justify-center">
                {step.number}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            </Link>
          ))}
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
