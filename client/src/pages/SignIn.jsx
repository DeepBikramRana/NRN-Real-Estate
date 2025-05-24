import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill all fields'));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Required for cookies
      });

      const data = await res.json();
      
      if (data.success === false || !res.ok) {
        dispatch(signInFailure(data.message || 'Sign-in failed'));
        return;
      }

      // Sync cookie token to localStorage
      document.cookie.split('; ').forEach(cookie => {
        if (cookie.startsWith('access_token=')) {
          const token = cookie.split('=')[1];
          localStorage.setItem('access_token', token);
        }
      });

      dispatch(signInSuccess(data));
      
      // Redirect based on user role
      if (data.isAdmin) {
        navigate('/admin');
      } else if (data.isAgent) {
        navigate('/agent-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'Something went wrong'));
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <section className="my-12 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sign in to access your NRN Real Estate account and continue your property journey.
          </p>
        </section>

        {/* Sign In Form */}
        <section className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-medium uppercase ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <OAuth />

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="text-gray-600 hover:text-black">
                Forgot password?
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}