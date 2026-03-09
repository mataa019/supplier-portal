import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../component/cards';
import FileUpload from '../component/FileUpload';
import Button from '../component/Button';

interface UploadedFile {
  name: string;
  file: File;
}

const documentTypes = [
  { id: 'application_form', label: 'Completed Application Form', required: true },
  { id: 'business_registration', label: 'Business Registration Certificate', required: true },
  { id: 'tax_certificate', label: 'Tax Compliance Certificate (TPIN)', required: true },
  { id: 'financial_statements', label: 'Financial Statements (Last 2 years)', required: false },
  { id: 'company_profile', label: 'Company Profile', required: false },
  { id: 'product_catalog', label: 'Product Catalog / Service Portfolio', required: false },
  { id: 'certifications', label: 'Quality / Industry Certifications', required: false },
  { id: 'references', label: 'Client References / Recommendation Letters', required: false },
];

export default function Documents() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({});
  const [isSaving, setIsSaving] = useState(false);

  const categoryId = searchParams.get('category');

  useEffect(() => {
    // Initialize uploaded files state
    const initialState: Record<string, UploadedFile | null> = {};
    documentTypes.forEach((doc) => {
      initialState[doc.id] = null;
    });
    setUploadedFiles(initialState);
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

  const handleProceed = () => {
    if (requiredDocsUploaded) {
      navigate(`/dashboard/payment?category=${categoryId || ''}`);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Upload Documents</h1>
        <p className="text-gray-600">Upload all required documents to proceed with your application</p>
      </div>

      {/* Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Upload Progress</span>
          <span className="text-sm text-gray-500">{uploadedCount} of {documentTypes.length} uploaded</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(uploadedCount / documentTypes.length) * 100}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Upload Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Required Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Required Documents
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({documentTypes.filter((d) => d.required && uploadedFiles[d.id]).length}/{totalRequired} uploaded)
              </span>
            </h2>
            <div className="space-y-6">
              {documentTypes
                .filter((doc) => doc.required)
                .map((doc) => (
                  <FileUpload
                    key={doc.id}
                    id={doc.id}
                    label={doc.label}
                    required
                    onFileSelect={handleFileSelect(doc.id)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    maxSize={10}
                    hint="PDF, DOC, or image files up to 10MB"
                  />
                ))}
            </div>
          </Card>

          {/* Optional Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Documents
              <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
            </h2>
            <div className="space-y-6">
              {documentTypes
                .filter((doc) => !doc.required)
                .map((doc) => (
                  <FileUpload
                    key={doc.id}
                    id={doc.id}
                    label={doc.label}
                    onFileSelect={handleFileSelect(doc.id)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    maxSize={10}
                    hint="PDF, DOC, or image files up to 10MB"
                  />
                ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="primary"
              onClick={handleProceed}
              disabled={!requiredDocsUploaded}
            >
              Proceed to Payment →
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Document Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Files must be clear and readable</li>
              <li>• Maximum file size: 10MB per document</li>
              <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
              <li>• Ensure documents are not expired</li>
              <li>• All pages must be included</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Upload Status</h3>
            <ul className="text-sm space-y-2">
              {documentTypes.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2">
                  {uploadedFiles[doc.id] ? (
                    <span className="text-green-500">✓</span>
                  ) : doc.required ? (
                    <span className="text-red-500">○</span>
                  ) : (
                    <span className="text-gray-300">○</span>
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
          </Card>

          <Card className="p-6 bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tip</h3>
            <p className="text-sm text-blue-700">
              You can save your progress and return later. Your uploaded documents will be saved as a draft.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
