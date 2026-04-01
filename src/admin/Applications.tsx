import { useState, useEffect } from 'react';
import { getAllApplications, listAdminSuppliers, getAdminSupplier } from '../apiservice/adminServices';
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


  const handleApprove = (id: string) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'approved' } : app
    ));
    if (selectedApp?.id === id && selectedApp) {
      setSelectedApp({ ...selectedApp, status: 'approved' });
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this application?')) {
      setApplications(applications.map((app) =>
        app.id === id ? { ...app, status: 'rejected' } : app
      ));
      if (selectedApp?.id === id && selectedApp) {
        setSelectedApp({ ...selectedApp, status: 'rejected' });
      }
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
      <ApplicationDetailsModal
        open={showViewModal}
        application={selectedApp}
        supplier={
          selectedApp?.supplierId
            ? supplierMap[selectedApp.supplierId]
            : undefined
        }
        onClose={() => setShowViewModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />

    </div>
  );
}
