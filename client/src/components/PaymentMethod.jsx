import { useState } from 'react';
import { CreditCard, QrCode, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

// QR Code Display Component
const QRCodeDisplay = ({ amount, companyDetails }) => (
  <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="text-center space-y-4">
      {/* QR Code Placeholder - Replace with actual QR generation */}
      <div className="w-48 h-48 border-2 border-gray-400 rounded-lg flex items-center justify-center bg-white">
        <QrCode size={120} className="text-gray-600" />
      </div>
      
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-800">Company Payment QR</p>
        <p className="text-2xl font-bold text-blue-600">${amount}</p>
        {companyDetails && (
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Account:</strong> {companyDetails.accountName}</p>
            <p><strong>Bank:</strong> {companyDetails.bankName}</p>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          Scan this QR code with your banking app to make the payment
        </p>
      </div>
    </div>
  </div>
);

// Payment Method Selection Component
const PaymentMethodSelector = ({ selectedMethod, onMethodChange, amount }) => {
  const paymentMethods = [
    {
      id: 'cash',
      title: 'Cash Payment',
      description: 'Pay at office during appointment',
      icon: CreditCard,
      color: 'green',
      features: ['No processing fees', 'Pay on arrival', 'Instant confirmation']
    },
    {
      id: 'qr',
      title: 'QR Payment',
      description: 'Pay online via QR code',
      icon: QrCode,
      color: 'blue',
      features: ['Instant payment', 'Digital receipt', 'Secure transaction']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Payment Method</h3>
        <p className="text-2xl font-bold text-blue-600">Appointment Fee: ${amount}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? `border-${method.color}-500 bg-${method.color}-50 shadow-md`
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  isSelected 
                    ? `bg-${method.color}-500 text-white` 
                    : `bg-${method.color}-100 text-${method.color}-600`
                }`}>
                  <IconComponent size={24} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{method.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  
                  <ul className="space-y-1">
                    {method.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${method.color}-400 mr-2`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {isSelected && (
                  <div className={`w-6 h-6 rounded-full bg-${method.color}-500 flex items-center justify-center`}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Payment Method Component
export default function PaymentMethod({
  amount = 100,
  selectedMethod,
  onMethodChange,
  onBack,
  onContinue,
  customerEmail,
  onEmailChange,
  isSubmitting = false,
  error = null,
  companyDetails = {
    accountName: "ABC Real Estate Ltd.",
    bankName: "National Bank",
    accountNumber: "****1234"
  }
}) {
  const [showQRStep, setShowQRStep] = useState(false);

  const handleMethodSelect = (method) => {
    onMethodChange(method);
    if (method === 'qr') {
      setShowQRStep(true);
    } else {
      setShowQRStep(false);
    }
  };

  const handleContinue = () => {
    if (selectedMethod === 'qr' && !customerEmail.trim()) {
      return; // Email validation will be handled by parent component
    }
    onContinue();
  };

  const handleBack = () => {
    if (showQRStep) {
      setShowQRStep(false);
    } else {
      onBack();
    }
  };

  if (showQRStep && selectedMethod === 'qr') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Payment Methods
          </button>
          <h3 className="text-lg font-semibold text-gray-800">Complete QR Payment</h3>
        </div>

        {/* QR Code Display */}
        <QRCodeDisplay amount={amount} companyDetails={companyDetails} />

        {/* Payment Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Scan the QR code with your mobile banking app</li>
                <li>Verify the amount (${amount}) and recipient details</li>
                <li>Complete the payment</li>
                <li>Enter your email below for receipt delivery</li>
                <li>Click "Submit Payment" once completed</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="receipt-email" className="block text-sm font-medium text-gray-700">
            Email Address for Receipt *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              id="receipt-email"
              value={customerEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            You'll receive a receipt at this email once payment is verified by our team
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleContinue}
          disabled={isSubmitting || !customerEmail.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting Payment...' : 'Submit Payment Confirmation'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={handleMethodSelect}
        amount={amount}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedMethod || isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {selectedMethod === 'cash' ? 'Book Appointment' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
}