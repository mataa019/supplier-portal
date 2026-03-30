
import { useState, useEffect } from 'react';
import type { ApplicationResponse, ApplicationDocument } from '../apiservice/Apiservice';

import {
  getApplication,
  withdrawApplication,
  updateApplication,
  fetchMyApplications,
} from '../apiservice/Apiservice';

import {
  FunnelIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function Applications() {
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
 
  
  // Fetch applications for current user
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchMyApplications();
        setApplications(data);
      } catch (e: any) {
        // Optionally handle error (e.g., show notification)
        setApplications([]);
      }
    }
    fetchData();
  }, []);
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


  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  const handleViewApplication = async (id: string) => {
    setSelectedApp(null);
    setDocuments([]);
    setDocsError(null);
    setLoadingDocs(true);
    try {
      const app = await getApplication(id);
      setSelectedApp(app);
      setDocuments(app.documents || []);
    } catch (e: any) {
      setDocsError(e.message || 'Failed to load application details');
    } finally {
      setLoadingDocs(false);
    }
  };
  const handleWithdraw = async () => {
    if (!selectedApp) return;
    const reason = window.prompt('Please provide a reason for withdrawal:', 'Submitted in error');
    if (!reason) return;
    setWithdrawing(true);
    try {
      const updated = await withdrawApplication(selectedApp.id, { reason });
      setSelectedApp(updated);
      // Optionally update applications list here if needed
      alert('Application withdrawn successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  // Update category handler
  const handleUpdateCategory = async () => {
    if (!selectedApp) return;
    const newCategoryId = window.prompt('Enter new Category ID:', selectedApp.category?.id || '');
    if (!newCategoryId || newCategoryId === selectedApp.category?.id) return;

    // Prompt for document IDs (comma-separated)
    const docIdsInput = window.prompt('Enter document IDs (comma separated):', (documents || []).map(doc => doc.id).join(','));
    if (docIdsInput === null) return; // Cancelled
    const docIds = docIdsInput.split(',').map(id => id.trim()).filter(Boolean);

    setUpdatingCategory(true);
    try {
      const updated = await updateApplication(selectedApp.id, newCategoryId, docIds);
      setSelectedApp(updated);
      alert('Application updated successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to update application');
    } finally {
      setUpdatingCategory(false);
    }
  };

  // Stats
  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === 'draft').length,
    payment_pending: applications.filter((a) => a.status === 'payment_pending' || a.status === 'submitted').length,
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
              <p className="text-xs text-gray-500">Payment Pending / Submitted</p>
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
                // Use category.name and category.applicationFee from backend
                const StatusIcon = statusIcons[app.status as keyof typeof statusIcons] || DocumentTextIcon;
                return (
                  <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{app.category?.name || '—'}</h3>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status as keyof typeof statusColors]?.bg || 'bg-gray-100'} ${statusColors[app.status as keyof typeof statusColors]?.text || 'text-gray-700'}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-5 py-4 border-t border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Application Fee</p>
                        <p className="font-medium text-gray-900">K{app.category?.applicationFee ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Submitted</p>
                        <p className="font-medium text-gray-900">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                        <p className="font-medium text-gray-900">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</p>
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
                        <button
                          onClick={() => {
                              // Redirect to document upload page for editing draft
                              window.location.href = `/dashboard/documents?applicationId=${app.id}&category=${app.category?.id || ''}`;
                            }}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {app.status === 'submitted' && (
                        <button
                          onClick={() => alert('Payment flow coming soon!')}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Make Payment
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{selectedApp.category?.name || '—'}</span>
                    <button
                      onClick={handleUpdateCategory}
                      disabled={updatingCategory}
                      className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                    >
                      {updatingCategory ? 'Updating...' : 'Change'}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Fee</p>
                  <p className="font-medium text-gray-900">K{selectedApp.category?.applicationFee ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="font-medium text-gray-900">{selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1).replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Submitted At</p>
                  <p className="font-medium text-gray-900">{selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Created At</p>
                  <p className="font-medium text-gray-900">{selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : '—'}</p>
                </div>
                {/* Withdraw Button (show for eligible statuses) */}
                {['submitted', 'pending', 'payment_pending'].includes(selectedApp.status) && (
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className={`mt-2 mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                  </button>
                )}
                {/* Documents */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Documents</p>
                  {loadingDocs ? (
                    <span className="text-xs text-blue-600">Loading documents...</span>
                  ) : docsError ? (
                    <span className="text-xs text-red-600">{docsError}</span>
                  ) : (
                    <ul className="list-disc ml-5">
                      {documents.length === 0 ? (
                        <li className="text-gray-500">No documents found</li>
                      ) : (
                        documents.map((doc) => (
                          <li key={doc.id} className="text-gray-700">
                            {doc.fileName} <span className="text-xs text-gray-400">({doc.type})</span>
                          </li>
                        ))
                      )}
                    </ul>
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
