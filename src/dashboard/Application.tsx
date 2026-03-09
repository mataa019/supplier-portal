import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../component/cards';
import Select from '../component/Select';
import Button from '../component/Button';

const categories = [
  { value: 'CAT-001', label: 'Construction Materials - K2,500' },
  { value: 'CAT-002', label: 'Office Supplies - K1,500' },
  { value: 'CAT-003', label: 'IT Equipment & Services - K3,000' },
  { value: 'CAT-004', label: 'Cleaning Services - K1,000' },
  { value: 'CAT-005', label: 'Security Services - K2,000' },
  { value: 'CAT-006', label: 'Catering Services - K1,500' },
];

const categoryRequirements: Record<string, string[]> = {
  'CAT-001': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Financial Statements (Last 2 years)',
    'Product Catalog with Pricing',
    'Quality Certifications (ISO, etc.)',
    'Proof of Physical Address',
  ],
  'CAT-002': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Product Price List',
    'Proof of Stock/Inventory',
    'Delivery Capability Evidence',
  ],
  'CAT-003': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Technical Team Certifications',
    'Partnership/Distributor Agreements',
    'Service Portfolio',
    'Client References',
  ],
  'CAT-004': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Staff List with Qualifications',
    'Equipment Inventory',
    'Insurance Certificate',
  ],
  'CAT-005': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Security License from Regulatory Body',
    'Insurance Certificate',
    'Staff Police Clearance',
    'Training Certificates',
  ],
  'CAT-006': [
    'Business Registration Certificate',
    'Tax Compliance Certificate (TPIN)',
    'Health & Safety Certification',
    'Food Handler Certificates',
    'Sample Menu with Pricing',
  ],
};

export default function Application() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const requirements = selectedCategory ? categoryRequirements[selectedCategory] || [] : [];

  const handleDownloadForm = () => {
    // In real app, this would download a PDF
    alert('Application form download started. Check your downloads folder.');
  };

  const handleProceed = () => {
    if (selectedCategory) {
      navigate(`/dashboard/documents?category=${selectedCategory}`);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Apply for Category</h1>
        <p className="text-gray-600">Select a category and download the application form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Category</h2>
            <Select
              id="category"
              label="Supplier Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              placeholder="Select a category"
              required
            />
          </Card>

          {/* Download Application Form */}
          {selectedCategory && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Download Application Form</h2>
              <p className="text-gray-600 mb-4">
                Download the application form, fill it out completely, and prepare it for upload.
              </p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl">📄</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Application Form</p>
                  <p className="text-sm text-gray-500">PDF Document • 2.5 MB</p>
                </div>
                <button
                  onClick={handleDownloadForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
              </div>
            </Card>
          )}

          {/* Required Documents */}
          {selectedCategory && requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h2>
              <p className="text-gray-600 mb-4">
                Please ensure you have the following documents ready for upload:
              </p>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Proceed Button */}
          {selectedCategory && (
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleProceed}>
                Proceed to Document Upload →
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Application Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Fill out all sections of the form</li>
              <li>• Use black or blue ink if filling manually</li>
              <li>• Ensure all information is accurate</li>
              <li>• Sign where indicated</li>
              <li>• Scan the completed form clearly</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Contact our support team for assistance with your application.
            </p>
            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <span>📧</span>
                <span>suppliers@portal.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>+260 XXX XXXXXX</span>
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
            <p className="text-sm text-yellow-700">
              Incomplete or falsified applications will be rejected. Ensure all documents are valid and up to date.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
