import { useState } from 'react';
import { Download, Printer, Mail, CheckCircle, Calendar, MapPin, User, CreditCard } from 'lucide-react';

// Receipt Display Component
export default function Receipt({
  receiptData,
  onDownload,
  onClose,
  showActions = true,
  compact = false
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!receiptData) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-gray-500 text-center">No receipt data available</p>
      </div>
    );
  }

  const {
    receiptNumber,
    generatedDate,
    appointment
  } = receiptData;

  return (
    <div className={`bg-white border border-gray-300 rounded-lg ${compact ? 'p-4' : 'p-6'} print:shadow-none`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 print:mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <h2 className={`font-bold text-gray-800 ${compact ? 'text-lg' : 'text-xl'}`}>
              Payment Receipt
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Receipt #{receiptNumber}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Generated on</p>
          <p className="font-semibold text-gray-800">
            {new Date(generatedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-6 print:mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">ABC Real Estate Ltd.</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>123 Business Street</p>
          <p>City, State 12345</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@abcrealestate.com</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-6 print:mb-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <User size={16} className="mr-2" />
          Customer Information
        </h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-800">{appointment.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{appointment.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-800">{appointment.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Appointment ID</p>
              <p className="font-medium text-gray-800">{appointment._id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="mb-6 print:mb-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Calendar size={16} className="mr-2" />
          Appointment Details
        </h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-800">
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="font-medium text-gray-800">{appointment.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-medium text-gray-800 capitalize">{appointment.serviceType}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-800 flex items-center">
                <MapPin size={14} className="mr-1" />
                {appointment.location || 'Office Location'}
              </p>
            </div>
            {appointment.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-medium text-gray-800">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6 print:mb-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <CreditCard size={16} className="mr-2" />
          Payment Information
        </h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-800 capitalize">
                {appointment.payment.method === 'qr' ? 'QR Code Payment' : 'Cash Payment'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                appointment.payment.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : appointment.payment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {appointment.payment.status.charAt(0).toUpperCase() + appointment.payment.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transaction Date</p>
              <p className="font-medium text-gray-800">
                {appointment.payment.paidAt 
                  ? new Date(appointment.payment.paidAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Pending'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reference Number</p>
              <p className="font-medium text-gray-800">{appointment.payment.transactionId || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-t border-gray-200 pt-4 mb-6 print:mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Appointment Fee</span>
          <span className="font-medium text-gray-800">${appointment.payment.amount}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Processing Fee</span>
          <span className="font-medium text-gray-800">$0.00</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
          <span className="text-gray-800">Total Paid</span>
          <span className="text-green-600">${appointment.payment.amount}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 print:mb-4">
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-2">Important Information:</p>
          <ul className="space-y-1 text-xs">
            <li>• This receipt serves as proof of payment for your appointment</li>
            <li>• Please arrive 10 minutes before your scheduled appointment time</li>
            <li>• For any changes or cancellations, contact us at least 24 hours in advance</li>
            <li>• Keep this receipt for your records</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <Download size={16} className="mr-2" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer size={16} className="mr-2" />
            Print Receipt
          </button>
          
          <button
            onClick={() => {
              const subject = `Receipt - Appointment ${receiptNumber}`;
              const body = `Please find attached your payment receipt for appointment ${receiptNumber}.`;
              window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail size={16} className="mr-2" />
            Email Receipt
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      )}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}