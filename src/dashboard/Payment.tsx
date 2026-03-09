import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import FileUpload from '../component/FileUpload';
import Button from '../component/Button';
import TextInput from '../component/TextInput';

const categoryFees: Record<string, { name: string; fee: number }> = {
  'CAT-001': { name: 'Construction Materials', fee: 2500 },
  'CAT-002': { name: 'Office Supplies', fee: 1500 },
  'CAT-003': { name: 'IT Equipment & Services', fee: 3000 },
  'CAT-004': { name: 'Cleaning Services', fee: 1000 },
  'CAT-005': { name: 'Security Services', fee: 2000 },
  'CAT-006': { name: 'Catering Services', fee: 1500 },
};

const bankDetails = {
  bankName: 'Zambia National Commercial Bank (ZANACO)',
  accountName: 'Supplier Portal Trust Account',
  accountNumber: '0012345678901',
  branchCode: '001',
  swiftCode: 'ABORZMLU',
};

type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'card';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get('category') || 'CAT-001';
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const categoryInfo = categoryFees[categoryId] || { name: 'Unknown Category', fee: 0 };

  const handleProceed = async () => {
    if (!proofOfPayment && paymentMethod !== 'card') {
      alert('Please upload proof of payment');
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    
    navigate(`/dashboard/submit?category=${categoryId}`);
  };

  const isValid = paymentMethod === 'card' || (proofOfPayment && transactionRef);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Payment</h1>
        <p className="text-sm text-gray-500 mt-1">Complete payment for your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
         
          {/* Payment Method Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer', Icon: BuildingLibraryIcon },
                { id: 'mobile_money', label: 'Mobile Money', Icon: DevicePhoneMobileIcon },
                { id: 'card', label: 'Card Payment', Icon: CreditCardIcon },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-4 rounded-lg border-2 transition-all text-left sm:text-center ${
                    paymentMethod === method.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.Icon className={`w-6 h-6 mb-2 sm:mx-auto ${paymentMethod === method.id ? 'text-red-600' : 'text-gray-500'}`} />
                  <div className="font-medium text-gray-900 text-sm">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Bank Transfer Instructions</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 mb-3">
                  Please make payment to the following account and upload proof of payment:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium text-gray-900">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium text-gray-900">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium text-gray-900">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Branch Code:</span>
                    <span className="font-medium text-gray-900">{bankDetails.branchCode}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-red-600">Your TPIN Number</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TextInput
                  id="transactionRef"
                  label="Transaction Reference Number"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Enter bank transaction reference"
                  required
                />

                <FileUpload
                  id="proof_of_payment"
                  label="Proof of Payment"
                  required
                  onFileSelect={setProofOfPayment}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  hint="Upload bank deposit slip or transfer confirmation"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'mobile_money' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Mobile Money Instructions</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 mb-3">
                  Send payment to the following mobile money account:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">MTN MoMo:</span>
                    <span className="font-medium text-gray-900">+260 97X XXX XXXX</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Airtel Money:</span>
                    <span className="font-medium text-gray-900">+260 96X XXX XXXX</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-green-600">Your Company Name</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TextInput
                  id="transactionRef"
                  label="Transaction ID"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Enter mobile money transaction ID"
                  required
                />

                <FileUpload
                  id="proof_of_payment"
                  label="Screenshot of Payment Confirmation"
                  required
                  onFileSelect={setProofOfPayment}
                  accept=".jpg,.jpeg,.png,.pdf"
                  maxSize={5}
                  hint="Upload confirmation message or screenshot"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Card Payment</h2>
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center">
                <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  You will be redirected to our secure payment gateway to complete your card payment.
                </p>
                <p className="text-sm text-gray-500">
                  We accept Visa, Mastercard, and other major cards.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleProceed}
              disabled={!isValid || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Review →'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Security</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>All payments are secured with encryption</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Official receipts provided for all payments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>24/7 payment verification support</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Refund Policy</h3>
            <p className="text-sm text-gray-600">
              Application fees are non-refundable once processed. However, if your application is rejected due to our error, a full refund will be provided within 14 business days.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Important</h3>
                <p className="text-sm text-yellow-700">
                  Ensure the payment reference includes your TPIN or Company Name for quick verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
