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
                setTimeout(() => setUpdateSuccess(false), 3000); // Clear success message after 3 seconds
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
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

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      
      {/* Profile Form Section */}
      <div className='max-w-lg mx-auto'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error uploading image. Please try again.
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image uploaded and profile updated!</span>
            ) : (
              ''
            )}
          </p>
          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            defaultValue={currentUser.email}
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='border p-3 rounded-lg'
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
          <Link
            className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
            to={'/create-listing'}
          >
            Create Listing
          </Link>
        </form>
        
        <div className='flex justify-between mt-5'>
          <span
            onClick={handleDeleteUser}
            className='text-red-700 cursor-pointer'
          >
            Delete account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>

        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5'>
          {updateSuccess ? 'User is updated successfully!' : ''}
        </p>
        
        {/* Action Buttons Section */}
        <div className='flex flex-col gap-2 mt-5'>
          <button onClick={handleShowListings} className='text-green-700 w-full'>
            Show Listings
          </button>
          <button 
            onClick={() => setShowAppointments(!showAppointments)} 
            className='text-blue-700 w-full'
          >
            {showAppointments ? 'Hide Appointments' : 'Show Appointments'}
          </button>
        </div>
        
        <p className='text-red-700 mt-5'>
          {showListingsError ? 'Error showing listings' : ''}
        </p>
      </div>

      {/* Appointments Section */}
      {showAppointments && (
        <div className='mt-8'>
          <UserAppointments />
        </div>
      )}

      {/* Listings Section */}
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4 max-w-lg mx-auto mt-8'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}