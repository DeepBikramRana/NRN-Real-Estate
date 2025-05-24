import { useState, useEffect } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaEye,
  FaTrash,
} from 'react-icons/fa';

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fixed: Changed to match your server route '/api/appointment' (singular)
      // Added credentials: 'include' for cookie-based authentication
      const res = await fetch('/api/appointment/client', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookie-based auth
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || 'Failed to fetch appointments');
        return;
      }

      // Handle the response structure from your backend
      // Your backend returns { success: true, appointments: [...] }
      const appointmentsList = data.appointments || [];
      setAppointments(appointmentsList);
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'cancelled':
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      // Fixed: Using your server route '/api/appointment' (singular)
      const res = await fetch(`/api/appointment/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookie-based auth
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        alert('Failed to cancel appointment: ' + (data.message || 'Unknown error'));
        return;
      }

      // Show success message
      alert('Appointment cancelled successfully');
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          My Appointments
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          My Appointments
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAppointments}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          My Appointments
          {appointments.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {appointments.length}
            </span>
          )}
        </h2>
      </div>

      <div className="p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-600">
              When you book appointments with agents, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appointment.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {appointment.listingId && (
                      <button
                        onClick={() => window.open(`/listing/${appointment.listingId}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Property"
                      >
                        <FaEye />
                      </button>
                    )}
                    {(appointment.status?.toLowerCase() === 'pending' || !appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Cancel Appointment"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {appointment.propertyAddress || 'Property Address Not Available'}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span>{appointment.time}</span>
                      </div>
                      
                      {appointment.propertyAddress && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{appointment.propertyAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Agent Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {appointment.agent ? (
                        <>
                          <div className="flex items-center gap-2">
                            <FaUserTie className="text-gray-400" />
                            <span>{appointment.agent.username || appointment.agent.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{appointment.agent.email}</span>
                          </div>
                          {appointment.agent.phone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-400" />
                              <span>{appointment.agent.phone}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">Agent information not available</p>
                      )}
                    </div>
                  </div>
                </div>

                {appointment.message && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="font-medium text-sm mb-1">Your Message:</h4>
                    <p className="text-sm text-gray-600">{appointment.message}</p>
                  </div>
                )}

                {appointment.createdAt && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Requested on {formatDateTime(appointment.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}