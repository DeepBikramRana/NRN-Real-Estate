import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch(error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <section className="my-12 text-center">
          <h1 className="text-5xl font-bold mb-6">Join NRN Real Estate</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Create your account to unlock personalized property recommendations and save your favorites.
          </p>
        </section>

        {/* Sign Up Form */}
        <section className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-medium uppercase"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
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
              Already have an account?{' '}
              <Link to="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}