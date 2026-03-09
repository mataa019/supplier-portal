import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Application {
  id: string;
  companyName: string;
  email: string;
  tpin: string;
  category: string;
  fee: string;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending';
  submittedDate: string;
  documents: { name: string; uploaded: boolean }[];
}

const mockApplications: Application[] = [
  {
    id: 'APP-2026-0045',
    companyName: 'ABC Construction Ltd',
    email: 'info@abcconstruction.com',
    tpin: '1234567890',
    category: 'Construction Materials',
    fee: 'K2,500',
    status: 'pending',
    submittedDate: '2026-03-09',
    documents: [
      { name: 'Application Form', uploaded: true },
      { name: 'Business Registration', uploaded: true },
      { name: 'Tax Certificate', uploaded: true },
      { name: 'Financial Statements', uploaded: true },
    ],
  },
  {
    id: 'APP-2026-0044',
    companyName: 'Tech Solutions Inc',
    email: 'contact@techsolutions.com',
    tpin: '0987654321',
    category: 'IT Equipment & Services',
    fee: 'K3,000',
    status: 'approved',
    submittedDate: '2026-03-08',
    documents: [
      { name: 'Application Form', uploaded: true },
      { name: 'Business Registration', uploaded: true },
      { name: 'Tax Certificate', uploaded: true },
    ],
  },
  {
    id: 'APP-2026-0043',
    companyName: 'CleanPro Services',
    email: 'hello@cleanpro.com',
    tpin: '1122334455',
    category: 'Cleaning Services',
    fee: 'K1,000',
    status: 'pending',
    submittedDate: '2026-03-08',
    documents: [
      { name: 'Application Form', uploaded: true },
      { name: 'Business Registration', uploaded: true },
      { name: 'Tax Certificate', uploaded: false },
    ],
  },
  {
    id: 'APP-2026-0042',
    companyName: 'SafeGuard Security',
    email: 'info@safeguard.com',
    tpin: '5566778899',
    category: 'Security Services',
    fee: 'K2,000',
    status: 'rejected',
    submittedDate: '2026-03-07',
    documents: [
      { name: 'Application Form', uploaded: true },
      { name: 'Business Registration', uploaded: false },
    ],
  },
  {
    id: 'APP-2026-0041',
    companyName: 'Office Plus Zambia',
    email: 'sales@officeplus.co.zm',
    tpin: '9988776655',
    category: 'Office Supplies',
    fee: 'K1,500',
    status: 'payment_pending',
    submittedDate: '2026-03-07',
    documents: [
      { name: 'Application Form', uploaded: true },
      { name: 'Business Registration', uploaded: true },
      { name: 'Tax Certificate', uploaded: true },
    ],
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  payment_pending: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  payment_pending: 'Awaiting Payment',
};

export default function Applications() {
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    if (selectedApp?.id === id) {
      setSelectedApp({ ...selectedApp, status: 'approved' });
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this application?')) {
      setApplications(applications.map((app) =>
        app.id === id ? { ...app, status: 'rejected' as const } : app
      ));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: 'rejected' });
      }
    }
  };

  const handleView = (app: Application) => {
    setSelectedApp(app);
    setShowViewModal(true);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage supplier applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, ID, or category..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="payment_pending">Awaiting Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Application</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Fee</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{app.companyName}</p>
                    <p className="text-xs text-gray-500">{app.id}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{app.category}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">{app.fee}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{app.submittedDate}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(app)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                <p className="text-sm text-gray-500">{selectedApp.id}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Company Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Company Information</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApp.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TPIN</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApp.tpin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApp.category}</p>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedApp.status]}`}>
                    {statusLabels[selectedApp.status]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application Fee</p>
                  <p className="text-lg font-bold text-gray-900">{selectedApp.fee}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="text-sm font-medium text-gray-900">{selectedApp.submittedDate}</p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Submitted Documents</h4>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.uploaded ? (
                          <>
                            <span className="text-xs text-green-600">Uploaded</span>
                            <button className="text-xs text-red-600 hover:text-red-700">View</button>
                          </>
                        ) : (
                          <span className="text-xs text-red-600">Missing</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
