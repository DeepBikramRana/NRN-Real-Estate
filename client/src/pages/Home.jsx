import React, { useState } from 'react';

const Home = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [favorites, setFavorites] = useState([]);

  const openLightbox = (src) => {
    setLightboxSrc(src);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  const properties = [
    {
      id: 1,
      address: "123 Main St, Beverly Hills, CA",
      price: 2500000,
      originalPrice: 3000000,
      beds: 5,
      baths: 4.5,
      sqft: 4500,
      type: "Luxury Villa",
      yearBuilt: 2018,
      description: "Stunning modern villa with panoramic city views, smart home features, and resort-style amenities.",
      photos: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      id: 2,
      address: "456 Coastal Dr, Malibu, CA",
      price: 3800000,
      originalPrice: 4200000,
      beds: 6,
      baths: 5,
      sqft: 5200,
      type: "Beachfront Estate",
      yearBuilt: 2015,
      description: "Direct beach access with private dock, infinity pool, and expansive ocean views from every room.",
      photos: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      id: 3,
      address: "789 Hillside Ave, Hollywood Hills, CA",
      price: 1950000,
      originalPrice: 2200000,
      beds: 4,
      baths: 3,
      sqft: 3200,
      type: "Modern Hillside Home",
      yearBuilt: 2020,
      description: "Architectural masterpiece with floor-to-ceiling windows, smart home technology, and rooftop deck.",
      photos: [
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ]
    }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto p-6">
        <section id="about" className="my-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <h2 className="text-4xl font-semibold mb-4">About NRN Real Estate</h2>
          <p className="text-lg">
            At NRN Real Estate, we are dedicated to helping you find your dream home with exceptional service and expertise. Our team of professionals is here to guide you through every step of the buying and selling process.
          </p>
        </section>

        <section id="properties" className="my-8">
          <h2 className="text-4xl font-semibold mb-6">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src={property.photos[0]} 
                    alt={property.address} 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(property.photos[0])}
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {Math.round((1 - property.price/property.originalPrice)*100)}% OFF
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{property.address}</h3>
                  <p className="text-gray-600 mb-2">{property.type} | Built: {property.yearBuilt}</p>
                  <div className="flex gap-4 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5 5a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V5z"/></svg>
                      {property.beds} bd
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/></svg>
                      {property.baths} ba
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                      {property.sqft.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="line-through text-gray-500">${property.originalPrice.toLocaleString()}</p>
                    <p className="text-red-600 font-semibold text-xl">Now: ${property.price.toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
                      View Details
                    </button>
                    <button 
                      className="text-gray-600 hover:text-red-500 transition"
                      onClick={() => toggleFavorite(property.id)}
                    >
                      <svg 
                        className="w-6 h-6" 
                        fill={favorites.includes(property.id) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="property-photos" className="my-8">
          <h2 className="text-4xl font-semibold mb-6">Property Galleries</h2>
          {properties.map((property) => (
            <div key={property.id} className="mb-12">
              <h3 className="text-2xl font-semibold mb-4">{property.address}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`${property.address} - Photo ${index + 1}`} 
                    className="w-full h-64 object-cover cursor-pointer rounded-lg shadow-md hover:opacity-90 transition"
                    onClick={() => openLightbox(photo.replace('1000', '2000'))}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Lightbox */}
        <div 
          id="lightbox" 
          className={`fixed inset-0 bg-black bg-opacity-90 z-50 ${isLightboxOpen ? 'flex' : 'hidden'} items-center justify-center`}
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition"
            >
              &times;
            </button>
            <img 
              id="lightbox-img" 
              src={lightboxSrc} 
              alt="Enlarged view" 
              className="w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;