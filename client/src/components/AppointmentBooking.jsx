import { useState } from 'react';

export default function AppointmentBooking({ listing, agents, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    agentId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate all required fields are filled
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.agentId) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Additional validation for empty strings
    const requiredFields = ['name', 'phone', 'email', 'date', 'time', 'agentId'];
    const emptyFields = requiredFields.filter(field => 
      !formData[field] || formData[field].toString().trim() === ''
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Use listing._id for the listing ID
    const listingId = listing._id;

    // Debug: Check what we're sending
    console.log('Form data:', formData);
    console.log('Listing:', listing);
    console.log('Listing ID:', listingId);

    // Format the request body to match what the controller expects
    const requestBody = {
      property: listingId,           // Controller expects 'property', not 'listingId'
      agent: formData.agentId,       // Controller expects 'agent', not 'agentId'
      date: formData.date,
      time: formData.time,
      message: formData.message || '',
      clientInfo: {                  // Controller expects 'clientInfo' object
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim()
      },
      propertyAddress: listing.address
    };
    
    console.log('Request body (updated format):', requestBody);

    try {
      // Get authentication token (adjust based on how you store the token)
      const token = localStorage.getItem('access_token') || 
                   sessionStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   sessionStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/appointment/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log('Response data:', data);
      
      setIsSubmitting(false);

      if (data.success === false) {
        setError(data.message || 'Failed to create appointment');
        return;
      }

      if (!res.ok) {
        setError(data.message || `Server error: ${res.status}`);
        return;
      }

      setSubmissionSuccess(true);
    } catch (error) {
      console.error('Fetch error:', error);
      setIsSubmitting(false);
      setError('Network error. Please check your connection and try again.');
    }
  };

  if (submissionSuccess) {
    return (
      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mt-4'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-green-800 font-semibold text-lg'>Appointment Request Sent!</h3>
          <button
            onClick={onClose}
            className='text-green-600 hover:text-green-800'
          >
            ✕
          </button>
        </div>
        <p className='text-green-700'>
          Your appointment request has been sent. The agent will contact you shortly to confirm.
        </p>
        <p className='text-green-700 mt-2'>
          Details: {formData.date} at {formData.time}
        </p>
      </div>
    );
  }

  // Debug: Check if agents are being passed correctly
  console.log('Agents in AppointmentBooking component:', agents);
  console.log('Agents length:', agents ? agents.length : 'agents is null/undefined');

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 mt-4 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Schedule Appointment</h3>
        <button
          onClick={onClose}
          className='text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className='bg-yellow-50 border border-yellow-200 rounded p-2 mb-4 text-sm'>
          <p><strong>Debug:</strong> Agents received: {agents ? agents.length : 0}</p>
          {agents && agents.length > 0 && (
            <p>First agent: {agents[0].username} ({agents[0].email})</p>
          )}
          <p><strong>Listing ID:</strong> {listing?._id}</p>
        </div>
      )}
      
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='relative'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              Your Name *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                👤
              </div>
              <input
                type='text'
                id='name'
                required
                value={formData.name}
                onChange={handleChange}
                className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border'
                placeholder='John Doe'
              />
            </div>
          </div>

          <div className='relative'>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
              Phone Number *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                📞
              </div>
              <input
                type='tel'
                id='phone'
                required
                value={formData.phone}
                onChange={handleChange}
                className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border'
                placeholder='(123) 456-7890'
              />
            </div>
          </div>
        </div>

        <div className='relative'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
            Email Address *
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              ✉️
            </div>
            <input
              type='email'
              id='email'
              required
              value={formData.email}
              onChange={handleChange}
              className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border'
              placeholder='your@email.com'
            />
          </div>
        </div>

        {/* Agent Selection Dropdown */}
        <div className='relative'>
          <label htmlFor='agentId' className='block text-sm font-medium text-gray-700 mb-1'>
            Select Agent * {agents && agents.length > 0 && `(${agents.length} available)`}
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              👔
            </div>
            <select
              id='agentId'
              required
              value={formData.agentId}
              onChange={handleChange}
              className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border appearance-none bg-white'
            >
              <option value=''>
                {!agents || agents.length === 0 
                  ? 'No agents available' 
                  : 'Select an agent'}
              </option>
              {agents && agents.length > 0 && agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.username} - {agent.email}
                  {agent.specialties && agent.specialties.length > 0 && 
                    ` (${agent.specialties.join(', ')})`
                  }
                </option>
              ))}
            </select>
          </div>
          {(!agents || agents.length === 0) && (
            <p className='text-red-500 text-sm mt-1'>
              No agents available at the moment. Please try again later.
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='relative'>
            <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-1'>
              Preferred Date *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                📅
              </div>
              <input
                type='date'
                id='date'
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border'
              />
            </div>
          </div>

          <div className='relative'>
            <label htmlFor='time' className='block text-sm font-medium text-gray-700 mb-1'>
              Preferred Time *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                🕐
              </div>
              <select
                id='time'
                required
                value={formData.time}
                onChange={handleChange}
                className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border appearance-none bg-white'
              >
                <option value=''>Select a time</option>
                <option value='09:00 AM'>09:00 AM</option>
                <option value='10:00 AM'>10:00 AM</option>
                <option value='11:00 AM'>11:00 AM</option>
                <option value='12:00 PM'>12:00 PM</option>
                <option value='01:00 PM'>01:00 PM</option>
                <option value='02:00 PM'>02:00 PM</option>
                <option value='03:00 PM'>03:00 PM</option>
                <option value='04:00 PM'>04:00 PM</option>
                <option value='05:00 PM'>05:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
            Additional Notes (Optional)
          </label>
          <textarea
            id='message'
            rows='3'
            value={formData.message}
            onChange={handleChange}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border'
            placeholder='Any special requests or questions...'
          ></textarea>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3'>
            <p className='text-red-600 text-sm'>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !agents || agents.length === 0}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            (isSubmitting || !agents || agents.length === 0) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isSubmitting 
            ? 'Submitting...' 
            : (!agents || agents.length === 0)
              ? 'No Agents Available'
              : 'Request Appointment'
          }
        </button>
      </div>
    </div>
  );
}