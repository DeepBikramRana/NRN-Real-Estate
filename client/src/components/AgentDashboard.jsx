import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEye, FaSearch } from 'react-icons/fa';

export default function AgentDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'my'
  const { currentUser } = useSelector((state) => state.user);
  
  // Determine if user has edit permissions (agent or admin)
  const hasEditPermissions = currentUser && (currentUser.isAgent || currentUser.isAdmin);

  useEffect(() => {
    fetchListings();
  }, [viewMode, currentUser]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the most accessible endpoint possible - guaranteed to be public
      let endpoint = '/api/listing/get';
      
      // For "my listings" view, use a query parameter if the user is logged in
      if (viewMode === 'my' && currentUser && currentUser._id) {
        endpoint = `/api/listing/get?userRef=${currentUser._id}`;
      }
      
      console.log('Fetching from endpoint:', endpoint);
      
      const res = await fetch(endpoint);
      
      // Handle non-JSON responses
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch listings');
      }

      console.log('Listings data:', data);
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => 
    (listing.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((listing.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        {hasEditPermissions ? 'Agent Dashboard' : 'Properties Dashboard (View Only)'}
      </h1>
      
      {/* View Toggle & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            All Listings
          </button>
          {currentUser && (
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'my' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              My Listings
            </button>
          )}
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pr-10"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchListings()}
            className="text-blue-600 hover:underline mt-2"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Listings Content */
        <>
          {filteredListings.length === 0 ? (
            <div className="text-center my-8">
              <p className="text-xl mb-4">No listings found!</p>
              {viewMode === 'my' && hasEditPermissions && (
                <Link
                  to="/create-listing"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Your First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Address</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <img
                          src={listing.imageUrls?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                          alt={listing.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-2 px-4 font-medium">{listing.name || 'Untitled'}</td>
                      <td className="py-2 px-4">
                        ${(listing.regularPrice?.toLocaleString()) || '0'}
                        {listing.type === 'rent' && '/mo'}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          listing.type === 'rent' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </td>
                      <td className="py-2 px-4 truncate max-w-[150px]">{listing.address || 'No address'}</td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/listing/${listing._id}`}>
                            <button className="p-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                              <FaEye />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}