import React, { useState } from 'react';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyInterest: 'buying'
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    setFormSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyInterest: 'buying'
      });
    }, 5000);
  };

  const teamMembers = [
    {
      id: 1,
      name: "Deep Bikram Rana",
      role: "Founder & CEO",
      bio: "With over 5 years in real estate, Deep revolutionized luxury property marketing in Kathmandu.",
      image: "https://i.pinimg.com/474x/8e/f3/27/8ef327096e828d1df351edaca11b8596.jpg"
    },
    {
      id: 2,
      name: "Uttam Shrestha",
      role: "Lead Agent",
      bio: "Specializing in beachfront properties, Uttam has closed over $200M in sales.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQBPSJXR6t9AM14j0YgMTcNEfYSEeLh6rJaA&s"
    },
    {
      id: 3,
      name: "Yuben Gurung",
      role: "Interior Design Specialist",
      bio: "Transforming properties into dream homes with his award-winning design vision.",
      image: "https://www.thewrap.com/wp-content/uploads/2023/05/spider-man-homecoming.jpg"
    }
  ];

  const stats = [
    { value: "12+", label: "Years Experience" },
    { value: "500+", label: "Properties Sold" },
    { value: "$2B+", label: "In Transactions" },
    { value: "98%", label: "Client Satisfaction" }
  ];

  const offices = [
    {
      id: 1,
      city: "Kathmandu",
      address: "123 Durbar Marg, Kathmandu",
      phone: "+977 1 4123456",
      email: "kathmandu@nrnrealestate.com"
    },
    {
      id: 2,
      city: "Los Angeles",
      address: "456 Beverly Blvd, Los Angeles, CA",
      phone: "+1 (310) 555-7890",
      email: "la@nrnrealestate.com"
    },
    {
      id: 3,
      city: "San Francisco",
      address: "789 Market St, San Francisco, CA",
      phone: "+1 (415) 555-1234",
      email: "sf@nrnrealestate.com"
    }
  ];

  // Function to scroll to contact section
  const scrollToContact = () => {
    document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <section className="my-8 md:my-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Our Story</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Founded in 2010, NRN Real Estate has grown from a small boutique agency to one of California's most trusted names in luxury properties.
          </p>
        </section>

        {/* Mission Section */}
        <section className="my-8 md:my-16 p-4 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6">Our Mission</h2>
              <p className="text-base md:text-lg mb-4">
                To redefine real estate by providing exceptional service through innovation, integrity, and incomparable market knowledge.
              </p>
              <p className="text-base md:text-lg">
                We believe finding your dream home should be an exciting journey, not a stressful transaction.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Luxury home" 
                className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="my-8 md:my-16 bg-black text-white py-8 md:py-12 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-2 md:p-4">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">{stat.value}</p>
                <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="my-8 md:my-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 md:mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-2 md:mb-3">{member.role}</p>
                  <p className="text-gray-700 text-sm md:text-base">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="my-8 md:my-16 p-4 md:p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            <div className="p-4 md:p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Integrity</h3>
              <p className="text-sm md:text-base">We maintain the highest ethical standards in all our transactions and communications.</p>
            </div>
            <div className="p-4 md:p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Expertise</h3>
              <p className="text-sm md:text-base">Our deep market knowledge ensures you make informed decisions with confidence.</p>
            </div>
            <div className="p-4 md:p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Client Focus</h3>
              <p className="text-sm md:text-base">Your goals become our priorities, with personalized service at every step.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="my-8 md:my-16 text-center bg-gray-100 p-6 md:p-12 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to find your dream home?</h2>
          <button 
            onClick={scrollToContact}
            className="inline-block bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 active:scale-95"
          >
            Contact Our Team
          </button>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="my-8 md:my-16 scroll-mt-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-center">Contact Us</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-center mb-8 md:mb-12">
            Let's start a conversation about your real estate needs. Our team is ready to help you find your dream property.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8">
              <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
              
              {formSubmitted ? (
                <div className="text-center py-8">
                  <h4 className="text-xl font-bold text-green-600 mb-4">Thank You!</h4>
                  <p className="mb-6">Your message has been sent successfully. Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="propertyInterest" className="block text-gray-700 mb-1">I'm Interested In</label>
                    <select
                      id="propertyInterest"
                      name="propertyInterest"
                      value={formData.propertyInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="buying">Buying a Property</option>
                      <option value="selling">Selling a Property</option>
                      <option value="renting">Renting a Property</option>
                      <option value="investment">Property Investment</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 active:scale-95"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
            
            {/* Office Locations */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Our Offices</h3>
              
              <div className="space-y-6">
                {offices.map(office => (
                  <div key={office.id} className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
                    <h4 className="text-xl font-bold mb-2">{office.city}</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {office.address}
                      </p>
                      <p className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        {office.phone}
                      </p>
                      <p className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {office.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-center">Find Us</h3>
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              {/* This would be replaced with an actual map component in production */}
              <div className="text-center">
                <p className="text-gray-500 mb-2">Map would be displayed here</p>
                <p className="text-gray-400 text-sm">Using Google Maps, Mapbox, or other map service</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;