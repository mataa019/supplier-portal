import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  DocumentCheckIcon,
  ClockIcon,
  DocumentIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import FileUpload from '../component/FileUpload';
import Button from '../component/Button';
import LoadingOverlay from '../component/LoadingOverlay';
import { createApplication, uploadApplicationDocument, submitApplication, type ApplicationResponse } from '../apiservice/Apiservice';

interface UploadedFile {
  name: string;
  file: File;
}

const documentTypes = [
  { id: 'application_form', label: 'Completed Application Form', required: true },
  { id: 'business_registration', label: 'Business Registration Certificate', required: true },
  { id: 'tax_certificate', label: 'Tax Compliance Certificate (TPIN)', required: true },
  { id: 'company_profile', label: 'Company Profile', required: false },
  { id: 'references', label: 'Current trade referencess', required: false },
];

export default function Documents() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({});
  // Track upload status for each document
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});
  const [isSaving, setIsSaving] = useState(false);


  const categoryId = searchParams.get('category');

  useEffect(() => {
    // Initialize uploaded files state and upload status
    const initialFiles: Record<string, UploadedFile | null> = {};
    const initialStatus: Record<string, 'idle'> = {};
    documentTypes.forEach((doc) => {
      initialFiles[doc.id] = null;
      initialStatus[doc.id] = 'idle';
    });
    setUploadedFiles(initialFiles);
    setUploadStatus(initialStatus);
  }, []);

  const handleFileSelect = (docId: string) => (file: File | null) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: file ? { name: file.name, file } : null,
    }));
  };

  const requiredDocsUploaded = documentTypes
    .filter((doc) => doc.required)
    .every((doc) => uploadedFiles[doc.id] !== null);

  const uploadedCount = Object.values(uploadedFiles).filter(Boolean).length;
  const totalRequired = documentTypes.filter((doc) => doc.required).length;

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Draft saved successfully!');
  };

  // Create application and upload documents, then enable submit
  const [uploading, setUploading] = useState(false);
  const handleProceed = async () => {
    if (!categoryId) return;
    setUploading(true);
    try {
      const app = await createApplication({ categoryId });
      let allSuccess = true;
      for (const doc of documentTypes) {
        const uploaded = uploadedFiles[doc.id];
        if (uploaded) {
          setUploadStatus((prev) => ({ ...prev, [doc.id]: 'uploading' }));
          try {
            await uploadApplicationDocument({
              applicationId: app.id,
              file: uploaded.file,
              type: doc.id,
              description: doc.label,
            });
            setUploadStatus((prev) => ({ ...prev, [doc.id]: 'success' }));
          } catch (e) {
            // Log error details for debugging
            console.error('Upload failed for', doc.id, e);
            setUploadStatus((prev) => ({ ...prev, [doc.id]: 'error' }));
            allSuccess = false;
          }
        }
      }
      if (allSuccess) {
        setShowSubmit(true);
        setCreatedAppId(app.id);
      } else {
        alert('Some documents failed to upload. Please retry.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create application or upload documents');
    } finally {
      setUploading(false);
    }
  };

  // State for submit step
  const [showSubmit, setShowSubmit] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  // Handle submit
  const handleSubmitApplication = async () => {
    if (!createdAppId) return;
    try {
      await submitApplication(createdAppId, { declarationAccepted: true });
      navigate('/dashboard/applications');
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      {isSaving && <LoadingOverlay message="Saving Draft..." />}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Upload Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Upload all required documents to proceed with your application</p>
      </div>

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">Upload Progress</span>
          <span className="text-sm text-gray-500">{uploadedCount} of {documentTypes.length} uploaded</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all"
            style={{ width: `${(uploadedCount / documentTypes.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Upload Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Required Documents */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Required Documents
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({documentTypes.filter((d) => d.required && uploadedFiles[d.id]).length}/{totalRequired} uploaded)
              </span>
            </h2>
            <div className="space-y-6">
              {documentTypes
                .filter((doc) => doc.required)
                .map((doc) => (
                  <div key={doc.id} className="space-y-1">
                    <FileUpload
                      id={doc.id}
                      label={doc.label}
                      required
                      onFileSelect={handleFileSelect(doc.id)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      maxSize={10}
                      hint="PDF, DOC, or image files up to 10MB"
                    />
                    {uploadStatus[doc.id] === 'uploading' && (
                      <span className="text-xs text-blue-600">Uploading...</span>
                    )}
                    {uploadStatus[doc.id] === 'success' && (
                      <span className="text-xs text-green-600">Uploaded successfully</span>
                    )}
                    {uploadStatus[doc.id] === 'error' && (
                      <span className="text-xs text-red-600">Upload failed. Please retry.</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Optional Documents */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Additional Documents
              <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
            </h2>
            <div className="space-y-6">
              {documentTypes
                .filter((doc) => !doc.required)
                .map((doc) => (
                  <div key={doc.id} className="space-y-1">
                    <FileUpload
                      id={doc.id}
                      label={doc.label}
                      onFileSelect={handleFileSelect(doc.id)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      maxSize={10}
                      hint="PDF, DOC, or image files up to 10MB"
                    />
                    {uploadStatus[doc.id] === 'uploading' && (
                      <span className="text-xs text-blue-600">Uploading...</span>
                    )}
                    {uploadStatus[doc.id] === 'success' && (
                      <span className="text-xs text-green-600">Uploaded successfully</span>
                    )}
                    {uploadStatus[doc.id] === 'error' && (
                      <span className="text-xs text-red-600">Upload failed. Please retry.</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            {!showSubmit ? (
              <button
                onClick={handleProceed}
                disabled={!requiredDocsUploaded}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Continue
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitApplication}
                disabled={uploading}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Submit Application'}
                <CheckCircleSolid className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2">
                <DocumentCheckIcon className="w-4 h-4 text-gray-500" />
                Files must be clear and readable
              </li>
              <li className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                Maximum file size: 10MB per document
              </li>
              <li className="flex items-center gap-2">
                <DocumentIcon className="w-4 h-4 text-gray-500" />
                Accepted formats: PDF, DOC, DOCX, JPG, PNG
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                Ensure documents are not expired
              </li>
              <li className="flex items-center gap-2">
                <DocumentDuplicateIcon className="w-4 h-4 text-gray-500" />
                All pages must be included
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Upload Status</h3>
            <ul className="text-sm space-y-2">
              {documentTypes.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2">
                  {uploadedFiles[doc.id] ? (
                    <CheckCircleSolid className="w-4 h-4 text-green-600" />
                  ) : doc.required ? (
                    <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircleIcon className="w-4 h-4 text-gray-300" />
                  )}
                  <span className={uploadedFiles[doc.id] ? 'text-green-700' : 'text-gray-600'}>
                    {doc.label}
                  </span>
                  {doc.required && !uploadedFiles[doc.id] && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

    
        </div>
      </div>
    </div>
  );
}
