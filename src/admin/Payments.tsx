import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface Payment {
  id: string;
  applicationId: string;
  companyName: string;
  category: string;
  amount: string;
  method: 'bank_transfer' | 'mobile_money' | 'card';
  transactionRef: string;
  proofFile: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedDate: string;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    applicationId: 'APP-2026-0045',
    companyName: 'ABC Construction Ltd',
    category: 'Construction Materials',
    amount: 'K2,550',
    method: 'bank_transfer',
    transactionRef: 'TXN-20260309-001',
    proofFile: 'payment_proof_001.pdf',
    status: 'pending',
    submittedDate: '2026-03-09',
  },
  {
    id: 'PAY-002',
    applicationId: 'APP-2026-0043',
    companyName: 'CleanPro Services',
    category: 'Cleaning Services',
    amount: 'K1,050',
    method: 'mobile_money',
    transactionRef: 'MTN-789456123',
    proofFile: 'momo_screenshot_002.png',
    status: 'pending',
    submittedDate: '2026-03-08',
  },
  {
    id: 'PAY-003',
    applicationId: 'APP-2026-0044',
    companyName: 'Tech Solutions Inc',
    category: 'IT Equipment & Services',
    amount: 'K3,050',
    method: 'bank_transfer',
    transactionRef: 'TXN-20260307-015',
    proofFile: 'bank_slip_003.pdf',
    status: 'verified',
    submittedDate: '2026-03-07',
  },
  {
    id: 'PAY-004',
    applicationId: 'APP-2026-0040',
    companyName: 'Fresh Foods Catering',
    category: 'Catering Services',
    amount: 'K1,550',
    method: 'mobile_money',
    transactionRef: 'AIR-123789456',
    proofFile: 'airtel_receipt.png',
    status: 'rejected',
    submittedDate: '2026-03-06',
  },
  {
    id: 'PAY-005',
    applicationId: 'APP-2026-0041',
    companyName: 'Office Plus Zambia',
    category: 'Office Supplies',
    amount: 'K1,550',
    method: 'bank_transfer',
    transactionRef: 'TXN-20260305-008',
    proofFile: 'deposit_slip.pdf',
    status: 'pending',
    submittedDate: '2026-03-05',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const methodLabels = {
  bank_transfer: 'Bank Transfer',
  mobile_money: 'Mobile Money',
  card: 'Card Payment',
};

export default function Payments() {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (id: string) => {
    setPayments(payments.map((p) =>
      p.id === id ? { ...p, status: 'verified' as const } : p
    ));
    if (selectedPayment?.id === id) {
      setSelectedPayment({ ...selectedPayment, status: 'verified' });
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this payment?')) {
      setPayments(payments.map((p) =>
        p.id === id ? { ...p, status: 'rejected' as const } : p
      ));
      if (selectedPayment?.id === id) {
        setSelectedPayment({ ...selectedPayment, status: 'rejected' });
      }
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    totalAmount: payments.filter(p => p.status === 'verified').reduce((acc, p) => {
      const amount = parseInt(p.amount.replace(/[^\d]/g, ''));
      return acc + amount;
    }, 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Verify payment proofs and manage transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Payments</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending Verification</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          <p className="text-sm text-gray-500">Verified</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">K{stats.totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Verified Amount</p>
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
              placeholder="Search by company, transaction ref, or application ID..."
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
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
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
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Method</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Transaction Ref</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{payment.companyName}</p>
                    <p className="text-xs text-gray-500">{payment.applicationId}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {methodLabels[payment.method]}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell font-mono">
                    {payment.transactionRef}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{payment.amount}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[payment.status]}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(payment)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(payment.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Verify"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(payment.id)}
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
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                <p className="text-sm text-gray-500">{selectedPayment.id}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application ID</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.applicationId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-bold text-gray-900">{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">{methodLabels[selectedPayment.method]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Reference</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">{selectedPayment.transactionRef}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted Date</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.submittedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedPayment.status]}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Proof of Payment */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Proof of Payment</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedPayment.proofFile}</p>
                      <p className="text-xs text-gray-500">Uploaded on {selectedPayment.submittedDate}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download
                  </button>
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
              {selectedPayment.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPayment.id)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Verify Payment
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
