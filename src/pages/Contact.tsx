import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
const CONTACT_INFO_API = `${API_BASE_URL}/api/contact-info`;
const MESSAGE_API = `${API_BASE_URL}/api/messages`;

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email_address: '',
    subject: '',
    message_text: '',
  });

  useEffect(() => {
    fetch(CONTACT_INFO_API)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contact info');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setContactInfo(data[0]);
        } else {
          throw new Error('No contact info available');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { full_name, email_address, subject, message_text } = formData;

    if (!full_name || !email_address || !subject || !message_text) {
      toast.error('All fields are required');
      return;
    }

    if (!isValidEmail(email_address)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (message_text.length < 10) {
      toast.error('Message should be at least 10 characters long');
      return;
    }

    try {
      const res = await fetch(MESSAGE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully!');
      setFormData({ full_name: '', email_address: '', subject: '', message_text: '' });
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <Layout>
      <PageHeader title="Contact Us" description="Get in touch with our healthcare professionals" />

      <ToastContainer position="top-right" autoClose={4000} />

      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-healthoasis-blue dark:text-white">Contact Information</h2>
              {loading && <p className="dark:text-white">Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {contactInfo && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="text-healthoasis-blue mr-4 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-zinc-300">Main: {contactInfo.phone_main}</p>
                      <p className="text-gray-600 dark:text-zinc-300">Emergency: {contactInfo.phone_emergency}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="text-healthoasis-blue mr-4 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-zinc-300">{contactInfo.email_info}</p>
                      <p className="text-gray-600 dark:text-zinc-300">{contactInfo.email_appointments}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-healthoasis-blue mr-4 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-zinc-300">{contactInfo.location_address}</p>
                      <p className="text-gray-600 dark:text-zinc-300">{contactInfo.location_city}, {contactInfo.location_zip}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="text-healthoasis-blue mr-4 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">Working Hours</h3>
                      <p className="text-gray-600 dark:text-zinc-300">Mon–Fri: 9:00 AM – 5:00 PM</p>
                      <p className="text-gray-600 dark:text-zinc-300">Sat: 10:00 AM – 2:00 PM</p>
                      <p className="text-gray-600 dark:text-zinc-300">Sun: Closed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-healthoasis-blue dark:text-white">Send Us a Message</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-healthoasis-blue focus:ring-healthoasis-blue"
                  />
                </div>

                <div>
                  <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email_address"
                    value={formData.email_address}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-healthoasis-blue focus:ring-healthoasis-blue"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-healthoasis-blue focus:ring-healthoasis-blue"
                  />
                </div>

                <div>
                  <label htmlFor="message_text" className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">Message</label>
                  <textarea
                    id="message_text"
                    rows={4}
                    value={formData.message_text}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-healthoasis-blue focus:ring-healthoasis-blue"
                  ></textarea>
                </div>

                <button type="submit" className="primary-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
