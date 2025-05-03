import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import 'swiper/css/effect-coverflow';

// Initialize Swiper modules
SwiperCore.use([Navigation, Autoplay, EffectCoverflow]);

export default function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [favorites, setFavorites] = useState([]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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

  const completedDeals = [
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
    // ... other properties
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const offerRes = await fetch('/api/listing/get?offer=true&limit=4');
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        const rentRes = await fetch('/api/listing/get?type=rent&limit=4');
        const rentData = await rentRes.json();
        setRentListings(rentData);

        const saleRes = await fetch('/api/listing/get?type=sale&limit=4');
        const saleData = await saleRes.json();
        setSaleListings(saleData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Luxury Video Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/luxury-homes.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <button
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-20 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-serif text-5xl lg:text-7xl mb-8 text-white">
            <span className="block tracking-wider mb-6">CURATED LUXURY</span>
            <span className="block text-6xl lg:text-8xl italic font-light">Beyond Expectation</span>
          </h1>
          <p className="text-gray-200 mb-12 text-xl tracking-wide leading-relaxed">
            Discover exceptional properties where craftsmanship meets visionary design, 
            creating spaces that inspire and endure.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/search"
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 text-lg font-medium hover:bg-white/10 transition-all duration-300 uppercase tracking-widest"
            >
              View Properties
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white text-black px-10 py-4 text-lg font-medium hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
            >
              Our Philosophy
            </Link>
          </div>
        </div>
      </div>

      {/* Completed Property Deals */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl mb-4">
              <span className="border-b-2 border-gray-900 pb-2">Completed Property Deals</span>
            </h2>
            <p className="text-gray-600 tracking-wide">Recently closed transactions from our portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedDeals.map((property) => (
              <div key={property.id} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src={property.photos[0]} 
                    alt={property.address} 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(property.photos[0])}
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    SOLD
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
                    <p className="text-gray-500">Final Price: <span className="font-semibold">${property.price.toLocaleString()}</span></p>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <button 
                      className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
                      onClick={() => openLightbox(property.photos[0])}
                    >
                      View Gallery
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
        </div>
      </div>

      {/* Luxury Testimonial Section */}
      <div className="py-24 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[url('/images/luxury-pattern.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="font-serif text-2xl lg:text-3xl italic text-gray-700 mb-8">
            "Working with this agency transformed our property search from transactional to truly inspirational. Their attention to detail is unmatched in the luxury market."
          </p>
          <div className="text-gray-600">
            <p className="font-medium">The Johnson Family</p>
            <p className="text-sm">Beverly Hills Residence</p>
          </div>
        </div>
      </div>

      {/* Luxury Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-serif text-xl mb-6 border-b border-white/20 pb-2">LUXURY ESTATES</h3>
              <p className="text-gray-400 mb-4">Redefining luxury living through exceptional service and unparalleled market knowledge.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-6 border-b border-white/20 pb-2">QUICK LINKS</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-6 border-b border-white/20 pb-2">SERVICES</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Luxury Sales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Property Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Investment Consulting</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Interior Design</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Relocation Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-6 border-b border-white/20 pb-2">CONTACT</h3>
              <address className="text-gray-400 not-italic">
                <p className="mb-3">123 Luxury Avenue<br />Beverly Hills, CA 90210</p>
                <p className="mb-3">Phone: <a href="tel:+18005551234" className="hover:text-white transition">(800) 555-1234</a></p>
                <p>Email: <a href="mailto:info@luxuryestates.com" className="hover:text-white transition">info@luxuryestates.com</a></p>
              </address>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Luxury Estates. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
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
              src={lightboxSrc} 
              alt="Enlarged view" 
              className="w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}