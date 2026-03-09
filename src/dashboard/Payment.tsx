import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../component/cards';
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
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    
    navigate(`/dashboard/submit?category=${categoryId}`);
  };

  const isValid = paymentMethod === 'card' || (proofOfPayment && transactionRef);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
        <p className="text-gray-600">Complete payment for your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Fee Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-800">{categoryInfo.name}</span>
              </div>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Application Fee</span>
                <span className="font-medium text-gray-800">K{categoryInfo.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-medium text-gray-800">K50</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-800">Total Amount</span>
                <span className="font-bold text-blue-600">K{(categoryInfo.fee + 50).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
                { id: 'mobile_money', label: 'Mobile Money', icon: '📱' },
                { id: 'card', label: 'Card Payment', icon: '💳' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="font-medium text-gray-800">{method.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Payment Instructions */}
          {paymentMethod === 'bank_transfer' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Bank Transfer Instructions</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-3">
                  Please make payment to the following account and upload proof of payment:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium text-gray-800">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium text-gray-800">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium text-gray-800">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch Code:</span>
                    <span className="font-medium text-gray-800">{bankDetails.branchCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-blue-600">Your TPIN Number</span>
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
            </Card>
          )}

          {paymentMethod === 'mobile_money' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mobile Money Instructions</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 mb-3">
                  Send payment to the following mobile money account:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">MTN MoMo:</span>
                    <span className="font-medium text-gray-800">+260 97X XXX XXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Airtel Money:</span>
                    <span className="font-medium text-gray-800">+260 96X XXX XXXX</span>
                  </div>
                  <div className="flex justify-between">
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
            </Card>
          )}

          {paymentMethod === 'card' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Card Payment</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">💳</div>
                <p className="text-gray-600 mb-4">
                  You will be redirected to our secure payment gateway to complete your card payment.
                </p>
                <p className="text-sm text-gray-500">
                  We accept Visa, Mastercard, and other major cards.
                </p>
              </div>
            </Card>
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
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Security</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">🔒</span>
                <span>All payments are secured with encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Official receipts provided for all payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>24/7 payment verification support</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Refund Policy</h3>
            <p className="text-sm text-gray-600">
              Application fees are non-refundable once processed. However, if your application is rejected due to our error, a full refund will be provided within 14 business days.
            </p>
          </Card>

          <Card className="p-6 bg-yellow-50 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
            <p className="text-sm text-yellow-700">
              Ensure the payment reference includes your TPIN or Company Name for quick verification.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
