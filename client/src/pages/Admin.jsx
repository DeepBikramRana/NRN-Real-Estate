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
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center my-12">Admin Dashboard</h1>
        
        {loading && <p className="text-xl text-center py-8">Loading...</p>}
        {error && (
          <p className="text-red-600 text-center text-xl py-8">
            Error! Only admins can access this page
          </p>
        )}

        {!loading && !error && (
          <div className="space-y-12">
            {/* Stats Section */}
            <section className="bg-black text-white py-8 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4">
                  <p className="text-3xl md:text-4xl font-bold mb-2">{statsData.totalUsers}</p>
                  <p className="text-gray-300">Total Users</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl md:text-4xl font-bold mb-2">{statsData.totalListings}</p>
                  <p className="text-gray-300">Total Listings</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl md:text-4xl font-bold mb-2">{statsData.premiumListings}</p>
                  <p className="text-gray-300">Premium Listings</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl md:text-4xl font-bold mb-2">{statsData.verifiedUsers}</p>
                  <p className="text-gray-300">Verified Users</p>
                </div>
              </div>
            </section>

            {/* Users Section */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Users Management</h2>
                <Link
                  to="/admin/add-agent"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Add New Agent
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left">Username</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          {user.isAdmin ? 'Admin' : user.isAgent ? 'Agent' : 'User'}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Listings Section */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Listings Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left">Title</th>
                      <th className="px-6 py-3 text-left">Price</th>
                      <th className="px-6 py-3 text-left">Created By</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map((listing) => (
                      <tr key={listing._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{listing.name}</td>
                        <td className="px-6 py-4">
                          ${listing.regularPrice.toLocaleString('en-US')}
                        </td>
                        <td className="px-6 py-4">{listing.userRef}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                          <Link
                            to={`/listing/${listing._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}