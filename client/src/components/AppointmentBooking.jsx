import { useState } from 'react';
import { CreditCard, QrCode, Mail, Download, CheckCircle } from 'lucide-react';

// Mock QR Code component (you can replace with actual QR generation)
const QRCodeDisplay = ({ qrData }) => (
  <div className="flex items-center justify-center p-8 border-2 border-gray-300 rounded-lg bg-gray-50">
    <div className="text-center">
      <QrCode size={120} className="mx-auto mb-4 text-gray-600" />
      <p className="text-sm text-gray-600">Company Payment QR Code</p>
      <p className="text-xs text-gray-500 mt-2">Scan to pay ${qrData.amount}</p>
    </div>
  </div>
);

export default function AppointmentBooking({ listing, agents, onClose }) {
  const [currentStep, setCurrentStep] = useState('booking');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    agentId: '',
    message: '',
    paymentMethod: '',
    paymentAmount: 100, // Default appointment fee
    customerEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 'booking') {
      // Validate basic appointment fields
      if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.agentId || !formData.paymentMethod) {
        setError('Please fill in all required fields including payment method');
        return;
      }

      // If QR payment selected, show QR step
      if (formData.paymentMethod === 'qr') {
        setCurrentStep('qr-payment');
        return;
      }

      // If cash payment, proceed directly to submission
      if (formData.paymentMethod === 'cash') {
        await submitAppointment();
      }
    } else if (currentStep === 'qr-payment') {
      // Validate customer email for QR payment
      if (!formData.customerEmail) {
        setError('Please enter your email address for payment confirmation');
        return;
      }
      await submitAppointment();
    }
  };

  const submitAppointment = async () => {
    setIsSubmitting(true);
    setError(null);

    const listingId = listing._id;

    const requestBody = {
      property: listingId,
      agent: formData.agentId,
      date: formData.date,
      time: formData.time,
      message: formData.message || '',
      clientInfo: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim()
      },
      propertyAddress: listing.address,
      payment: {
        method: formData.paymentMethod,
        amount: formData.paymentAmount,
        ...(formData.paymentMethod === 'qr' && {
          qrDetails: {
            customerEmail: formData.customerEmail.trim()
          }
        })
      }
    };

    try {
      const token = localStorage.getItem('access_token') || 
                   sessionStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   sessionStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/appointment/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success === false) {
        setError(data.message || 'Failed to create appointment');
        return;
      }

      if (!res.ok) {
        setError(data.message || `Server error: ${res.status}`);
        return;
      }

      setAppointmentData(data.appointment);
      setSubmissionSuccess(true);
      setCurrentStep('success');
    } catch (error) {
      console.error('Fetch error:', error);
      setIsSubmitting(false);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const downloadReceipt = async () => {
    if (!appointmentData?._id) return;

    try {
      const token = localStorage.getItem('access_token') || 
                   sessionStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   sessionStorage.getUser('token');

      const response = await fetch(`/api/appointment/${appointmentData._id}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const receiptData = await response.json();
        
        // Create and download receipt
        const receiptContent = `
          APPOINTMENT RECEIPT
          ==================
          Receipt #: ${receiptData.receipt.receiptNumber}
          Date: ${new Date(receiptData.receipt.generatedDate).toLocaleDateString()}
          
          Appointment Details:
          - Property: ${receiptData.receipt.appointment.property.name}
          - Date: ${new Date(receiptData.receipt.appointment.date).toLocaleDateString()}
          - Time: ${receiptData.receipt.appointment.time}
          - Agent: ${receiptData.receipt.appointment.agent.username}
          - Amount: $${receiptData.receipt.appointment.payment.amount}
          - Payment Method: ${receiptData.receipt.appointment.payment.method.toUpperCase()}
          
          Client Information:
          - Name: ${receiptData.receipt.appointment.client.name}
          - Email: ${receiptData.receipt.appointment.client.email}
          - Phone: ${receiptData.receipt.appointment.client.phone}
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${receiptData.receipt.receiptNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  if (currentStep === 'success' && submissionSuccess) {
    return (
      <div className='bg-green-50 border border-green-200 rounded-lg p-6 mt-4'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='text-green-600' size={24} />
            <h3 className='text-green-800 font-semibold text-lg'>
              {formData.paymentMethod === 'cash' ? 'Appointment Booked!' : 'Payment Submitted!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className='text-green-600 hover:text-green-800'
          >
            ✕
          </button>
        </div>
        
        <div className='space-y-3'>
          <p className='text-green-700'>
            {formData.paymentMethod === 'cash' 
              ? 'Your appointment has been booked successfully. Payment will be collected at the office.'
              : 'Your payment has been submitted for verification. You will receive a receipt once the agent verifies your payment.'
            }
          </p>
          
          <div className='bg-white rounded-lg p-4 border border-green-200'>
            <h4 className='font-semibold text-green-800 mb-2'>Appointment Details:</h4>
            <div className='text-sm text-green-700 space-y-1'>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Agent:</strong> {appointmentData?.agent?.username}</p>
              <p><strong>Payment:</strong> ${formData.paymentAmount} ({formData.paymentMethod.toUpperCase()})</p>
              {formData.paymentMethod === 'qr' && (
                <p><strong>Receipt Email:</strong> {formData.customerEmail}</p>
              )}
            </div>
          </div>

          {appointmentData?.payment?.status === 'verified' && appointmentData?.receipt?.downloadable && (
            <button
              onClick={downloadReceipt}
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              <Download size={16} />
              Download Receipt
            </button>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'qr-payment') {
    return (
      <div className='bg-white border border-gray-300 rounded-lg p-6 mt-4'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-gray-800 font-semibold text-lg'>Complete Payment</h3>
          <button
            onClick={() => setCurrentStep('booking')}
            className='text-gray-600 hover:text-gray-800'
          >
            ← Back
          </button>
        </div>

        <div className='space-y-6'>
          <div className='text-center'>
            <h4 className='font-semibold text-gray-800 mb-2'>Scan QR Code to Pay</h4>
            <p className='text-gray-600 mb-4'>Amount: ${formData.paymentAmount}</p>
            <QRCodeDisplay qrData={{ amount: formData.paymentAmount }} />
          </div>

          <div className='border-t pt-4'>
            <label htmlFor='customerEmail' className='block text-sm font-medium text-gray-700 mb-2'>
              Your Email Address (for receipt) *
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <input
                type='email'
                id='customerEmail'
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder='Enter your email address'
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              You'll receive a receipt at this email once payment is verified
            </p>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors'
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Payment Submitted'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-300 rounded-lg p-6 mt-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-gray-800 font-semibold text-lg'>Book Appointment</h3>
        <button
          onClick={onClose}
          className='text-gray-600 hover:text-gray-800'
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Personal Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name *
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
              Phone Number *
            </label>
            <input
              type='tel'
              id='phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
            Email Address *
          </label>
          <input
            type='email'
            id='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        {/* Appointment Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-1'>
              Preferred Date *
            </label>
            <input
              type='date'
              id='date'
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label htmlFor='time' className='block text-sm font-medium text-gray-700 mb-1'>
              Preferred Time *
            </label>
            <select
              id='time'
              value={formData.time}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>Select time</option>
              <option value='09:00'>9:00 AM</option>
              <option value='10:00'>10:00 AM</option>
              <option value='11:00'>11:00 AM</option>
              <option value='12:00'>12:00 PM</option>
              <option value='13:00'>1:00 PM</option>
              <option value='14:00'>2:00 PM</option>
              <option value='15:00'>3:00 PM</option>
              <option value='16:00'>4:00 PM</option>
              <option value='17:00'>5:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor='agentId' className='block text-sm font-medium text-gray-700 mb-1'>
            Preferred Agent *
          </label>
          <select
            id='agentId'
            value={formData.agentId}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value=''>Select an agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.username}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Payment Method * (Appointment Fee: ${formData.paymentAmount})
          </label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handlePaymentMethodChange('cash')}
            >
              <div className='flex items-center space-x-3'>
                <CreditCard className='h-6 w-6 text-green-600' />
                <div>
                  <h4 className='font-semibold text-gray-800'>Cash Payment</h4>
                  <p className='text-sm text-gray-600'>Pay at office during appointment</p>
                </div>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.paymentMethod === 'qr'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handlePaymentMethodChange('qr')}
            >
              <div className='flex items-center space-x-3'>
                <QrCode className='h-6 w-6 text-blue-600' />
                <div>
                  <h4 className='font-semibold text-gray-800'>QR Payment</h4>
                  <p className='text-sm text-gray-600'>Pay online via QR code</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
            Additional Message (Optional)
          </label>
          <textarea
            id='message'
            value={formData.message}
            onChange={handleChange}
            rows='4'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Any specific requirements or questions...'
          />
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3'>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors'
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}