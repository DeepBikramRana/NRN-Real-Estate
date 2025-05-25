import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import UserAppointments from '../components/UserAppointments';
import { FiEdit, FiTrash2, FiLogOut, FiUser, FiMail, FiLock, FiHome, FiCalendar } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    return new Promise((resolve, reject) => {
      setFileUploadError(false);
      setFilePerc(0);

      const uploadData = new FormData();
      uploadData.append('image', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFilePerc(progress);
        }
      });

      xhr.onload = async function() {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            setFormData(prev => ({ ...prev, avatar: data.url }));
            setFilePerc(100);
            
            // Auto-update the user profile with new avatar
            try {
              dispatch(updateUserStart());
              const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ avatar: data.url }),
              });
              const updateData = await updateRes.json();
              
              if (updateData.success === false) {
                console.error('Auto-update failed:', updateData.message);
                dispatch(updateUserFailure(updateData.message));
              } else {
                dispatch(updateUserSuccess(updateData));
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
              }
            } catch (updateError) {
              console.error('Auto-update error:', updateError);
              dispatch(updateUserFailure(updateError.message));
            }
            
            resolve(data.url);
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            setFileUploadError(true);
            setFilePerc(0);
            reject(parseError);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            console.error('Server error response:', errorData);
            setFileUploadError(true);
            setFilePerc(0);
            reject(new Error(errorData.message || 'Upload failed'));
          } catch (parseError) {
            setFileUploadError(true);
            setFilePerc(0);
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = function() {
        console.error('Network error during upload');
        setFileUploadError(true);
        setFilePerc(0);
        reject(new Error('Network error'));
      };

      xhr.open('POST', '/api/user/upload');
      xhr.setRequestHeader('credentials', 'include');
      xhr.send(uploadData);
    });
  };

  const updateProfile = async (data) => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (responseData.success === false) {
        dispatch(updateUserFailure(responseData.message));
        return;
      }
      dispatch(updateUserSuccess(responseData));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings(prev => prev.filter(listing => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account and listings</p>
        </div>

        {/* Main Profile Content */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex flex-col items-center">
                {/* Avatar Upload */}
                <div className="relative group mb-4">
                  <img
                    onClick={() => fileRef.current?.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:border-gray-200 transition duration-150"
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <FiEdit className="text-white text-2xl" />
                  </div>
                  <input
                    type="file"
                    ref={fileRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                  />
                </div>

                {/* Upload Status */}
                {fileUploadError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
                    <FaTimesCircle className="mr-2" />
                    <span>Image upload failed. Please try again.</span>
                  </div>
                )}
                {filePerc > 0 && filePerc < 100 && (
                  <div className="w-full mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${filePerc}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading {filePerc}%</p>
                  </div>
                )}
                {filePerc === 100 && !fileUploadError && (
                  <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center">
                    <FaCheckCircle className="mr-2" />
                    <span>Image uploaded and profile updated!</span>
                  </div>
                )}

                {/* User Info */}
                <h2 className="text-xl font-semibold">{currentUser.username}</h2>
                <p className="text-gray-600 mb-6">{currentUser.email}</p>

                {/* Quick Actions */}
                <div className="w-full space-y-3">
                  <button
                    onClick={handleShowListings}
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FiHome className="mr-2" />
                    {userListings.length > 0 ? 'Hide Listings' : 'Show Listings'}
                  </button>
                  <button 
                    onClick={() => setShowAppointments(!showAppointments)}
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FiCalendar className="mr-2" />
                    {showAppointments ? 'Hide Appointments' : 'Show Appointments'}
                  </button>
                  <Link
                    to="/create-listing"
                    className="block w-full text-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
                  >
                    Create New Listing
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:w-2/3 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiUser className="mr-2" /> Edit Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      defaultValue={currentUser.username}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      defaultValue={currentUser.email}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      placeholder="Leave blank to keep current"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className="pt-2">
                  <button
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-6 rounded-lg font-medium transition ${
                      loading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : 'Update Profile'}
                  </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
                    {error}
                  </div>
                )}
                {updateSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-center border border-green-100">
                    Profile updated successfully!
                  </div>
                )}
              </form>

              {/* Danger Zone */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <FiLogOut className="mr-2" /> Sign Out
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="w-full flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="mr-2" /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        {showAppointments && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Your Appointments</h2>
            <UserAppointments />
          </div>
        )}

        {/* Listings Section */}
        {userListings && userListings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Your Property Listings</h2>
              {showListingsError && (
                <p className="text-red-600 mt-2">Error loading listings</p>
              )}
            </div>
            
            <div className="divide-y divide-gray-200">
              {userListings.map((listing) => (
                <div key={listing._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                      <img
                        src={listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/listing/${listing._id}`} className="block">
                        <h3 className="text-lg font-medium text-gray-800 truncate hover:text-black transition">
                          {listing.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-1">
                        ${listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {listing.address}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="text-gray-600 hover:text-black transition p-2"
                        title="Edit"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="text-gray-600 hover:text-red-600 transition p-2"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}