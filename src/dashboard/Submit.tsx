import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../component/cards';
import Button from '../component/Button';

const categoryInfo: Record<string, string> = {
  'CAT-001': 'Construction Materials',
  'CAT-002': 'Office Supplies',
  'CAT-003': 'IT Equipment & Services',
  'CAT-004': 'Cleaning Services',
  'CAT-005': 'Security Services',
  'CAT-006': 'Catering Services',
};

// Mock data for review
const mockApplicationData = {
  companyInfo: {
    name: 'ABC Construction Ltd',
    registrationNumber: '123456789',
    tpin: '1234567890',
    phone: '+260 97X XXX XXXX',
    email: 'info@abcconstruction.com',
    address: '123 Independence Avenue, Lusaka',
  },
  documents: [
    { name: 'Application Form', status: 'uploaded', file: 'application_form.pdf' },
    { name: 'Business Registration', status: 'uploaded', file: 'registration.pdf' },
    { name: 'Tax Certificate', status: 'uploaded', file: 'tax_cert.pdf' },
    { name: 'Financial Statements', status: 'uploaded', file: 'financials.pdf' },
    { name: 'Company Profile', status: 'uploaded', file: 'profile.pdf' },
  ],
  payment: {
    method: 'Bank Transfer',
    amount: 'K2,550',
    reference: 'TXN-2026030912345',
    status: 'Verified',
  },
};

export default function Submit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get('category') || 'CAT-001';
  
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your application has been submitted for review. You will receive a confirmation email shortly.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Application Reference Number</p>
              <p className="text-2xl font-bold text-blue-600">APP-2026-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-8">
              <p>📧 A confirmation email has been sent to your registered email</p>
              <p>⏱️ Expected processing time: 10-15 business days</p>
              <p>🔔 You will be notified of any status updates</p>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="primary" onClick={() => navigate('/dashboard/applications')}>
                View My Applications
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Review & Submit</h1>
        <p className="text-gray-600">Review your application details before final submission</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Category</h2>
              <p className="text-gray-600">{categoryInfo[categoryId] || 'Unknown Category'}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {categoryId}
            </span>
          </div>
        </Card>

        {/* Company Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Company Information</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Company Name</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Registration Number</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.registrationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">TPIN</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.tpin}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-800">{mockApplicationData.companyInfo.address}</p>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Uploaded Documents</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <ul className="space-y-3">
            {mockApplicationData.documents.map((doc, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-800">{doc.name}</span>
                </div>
                <span className="text-sm text-gray-500">{doc.file}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Payment */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {mockApplicationData.payment.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-800">{mockApplicationData.payment.method}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount Paid</p>
              <p className="font-medium text-gray-800">{mockApplicationData.payment.amount}</p>
            </div>
            <div>
              <p className="text-gray-500">Reference</p>
              <p className="font-medium text-gray-800">{mockApplicationData.payment.reference}</p>
            </div>
          </div>
        </Card>

        {/* Terms and Conditions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto text-sm text-gray-600 mb-4">
            <p className="mb-3">By submitting this application, I hereby declare that:</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>All information provided in this application is true, complete, and accurate to the best of my knowledge.</li>
              <li>I have read and understood the supplier registration requirements and guidelines.</li>
              <li>I understand that any false or misleading information may result in rejection of the application or termination of supplier status.</li>
              <li>I authorize the verification of all documents and information provided.</li>
              <li>I agree to comply with all applicable laws, regulations, and the organization's supplier code of conduct.</li>
              <li>I understand that the application fee is non-refundable once processed.</li>
              <li>I will notify the organization of any material changes to the information provided.</li>
            </ol>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the terms and conditions, and confirm that all information provided is accurate.
            </span>
          </label>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Save as Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!agreed || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
