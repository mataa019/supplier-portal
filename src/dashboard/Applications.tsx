import { useState, useEffect } from 'react';
// Import ApplicationResponse type if available
import type { ApplicationResponse, ApplicationDocument } from '../apiservice/Apiservice';
import { fetchApplicationDocuments, getApplication } from '../apiservice/Apiservice';
import {
  FunnelIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// Example: Accept applications as props or fetch from backend
// For now, use a single submitted application as an example
const exampleSubmittedApplication: ApplicationResponse = {
  id: 'cmn5rak2400097z0dmxo5rotp',
  supplierId: 'cmn5pj3xz0001sndfdubiy6um',
  categoryId: 'cmn5plg0f00006fqmy5zws1tc',
  status: 'submitted',
  submittedAt: '2026-03-25T08:12:45.135Z',
  reviewedAt: null,
  reviewedBy: null,
  remarks: null,
  createdAt: '2026-03-25T08:02:56.909Z',
  category: {
    id: 'cmn5plg0f00006fqmy5zws1tc',
    name: 'Operating Systems',
    description: 'For general goods and services suppliers',
    applicationFee: 300,
    Requirements: 'Business registration certificate, TPIN certificate',
    documentTemplate: 'string',
    status: 'active',
  },
  documents: [
    {
      id: 'cmn5rbk03000b7z0di2jfu6s1',
      applicationId: 'cmn5rak2400097z0dmxo5rotp',
      type: 'tax_certificate',
      fileName: 'Minet Zambia - Basic  Excel Training Quotation.pdf',
      filePath: 'uploads\\application-documents\\8c75605a-db7a-4a2d-8b95-0f30adfc745c.pdf',
      uploadedAt: '2026-03-25T08:03:43.491Z',
    },
  ],
  payments: [],
};

const applications: ApplicationResponse[] = [exampleSubmittedApplication];

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

  // Stats
  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === 'draft').length,
    payment_pending: applications.filter((a) => a.status === 'payment_pending').length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
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
                      {/* Add payment or continue buttons as needed for draft/payment_pending */}
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
                  <p className="font-medium text-gray-900">{selectedApp.category?.name || '—'}</p>
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
