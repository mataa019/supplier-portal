import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import type { ApplicationDocument, ApplicationResponse } from '../apiservice/Apiservice';

interface ApplicationDetailsProps {
  application: ApplicationResponse;
  documents: ApplicationDocument[];
  onClose: () => void;
  onWithdraw: () => void;
  withdrawing: boolean;
  onDelete?: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  documents,
  onClose,
  onWithdraw,
  withdrawing,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Application Details</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-1">Category</p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{application.category?.name || '—'}</span>
            {/* Optionally add a Change button here if needed */}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Fee</p>
          <p className="font-medium text-gray-900">K{application.category?.applicationFee ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="font-medium text-gray-900">{application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Submitted At</p>
          <p className="font-medium text-gray-900">{application.submittedAt ? new Date(application.submittedAt).toLocaleString() : '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Created At</p>
          <p className="font-medium text-gray-900">{application.createdAt ? new Date(application.createdAt).toLocaleString() : '—'}</p>
        </div>
        {/* Withdraw Button (show for eligible statuses) */}
        {['submitted', 'pending', 'payment_pending'].includes(application.status) && onWithdraw && (
          <button
            onClick={onWithdraw}
            disabled={withdrawing}
            className={`mt-2 mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
          </button>
        )}
        {/* Delete Button (show for withdrawn status) */}
        {application.status === 'withdrawn' && onDelete && (
          <button
            onClick={onDelete}
            className="mt-2 mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Delete Application
          </button>
        )}
        {/* Documents */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Documents</p>
          {((application.documents && application.documents.length > 0) || (documents && documents.length > 0)) ? (
            <ul className="list-disc ml-5">
              {(application.documents && application.documents.length > 0 ? application.documents : documents).map((doc) => (
                <li key={doc.id} className="text-gray-700 flex items-center gap-2">
                  <CheckCircleSolid className="w-4 h-4 text-green-600" />
                  {doc.fileName} <span className="text-xs text-gray-400">({doc.type})</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-gray-500">No documents found</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
