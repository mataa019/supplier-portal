import { useState } from 'react';
import {
  FunnelIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const applications = [
  {
    id: 'APP-2026-0001',
    category: 'Construction Materials',
    status: 'pending' as const,
    submittedDate: '2026-03-05',
    lastUpdated: '2026-03-08',
    fee: 'K2,500',
  },
  {
    id: 'APP-2026-0002',
    category: 'Office Supplies',
    status: 'approved' as const,
    submittedDate: '2026-02-20',
    lastUpdated: '2026-02-28',
    fee: 'K1,500',
  },
  {
    id: 'APP-2025-0089',
    category: 'IT Equipment & Services',
    status: 'rejected' as const,
    submittedDate: '2025-12-15',
    lastUpdated: '2025-12-30',
    fee: 'K3,000',
  },
  {
    id: 'APP-2026-0003',
    category: 'Cleaning Services',
    status: 'payment_pending' as const,
    submittedDate: '2026-03-08',
    lastUpdated: '2026-03-08',
    fee: 'K1,000',
  },
  {
    id: 'APP-2026-0004',
    category: 'Security Services',
    status: 'draft' as const,
    lastUpdated: '2026-03-09',
    fee: 'K2,000',
  },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'payment_pending', label: 'Payment Pending' },
];

const statusColors = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
  payment_pending: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
};

const statusIcons = {
  draft: DocumentTextIcon,
  payment_pending: CurrencyDollarIcon,
};

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<typeof applications[0] | null>(null);

  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  const handleViewApplication = (id: string) => {
    const app = applications.find((a) => a.id === id);
    setSelectedApp(app || null);
  };

  // Stats
  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === 'draft').length,
    payment_pending: applications.filter((a) => a.status === 'payment_pending').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your supplier applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-orange-600">{stats.payment_pending}</p>
              <p className="text-xs text-gray-500">Payment Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500">
                {filteredApplications.length} of {applications.length}
              </p>
            </div>
          </div>

          {/* Applications */}
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const StatusIcon = statusIcons[app.status];
                return (
                  <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{app.category}</h3>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status].bg} ${statusColors[app.status].text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {app.status === 'draft' && 'Draft'}
                        {app.status === 'pending' && 'Under Review'}
                        {app.status === 'approved' && 'Approved'}
                        {app.status === 'rejected' && 'Rejected'}
                        {app.status === 'payment_pending' && 'Payment Pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-5 py-4 border-t border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Application Fee</p>
                        <p className="font-medium text-gray-900">{app.fee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Submitted</p>
                        <p className="font-medium text-gray-900">{app.submittedDate || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                        <p className="font-medium text-gray-900">{app.lastUpdated}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewApplication(app.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      {app.status === 'draft' && (
                        <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Continue
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      )}
                      {app.status === 'payment_pending' && (
                        <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Complete Payment
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      )}
                      {app.status === 'rejected' && (
                        <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                          Reapply
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <ClipboardDocumentListIcon className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-sm text-gray-500">
                {statusFilter ? 'No applications match your filter' : 'You haven\'t submitted any applications yet'}
              </p>
            </div>
          )}
        </div>

        {/* Detail Panel / Timeline */}
        <div className="space-y-6">
          {selectedApp ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Reference</p>
                  <p className="font-medium text-gray-900">{selectedApp.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-medium text-gray-900">{selectedApp.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Fee Paid</p>
                  <p className="font-medium text-gray-900">{selectedApp.fee}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Activity Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                      <p className="text-xs text-gray-500">{selectedApp.submittedDate}</p>
                    </div>
                  </div>
                  {selectedApp.status === 'pending' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Under Review</p>
                        <p className="text-xs text-gray-500">Being processed by admin</p>
                      </div>
                    </div>
                  )}
                  {selectedApp.status === 'approved' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Approved</p>
                        <p className="text-xs text-gray-500">{selectedApp.lastUpdated}</p>
                      </div>
                    </div>
                  )}
                  {selectedApp.status === 'rejected' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Rejected</p>
                        <p className="text-xs text-gray-500">{selectedApp.lastUpdated}</p>
                        <p className="text-xs text-red-600 mt-1">Reason: Incomplete documentation</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <LightBulbIcon className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircleSolid className="w-3.5 h-3.5 text-gray-400" />
                      Click on an application to see details
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleSolid className="w-3.5 h-3.5 text-gray-400" />
                      Use filters to find specific applications
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleSolid className="w-3.5 h-3.5 text-gray-400" />
                      Continue draft applications anytime
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleSolid className="w-3.5 h-3.5 text-gray-400" />
                      Check your email for status updates
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Legend</h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-3">
                <DocumentTextIcon className="w-4 h-4 text-gray-700" />
                <span className="text-gray-600">Draft - Not yet submitted</span>
              </li>
              <li className="flex items-center gap-3">
                <CurrencyDollarIcon className="w-4 h-4 text-orange-700" />
                <span className="text-gray-600">Payment Pending</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
