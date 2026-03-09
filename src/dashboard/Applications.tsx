import { useState } from 'react';
import { Card } from '../component/cards';
import Select from '../component/Select';

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
  { value: 'pending', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const statusColors = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  payment_pending: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
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
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
        <p className="text-gray-600">Track and manage your supplier applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select
                  id="status"
                  label=""
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                  placeholder="Filter by status"
                />
              </div>
              <p className="text-sm text-gray-500">
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
            </div>
          </Card>

          {/* Applications */}
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{app.category}</h3>
                      <p className="text-sm text-gray-500">Application #{app.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusColors[app.status].bg} ${statusColors[app.status].text}`}>
                      <span className={`w-2 h-2 rounded-full ${statusColors[app.status].dot}`} />
                      {app.status === 'draft' && 'Draft'}
                      {app.status === 'pending' && 'Under Review'}
                      {app.status === 'approved' && 'Approved'}
                      {app.status === 'rejected' && 'Rejected'}
                      {app.status === 'payment_pending' && 'Payment Pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p className="text-gray-400">Application Fee</p>
                      <p className="font-medium">{app.fee}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submitted</p>
                      <p className="font-medium">{app.submittedDate || 'Not submitted'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="font-medium">{app.lastUpdated}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewApplication(app.id)}
                      className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </button>
                    {app.status === 'draft' && (
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Continue
                      </button>
                    )}
                    {app.status === 'payment_pending' && (
                      <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        Complete Payment
                      </button>
                    )}
                    {app.status === 'rejected' && (
                      <button className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Reapply
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {statusFilter ? 'No applications match your filter' : 'You haven\'t submitted any applications yet'}
              </p>
            </Card>
          )}
        </div>

        {/* Detail Panel / Timeline */}
        <div className="space-y-6">
          {selectedApp ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Application Details</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Reference</p>
                  <p className="font-medium text-gray-800">{selectedApp.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{selectedApp.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fee Paid</p>
                  <p className="font-medium text-gray-800">{selectedApp.fee}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Activity Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Application Submitted</p>
                      <p className="text-xs text-gray-500">{selectedApp.submittedDate}</p>
                    </div>
                  </div>
                  {selectedApp.status === 'pending' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Under Review</p>
                        <p className="text-xs text-gray-500">Being processed by admin</p>
                      </div>
                    </div>
                  )}
                  {selectedApp.status === 'approved' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Application Approved</p>
                        <p className="text-xs text-gray-500">{selectedApp.lastUpdated}</p>
                      </div>
                    </div>
                  )}
                  {selectedApp.status === 'rejected' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Application Rejected</p>
                        <p className="text-xs text-gray-500">{selectedApp.lastUpdated}</p>
                        <p className="text-xs text-red-600 mt-1">Reason: Incomplete documentation</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Click on an application to see details</li>
                <li>• Use filters to find specific applications</li>
                <li>• Continue draft applications anytime</li>
                <li>• Check your email for status updates</li>
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Status Legend</h3>
            <ul className="text-sm space-y-2">
              {Object.entries(statusColors).map(([status, colors]) => (
                <li key={status} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className="text-gray-600">
                    {status === 'draft' && 'Draft - Not yet submitted'}
                    {status === 'pending' && 'Pending - Under review'}
                    {status === 'approved' && 'Approved - Ready to supply'}
                    {status === 'rejected' && 'Rejected - See reason'}
                    {status === 'payment_pending' && 'Payment Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
