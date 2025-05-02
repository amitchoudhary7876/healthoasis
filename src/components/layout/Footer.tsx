import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const [workingHours, setWorkingHours] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/working-hours`)
      .then((res) => res.json())
      .then((data) => setWorkingHours(data))
      .catch((err) => console.error("Failed to fetch working hours:", err));
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  return (
    <footer className="bg-healthoasis-blue dark:bg-gray-900 text-white dark:text-gray-300 transition-colors duration-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-100">HealthOasis</h3>
            <p className="text-sm text-white/90 dark:text-gray-400">Providing quality healthcare services with compassion and excellence since 1995.</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/login" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/login" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/accounts/login/" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white dark:text-gray-100">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Home</Link></li>
              <li><Link to="/departments" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Doctors</Link></li>
              <li><Link to="/contact" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white dark:text-gray-100">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/emergency-care" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Emergency Care</Link></li>
              <li><Link to="/services/lab-tests" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Lab Tests</Link></li>
              <li><Link to="/services/medical-checkups" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Medical Checkups</Link></li>
              <li><Link to="/services/vaccinations" className="hover:text-white/80 dark:hover:text-gray-200 transition-colors">Vaccinations</Link></li>
            </ul>
          </div>

          {/* Contact Info & Working Hours */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white dark:text-gray-100">Contact Info</h4>
            <ul className="space-y-3 text-white/90 dark:text-gray-300">
              <li className="flex items-center"><MapPin size={18} className="mr-2" /><span>123 HealthCare Avenue, Medical District, NY 10001</span></li>
              <li className="flex items-center"><Phone size={18} className="mr-2" /><span>+1 (800) 989797</span></li>
              <li className="flex items-center"><Mail size={18} className="mr-2" /><span>info@healthoasis.com</span></li>
              <li className="flex items-start">
                <Clock size={18} className="mr-2 mt-1" />
                <div>
                  <h5 className="font-semibold mb-2 text-white dark:text-gray-100">Working Hours</h5>
                  {workingHours.length > 0 ? (
                    <>
                      <p>Mon–Fri: {formatTime('08:00:00')} - {formatTime('20:00:00')}</p>
                      <p>Sat: {formatTime('09:00:00')} - {formatTime('17:00:00')}</p>
                      <p>Sun: Emergency Only</p>
                    </>
                  ) : (
                    <p>Loading hours...</p>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-healthoasis-blue dark:bg-gray-800 border-t border-white/20 dark:border-gray-700 py-4 transition-colors">
        <div className="container-custom text-center text-sm text-white/90 dark:text-gray-400">
          <p> 2025 HealthOasis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
