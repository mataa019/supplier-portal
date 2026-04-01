import { useState, useEffect } from 'react';
// Simple modal for remarks input
function RemarksModal({ open, onClose, onSubmit, action, loading }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (remarks: string) => void;
  action: 'approve' | 'reject';
  loading?: boolean;
}) {
  const [remarks, setRemarks] = useState('');
  useEffect(() => { if (open) setRemarks(''); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">{action === 'approve' ? 'Approve' : 'Reject'} Application</h2>
        <label className="block text-sm mb-2">Remarks<span className="text-red-500">*</span></label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 rounded bg-gray-200 text-gray-700"
            onClick={onClose}
            disabled={loading}
          >Cancel</button>
          <button
            className={`px-4 py-1 rounded text-white ${action === 'approve' ? 'bg-green-600' : 'bg-red-600'} ${loading ? 'opacity-60' : ''}`}
            onClick={() => onSubmit(remarks)}
            disabled={loading || !remarks.trim()}
          >{action === 'approve' ? 'Approve' : 'Reject'}</button>
        </div>
      </div>
    </div>
  );
}
import { getAllApplications, listAdminSuppliers, getAdminSupplier, ApproveApplication, RejectApplication } from '../apiservice/adminServices';
import type { SupplierApplication, AdminSupplier } from '../apiservice/adminModels';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ApplicationDetailsModal from './model/ApplicationDetailsModal';






const statusColors = {
  submitted: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  payment_pending: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-200 text-green-800',
};

const statusLabels = {
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  payment_pending: 'Awaiting Payment',
  paid: 'Paid',
};



export default function Applications() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<string, AdminSupplier>>({});
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [applications, setApplications] = useState<SupplierApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SupplierApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch suppliers on mount
  useEffect(() => {
    setLoadingSuppliers(true);
    listAdminSuppliers()
      .then((data) => {
        setSuppliers(data);
        if (data.length > 0) setSelectedSupplierId(data[0].id);
      })
      .catch((err) => alert(err.message || 'Failed to fetch suppliers'))
      .finally(() => setLoadingSuppliers(false));
  }, []);

  // Fetch applications when filters change
  useEffect(() => {
    setLoading(true);
    getAllApplications({
      supplierId: selectedSupplierId || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchTerm || undefined,
      page,
      limit,
    })
      .then((res: any) => {
        // API returns { data: Application[], meta: ... }
        setApplications(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch((err) => alert(err.message || 'Failed to fetch applications'))
      .finally(() => setLoading(false));
  }, [selectedSupplierId, statusFilter, searchTerm, page, limit]);

  // Fetch supplier details for all unique supplierIds in applications
  useEffect(() => {
    const uniqueSupplierIds = Array.from(new Set(applications.map(app => app.supplierId)));
    const missingSupplierIds = uniqueSupplierIds.filter(id => !supplierMap[id]);
    if (missingSupplierIds.length === 0) return;
    Promise.all(missingSupplierIds.map(id => getAdminSupplier(id).catch(() => null)))
      .then(results => {
        const newMap: Record<string, AdminSupplier> = { ...supplierMap };
        results.forEach((supplier, idx) => {
          if (supplier && missingSupplierIds[idx]) {
            newMap[missingSupplierIds[idx]] = supplier;
          }
        });
        setSupplierMap(newMap);
      });
  }, [applications]);


  // No need to filter client-side, server handles it
  const filteredApplications = applications;


  // Remarks modal state
  const [remarksModal, setRemarksModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    appId: string | null;
  }>({ open: false, action: 'approve', appId: null });
  const [remarksLoading, setRemarksLoading] = useState(false);

  const openRemarksModal = (action: 'approve' | 'reject', appId: string) => {
    setRemarksModal({ open: true, action, appId });
  };
  const closeRemarksModal = () => {
    setRemarksModal({ open: false, action: 'approve', appId: null });
  };

  const handleRemarksSubmit = async (remarks: string) => {
    if (!remarksModal.appId) return;
    setRemarksLoading(true);
    try {
      if (remarksModal.action === 'approve') {
        await ApproveApplication(remarksModal.appId, remarks);
        setApplications(applications.map((app) =>
          app.id === remarksModal.appId ? { ...app, status: 'approved', remarks } : app
        ));
        if (selectedApp?.id === remarksModal.appId && selectedApp) {
          setSelectedApp({ ...selectedApp, status: 'approved', remarks });
        }
        alert('Application approved successfully.');
      } else {
        await RejectApplication(remarksModal.appId, remarks);
        setApplications(applications.map((app) =>
          app.id === remarksModal.appId ? { ...app, status: 'rejected', remarks } : app
        ));
        if (selectedApp?.id === remarksModal.appId && selectedApp) {
          setSelectedApp({ ...selectedApp, status: 'rejected', remarks });
        }
        alert('Application rejected successfully.');
      }
      closeRemarksModal();
    } catch (err: any) {
      alert(err.message || 'Failed to process application');
    } finally {
      setRemarksLoading(false);
    }
  };

  const handleView = (app: SupplierApplication) => {
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
      {loadingSuppliers && <div className="text-center py-8 text-gray-500">Loading suppliers...</div>}
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
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="payment_pending">Awaiting Payment</option>
              <option value="paid">Paid</option>
              <option value="draft">Draft</option>
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
                    <p className="text-sm font-medium text-gray-900">{supplierMap[app.supplierId]?.companyName || app.supplierId}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{app.category?.name}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">{app.category?.applicationFee}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[app.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {statusLabels[app.status as keyof typeof statusLabels] || app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{app.submittedAt ? app.submittedAt.split('T')[0] : ''}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(app)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <>
                        <button
                          onClick={() => app.status === 'pending' && openRemarksModal('approve', app.id)}
                          className={`p-1.5 rounded ${app.status === 'pending' ? 'text-green-600 hover:bg-green-50' : 'text-gray-300 cursor-not-allowed'}`}
                          title="Approve"
                          disabled={app.status !== 'pending'}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => app.status === 'pending' && openRemarksModal('reject', app.id)}
                          className={`p-1.5 rounded ${app.status === 'pending' ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
                          title="Reject"
                          disabled={app.status !== 'pending'}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplications.length === 0 && !loading && selectedSupplierId && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}

      <RemarksModal
        open={remarksModal.open}
        onClose={closeRemarksModal}
        onSubmit={handleRemarksSubmit}
        action={remarksModal.action}
        loading={remarksLoading}
      />

      <ApplicationDetailsModal
        open={showViewModal}
        application={selectedApp}
        supplier={
          selectedApp?.supplierId
            ? supplierMap[selectedApp.supplierId]
            : undefined
        }
        onClose={() => setShowViewModal(false)}
        onApprove={id => openRemarksModal('approve', id)}
        onReject={id => openRemarksModal('reject', id)}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />

    </div>
  );
}
