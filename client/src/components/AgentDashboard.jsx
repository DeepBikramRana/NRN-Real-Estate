import { useEffect, useState } from 'react';
import { 
  FaEye, 
  FaSearch, 
  FaCalendarAlt, 
  FaUser, 
  FaHome, 
  FaClock, 
  FaPhone, 
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaFilter,
  FaSort
} from 'react-icons/fa';

export default function AgentDashboard() {
  // Mock current user - replace with your actual user state management
  const currentUser = { 
    isAgent: true, 
    username: 'Agent',
    id: '60d5ecb74f8b8a001c8e4b91'
  };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    canceled: 0
  });

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = '/api/appointment/agent';
      
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
        calculateStats(data.appointments);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsData) => {
    const stats = {
      total: appointmentsData.length,
      pending: appointmentsData.filter(apt => apt.status === 'pending').length,
      confirmed: appointmentsData.filter(apt => apt.status === 'confirmed').length,
      completed: appointmentsData.filter(apt => apt.status === 'completed').length,
      canceled: appointmentsData.filter(apt => apt.status === 'canceled').length
    };
    setStats(stats);
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const res = await fetch(`/api/appointment/${appointmentId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        // Update the appointment in the state
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === appointmentId 
              ? { ...apt, status: newStatus }
              : apt
          )
        );
        // Recalculate stats
        const updatedAppointments = appointments.map(apt => 
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        );
        calculateStats(updatedAppointments);
      } else {
        setError(data.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedAppointments = appointments
    .filter(appointment => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          appointment.clientInfo?.name?.toLowerCase().includes(searchLower) ||
          appointment.property?.name?.toLowerCase().includes(searchLower) ||
          appointment.propertyAddress?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'client':
          return (a.clientInfo?.name || '').localeCompare(b.clientInfo?.name || '');
        case 'property':
          return (a.property?.name || '').localeCompare(b.property?.name || '');
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  if (!currentUser?.isAgent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to agents.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaCheck className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaCheck className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaTimes className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Canceled</p>
              <p className="text-2xl font-bold text-red-600">{stats.canceled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name, property, or address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="md:w-48">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="client">Sort by Client</option>
              <option value="property">Sort by Property</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAndSortedAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No appointments found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedAppointments.map((appointment) => (
              <div key={appointment._id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={appointment.property?.imageUrls?.[0] || '/placeholder-property.jpg'}
                          alt={appointment.property?.name || 'Property'}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>

                      {/* Appointment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {appointment.property?.name || 'Property Name'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaUser className="mr-2" />
                            <span>{appointment.clientInfo?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <FaPhone className="mr-2" />
                            <span>{appointment.clientInfo?.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(appointment.date)} at {formatTime(appointment.time)}</span>
                          </div>
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2" />
                            <span>{appointment.clientInfo?.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center mt-2">
                          <FaHome className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.propertyAddress}</span>
                        </div>

                        {appointment.message && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            <strong>Message:</strong> {appointment.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <FaCheck className="mr-2" />
                          Confirm
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'canceled')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <FaCheck className="mr-2" />
                        Mark Complete
                      </button>
                    )}

                    <button
                      onClick={() => window.location.href = `/appointment/${appointment._id}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}