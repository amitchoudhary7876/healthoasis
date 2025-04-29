import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Phone, Clock, MapPin, AlertTriangle, HeartPulse, Ambulance } from 'lucide-react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';  // Import AOS styles

const EmergencyCare = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });  // Customize duration if necessary
  }, []);

  return (
    <Layout>
      <PageHeader 
        title="Emergency Care" 
        description="24/7 Emergency Medical Services"
      />
      
      <div className="py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6 text-healthoasis-blue dark:text-white">Immediate Care When You Need It Most</h2>
              <p className="mb-4">
                Our emergency department is fully equipped to handle all types of medical emergencies, 
                with a team of experienced emergency physicians, nurses, and support staff available around the clock.
              </p>
              <p className="mb-4">
                We provide immediate assessment and treatment for all emergency conditions, from minor injuries to 
                life-threatening situations, ensuring prompt and effective care when time is of the essence.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 dark:bg-red-800 dark:border-red-500">
                <div className="flex items-start">
                  <AlertTriangle className="text-red-600 mr-3 mt-1 dark:text-red-400" />
                  <div>
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">In case of emergency:</h3>
                    <p className="mt-1">Call 911 immediately or go to your nearest emergency department.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center" data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Emergency care" 
                className="rounded-lg shadow-xl object-cover h-80 transition-all transform hover:scale-105 hover:shadow-2xl duration-300"
              />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="w-full px-4 md:px-0 mb-16">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full border-t-4 border-red-500 dark:bg-gray-800 dark:border-red-600">
              <h3 className="font-bold text-2xl mb-6 text-center text-gray-900 dark:text-gray-100">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Emergency Hotline */}
                <div className="flex items-start hover:bg-red-50 p-4 rounded-md transition-all duration-300 dark:hover:bg-red-600" data-aos="fade-up">
                  <div className="bg-red-100 p-4 rounded-full mr-4 dark:bg-red-600">
                    <Phone className="text-red-600 text-2xl dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Emergency Hotline</h4>
                    <a href="tel:+1 (800) 989797" className="text-red-600 font-bold text-lg hover:underline dark:text-red-400">+1 (800) 989797</a>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Available 24/7</p>
                  </div>
                </div>

                {/* Ambulance Services */}
                <div className="flex items-start hover:bg-red-50 p-4 rounded-md transition-all duration-300 dark:hover:bg-red-600" data-aos="fade-up" data-aos-delay="100">
                  <div className="bg-red-100 p-4 rounded-full mr-4 dark:bg-red-600">
                    <Ambulance className="text-red-600 text-2xl dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Ambulance Services</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Rapid response medical transportation</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start hover:bg-red-50 p-4 rounded-md transition-all duration-300 dark:hover:bg-red-600" data-aos="fade-up" data-aos-delay="200">
                  <div className="bg-red-100 p-4 rounded-full mr-4 dark:bg-red-600">
                    <Clock className="text-red-600 text-2xl dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Operating Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">24 hours / 7 days a week</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start hover:bg-red-50 p-4 rounded-md transition-all duration-300 dark:hover:bg-red-600" data-aos="fade-up" data-aos-delay="300">
                  <div className="bg-red-100 p-4 rounded-full mr-4 dark:bg-red-600">
                    <MapPin className="text-red-600 text-2xl dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Location</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Emergency Department Entrance<br />
                      East Wing, Ground Floor<br />
                      123 HealthCare Avenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Services Section */}
          <div className="bg-gray-50 p-8 rounded-lg mb-16 dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Emergency Services We Provide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow transition-all transform hover:scale-105 hover:shadow-2xl duration-300 dark:bg-gray-700 dark:text-white" data-aos="fade-up">
                <div className="bg-red-100 p-3 rounded-full inline-flex mb-4 dark:bg-red-600">
                  <HeartPulse className="text-red-600 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Critical Care</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced life support and treatment for severe medical emergencies, including heart attacks, strokes, and severe injuries.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow transition-all transform hover:scale-105 hover:shadow-2xl duration-300 dark:bg-gray-700 dark:text-white" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-red-100 p-3 rounded-full inline-flex mb-4 dark:bg-red-600">
                  <AlertTriangle className="text-red-600 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trauma Care</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Specialized care for serious injuries from accidents, falls, and other traumatic incidents.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow transition-all transform hover:scale-105 hover:shadow-2xl duration-300 dark:bg-gray-700 dark:text-white" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-red-100 p-3 rounded-full inline-flex mb-4 dark:bg-red-600">
                  <Ambulance className="text-red-600 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Emergency Surgery</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Immediate surgical intervention for life-threatening conditions requiring urgent operation.
                </p>
              </div>
            </div>
          </div>

          {/* Non-Emergency Assistance Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Need Non-Emergency Medical Assistance?</h2>
            <p className="mb-8 max-w-3xl mx-auto dark:text-gray-300">
              For non-emergency medical concerns, consider scheduling a regular appointment with one of our specialists.
            </p>
            <Link to="/book-appointment" className="primary-button hover:scale-105 transform transition duration-300">
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyCare;
