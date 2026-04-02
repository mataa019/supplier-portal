import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { SupplierApplication, AdminSupplier } from '../../apiservice/adminModels';
import { downloadAdminApplicationDocument, downloadMergedApplicationDocuments } from '../../apiservice/adminServices';

interface ApplicationDetailsModalProps {
  open: boolean;
  application: SupplierApplication | null;
  supplier: AdminSupplier | undefined;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDownloadPdf?: () => void;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  open,
  application,
  supplier,
  onClose,
  onApprove,
  onReject,
  onDownloadPdf,
  statusColors,
  statusLabels,
}) => {
  if (!open || !application) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
            <p className="text-sm text-gray-500">{application.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Application Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Application Information</h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500">Supplier</p>
                <p className="text-sm font-medium text-gray-900">{supplier?.companyName || application.supplierId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">{application.category?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  statusColors[application.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                }`}>
                  {statusLabels[application.status as keyof typeof statusLabels] || application.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Application Fee</p>
                <p className="text-lg font-bold text-gray-900">{application.category?.applicationFee}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium text-gray-900">{application.submittedAt ? application.submittedAt.split('T')[0] : ''}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Submitted Documents</h4>
            <div className="space-y-2">
              {application.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{doc.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600">Uploaded</span>
                    <button
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                      onClick={async () => {
                        try {
                          const blob = await downloadAdminApplicationDocument(application.id, doc.id);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = doc.fileName || 'document';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          alert('Failed to download document');
                        }
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
              {application.documents.length === 0 && (
                <div className="text-xs text-gray-500">No documents submitted.</div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                if (!application) return;
                try {
                  const blob = await downloadMergedApplicationDocuments(application.id);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `application_${application.id}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  alert('Failed to download merged document');
                }
              }}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download Application PDF
            </button>
            {application.status === 'paid' && (
              <>
                <button
                  onClick={() => onReject(application.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => onApprove(application.id)}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve Application
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;