import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import ZegoCall from '@/components/videocall/ZegoCall';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

// Fallback image URL
const fallbackImage = 'https://placehold.co/300x400?text=No+Image';

// Doctor type
type Doctor = {
  specialization: string;
  id: number;
  name: string;
  specialty: string;
  profile_image_url: string;
  availability_status?: 'available' | 'busy' | 'offline';
  email?: string;
};

// Card Component
const DoctorCard = ({ id, name, specialty, image, availability = 'available', doctor }: { id: number; name: string; specialty: string; image: string; availability?: string; doctor: Doctor }) => {
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleVideoCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open video call immediately
    setShowVideoCall(true);
    // Send invite in background
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    fetch(`${API_URL}/api/video-call/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorEmail: 'adishsingla64@gmail.com',
        patientName: user.name || 'Patient',
        patientId: user.id || null
      })
    }).then(res => res.json()).then(data => console.log('Invite:', data)).catch(console.error);
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
  };
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{specialty}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${availability === 'available' ? 'bg-green-500' : availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-500">{availability === 'available' ? 'Available' : availability === 'busy' ? 'Busy' : 'Offline'}</span>
            </div>
            
            <button
              onClick={handleVideoCall}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video Call
              </span>
              <span className="absolute inset-0 bg-white opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </div>
        </div>
      </div>
      
      {showVideoCall && (
        <ZegoCall
          roomID={`doctor-${id}-${Date.now()}`}
          userID={`patient-${Date.now()}`}
          userName={`Patient for Dr. ${name}`}
          onClose={closeVideoCall}
        />
      )}
    </>
  );
};

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Fetching doctors from:', `${API_URL}/api/doctors`);
    
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doctors`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Don't include credentials to avoid CORS issues
          credentials: 'omit'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.log('Non-JSON response:', text);
          throw new Error(`Expected JSON, got non-JSON response`);
        }

        const data = await response.json();
        console.log('Fetched doctors data:', data);
        
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setDoctors(data.data);
        } else {
          console.error('Unexpected data format:', data);
          throw new Error('Unexpected doctors format received');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Layout>
      <PageHeader title="Our Doctors" description="Meet our team of highly qualified and dedicated doctors" />
      <section className="py-12">
        <div className="container-custom">
          {loading && <p>Loading doctors...</p>}
          {error && (
  <div className="min-h-[40vh] flex flex-col items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-healthoasis-blue text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-bold mb-2">Doctors Not Found</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        We're sorry, the doctors you were looking for couldn't be loaded or don't exist.
      </p>
      <a href="/" className="primary-button inline-flex items-center">Return to Home</a>
    </div>
  </div>
)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {!loading &&
              !error &&
              Array.isArray(doctors) &&
              doctors.map((doctor) => (
                <div key={doctor.id}>
                  <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    name={doctor.name}
                    specialty={doctor.specialization}
                    image={doctor.profile_image_url || fallbackImage}
                    availability={doctor.availability_status || 'available'}
                    doctor={doctor}
                  />
                </div>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
