import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const About = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side (Image) */}
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Medical team" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover transition-transform duration-500 transform hover:scale-105" 
            />
          </div>

          {/* Right Side (Content) */}
          <div className="order-1 md:order-2">
            <h3 className="text-xl md:text-2xl font-semibold text-healthoasis-blue dark:text-cyan-400 mb-2 relative inline-block after:block after:w-12 after:h-[2px] after:bg-healthoasis-blue dark:after:bg-cyan-400 after:mt-2">
              About HealthOasis
            </h3>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text dark:from-cyan-400 dark:to-blue-400 mb-6">
              Your Trusted Partner in Healthcare Excellence
            </h2>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              Since 1995, HealthOasis has delivered expert care to our community. Our modern facilities and skilled medical professionals are dedicated to patient-centered service with empathy and innovation.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-cyan-800 text-blue-600 dark:text-cyan-200 p-4 rounded-full shadow-md">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Experienced Doctors</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Over 50 certified professionals across various specialties.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-cyan-800 text-blue-600 dark:text-cyan-200 p-4 rounded-full shadow-md">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">24/7 Services</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Emergency support available at all times.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action Button (Uncomment if needed) */}
            {/* <Link
              to="/about"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              Learn More →
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
