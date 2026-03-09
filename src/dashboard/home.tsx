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
  { title: 'Pending Review', value: 1, icon: ClockIcon },
  { title: 'Approved', value: 1, icon: CheckCircleIcon },
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your supplier portal activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Application Process */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step, index) => (
            <Link
              key={step.number}
              to={step.link}
              className="flex items-start gap-3 p-3 border border-gray-100 rounded hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded text-xs font-medium flex items-center justify-center">
                {step.number}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-700">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/categories"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            <FolderIcon className="w-4 h-4" />
            Apply for Category
          </Link>
          <Link
            to="/dashboard/documents"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded hover:bg-gray-50"
          >
            <DocumentTextIcon className="w-4 h-4" />
            Upload Documents
          </Link>
          <Link
            to="/dashboard/payment"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded hover:bg-gray-50"
          >
            <CreditCardIcon className="w-4 h-4" />
            Make Payment
          </Link>
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            View all applications
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
