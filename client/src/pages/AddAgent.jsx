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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Add New Agent</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Agent License Number"
          className="border p-3 rounded-lg"
          id="agentLicense"
          value={formData.agentLicense}
          onChange={handleChange}
          required
        />
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add specialty (e.g. Residential, Commercial)"
            className="border p-3 rounded-lg flex-1"
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddSpecialty}
            className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Add
          </button>
        </div>
        
        {formData.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.specialties.map((specialty) => (
              <span 
                key={specialty} 
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1"
              >
                {specialty}
                <button 
                  type="button"
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Creating Agent...' : 'Create Agent'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}