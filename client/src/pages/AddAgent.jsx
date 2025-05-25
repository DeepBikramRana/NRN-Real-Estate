import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddAgent() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agentLicense: '',
    specialties: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAddSpecialty = () => {
    if (specialtyInput && !formData.specialties.includes(specialtyInput)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialtyInput]
      });
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (specialty) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/add-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/admin');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto p-6">
        <section className="my-12 text-center">
          <h1 className="text-4xl font-bold mb-6">Add New Agent</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Register a new real estate agent to your team
          </p>
        </section>

        <section className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="agent@email.com"
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
              />
            </div>

            <div>
              <label htmlFor="agentLicense" className="block text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                id="agentLicense"
                value={formData.agentLicense}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Agent license number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Specialties</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add specialty"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Add
                </button>
              </div>
              
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty) => (
                    <span 
                      key={specialty} 
                      className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {specialty}
                      <button 
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className={`w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-medium uppercase ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Agent...' : 'Create Agent'}
            </button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}