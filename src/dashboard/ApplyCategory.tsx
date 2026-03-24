import { useState, useEffect } from 'react';
import { fetchSupplierCategories, fetchSupplierCategoryById, type SupplierCategory,  } from '../apiservice/Apiservice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PencilIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';




export default function Application() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<SupplierCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSupplierCategories()
      .then((data) => setCategories(data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      fetchSupplierCategoryById(selectedCategory)
        .then((data) => setCategoryDetails(data))
        .catch(() => setCategoryDetails(null))
        .finally(() => setLoading(false));
    } else {
      setCategoryDetails(null);
    }
  }, [selectedCategory]);

  const requirements = categoryDetails?.Requirements
    ? categoryDetails.Requirements.split(',').map((r) => r.trim())
    : [];

  const handleDownloadForm = () => {
    if (categoryDetails?.templateDownloadUrl) {
      window.open(categoryDetails.templateDownloadUrl, '_blank');
    } else {
      alert('No template available for this category.');
    }
  };

  const handleProceed = () => {
    if (selectedCategory) {
      navigate(`/dashboard/documents?category=${selectedCategory}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Apply for Category</h1>
        <p className="text-sm text-gray-500 mt-1">Select a category and download the application form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Step 1: Select Category</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} - K{cat.applicationFee}
                </option>
              ))}
            </select>
          </div>

          {/* Download Application Form */}
          {selectedCategory && categoryDetails && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Step 2: Download Application Form</h2>
              <p className="text-sm text-gray-600 mb-4">
                Download the application form, fill it out completely, and prepare it for upload.
              </p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="p-3 bg-red-50 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Application Form</p>
                  <p className="text-xs text-gray-500">PDF Document</p>
                </div>
                <button
                  onClick={handleDownloadForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={!categoryDetails.hasTemplateDocument}
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Required Documents */}
          {selectedCategory && requirements.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Required Documents</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please ensure you have the following documents ready for upload:
              </p>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Proceed Button */}
          {selectedCategory && (
            <div className="flex justify-end">
              <button
                onClick={handleProceed}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Proceed to Document Upload
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Application Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2">
                <PencilIcon className="w-4 h-4 text-gray-400" />
                Fill out all sections of the form
              </li>
              <li className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                Use black or blue ink if filling manually
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                Ensure all information is accurate
              </li>
              <li className="flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-400" />
                Sign where indicated
              </li>
              <li className="flex items-center gap-2">
                <DocumentCheckIcon className="w-4 h-4 text-gray-400" />
                Scan the completed form clearly
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact our support team for assistance with your application.
            </p>
            <div className="text-sm space-y-3">
              <p className="flex items-center gap-3 text-gray-600">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                suppliers@minetzambia.com
              </p>
              <p className="flex items-center gap-3 text-gray-600">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                +260 XXX XXXXXX
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Important</h3>
                <p className="text-sm text-yellow-700">
                  Incomplete or falsified applications will be rejected. Ensure all documents are valid and up to date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
