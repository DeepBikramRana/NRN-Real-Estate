import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statsData, setStatsData] = useState({ 
    totalUsers: 0, 
    totalListings: 0, 
    premiumListings: 0, 
    verifiedUsers: 0 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        if (usersData.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setUsers(usersData);
        
        // Fetch listings
        const listingsRes = await fetch('/api/admin/listings');
        const listingsData = await listingsRes.json();
        if (listingsData.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListings(listingsData);
        
        // Fetch stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        if (statsData.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setStatsData(statsData);
        
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/admin/listings/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Admin Dashboard</h1>
      {loading && <p className="text-xl text-center">Loading...</p>}
      {error && (
        <p className="text-red-700 text-center text-xl">
          Error! Only admins can access this page
        </p>
      )}

      {!loading && !error && (
        <div>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-100 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">Total Users</h3>
              <p className="text-3xl font-bold">{statsData.totalUsers}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">Total Listings</h3>
              <p className="text-3xl font-bold">{statsData.totalListings}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">Premium Listings</h3>
              <p className="text-3xl font-bold">{statsData.premiumListings}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">Verified Users</h3>
              <p className="text-3xl font-bold">{statsData.verifiedUsers}</p>
            </div>
          </div>

          {/* Users Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Users Management</h2>
              <Link
                to="/admin/add-agent"
                className="bg-blue-600 text-white p-2 rounded-lg hover:opacity-95"
              >
                Add New Agent
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Username</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Email</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Role</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {user.username}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {user.email}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {user.isAdmin ? 'Admin' : user.isAgent ? 'Agent' : 'User'}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-700 text-white p-1 rounded-lg uppercase hover:opacity-95 mr-2"
                        >
                          Delete
                        </button>
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="bg-green-700 text-white p-1 rounded-lg uppercase hover:opacity-95"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Listings Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Listings Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Title</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Price</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Created By</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing._id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {listing.name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        ${listing.regularPrice.toLocaleString('en-US')}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {listing.userRef}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="bg-red-700 text-white p-1 rounded-lg uppercase hover:opacity-95 mr-2"
                        >
                          Delete
                        </button>
                        <Link
                          to={`/listing/${listing._id}`}
                          className="bg-green-700 text-white p-1 rounded-lg uppercase hover:opacity-95"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}