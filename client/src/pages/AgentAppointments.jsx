import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaHome, 
  FaClock,
  FaPhone, 
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AgentAppointments() {
  const { currentUser } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/appointments/agent', {
          headers: {
            'Authorization': `Bearer ${currentUser.access_token}`
          }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch appointments');
        }

        setAppointments(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAgent || currentUser?.isAdmin) {
      fetchAppointments();
    }
  }, [currentUser]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatus(appointmentId);
      
      const res = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update local state
      setAppointments(prev => prev.map(appt => 
        appt._id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
      
      toast.success(`Appointment ${newStatus}`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (!currentUser) {
    return <div className="text-center py-8">Please sign in to view appointments</div>;
  }

  if (!currentUser.isAgent && !currentUser.isAdmin) {
    return <div className="text-center py-8">Only agents can access this page</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-7">Your Appointments</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl">No appointments scheduled</p>
          <p className="text-gray-600 mt-2">When clients book appointments, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment._id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-500 text-xl" />
                  <div>
                    <h3 className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-blue-400" />
                      {appointment.time}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 text-sm rounded-full ${
                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'canceled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Property Info */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaHome className="text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Property</h3>
                    <p className="text-gray-800">{appointment.property?.title || 'Not specified'}</p>
                    {appointment.property?.price && (
                      <p className="text-blue-600 font-medium">
                        ${appointment.property.price.toLocaleString()}
                        {appointment.property.type === 'rent' && '/mo'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Client Info */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Client</h3>
                    <p className="text-gray-800">{appointment.client?.username || 'Not specified'}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {appointment.client?.phone && (
                        <a 
                          href={`tel:${appointment.client.phone}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <FaPhone size={12} /> Call
                        </a>
                      )}
                      {appointment.client?.email && (
                        <a 
                          href={`mailto:${appointment.client.email}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <FaEnvelope size={12} /> Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Appointment Notes */}
              {appointment.message && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Client Notes</h4>
                  <p className="text-gray-700 mt-1">{appointment.message}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                {appointment.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                    disabled={updatingStatus === appointment._id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-70"
                  >
                    {updatingStatus === appointment._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheck />
                    )}
                    Confirm
                  </button>
                )}
                
                {appointment.status !== 'canceled' && (
                  <button
                    onClick={() => handleStatusUpdate(appointment._id, 'canceled')}
                    disabled={updatingStatus === appointment._id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-70"
                  >
                    {updatingStatus === appointment._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTimes />
                    )}
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}