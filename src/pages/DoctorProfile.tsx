import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import VideoCallModal from '@/components/videocall/VideoCallModal';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Doctor type
type Doctor = {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  profile_image_url: string;
  bio?: string;
  education?: string;
  experience?: string;
  availability_status?: 'available' | 'busy' | 'offline';
};

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Doctor ID is missing');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch doctor. Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDoctor(data);
      })
      .catch((err) => {
        console.error('Error fetching doctor:', err);
        setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleVideoCallClick = () => {
    // Check if doctor is available
    if (doctor?.availability_status === 'offline') {
      alert('Doctor is currently unavailable for video call.');
      return;
    }
    
    setShowVideoCallModal(true);
  };

  const handleCloseVideoCall = () => {
    setShowVideoCallModal(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <p className="text-center">Loading doctor profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-healthoasis-blue text-9xl font-bold">404</h1>
            <h2 className="text-3xl font-bold mb-4">Doctor Not Found</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              We're sorry, the doctor profile you were looking for doesn't exist or has been moved.
            </p>
            <button 
              onClick={() => navigate('/doctors')}
              className="primary-button inline-flex items-center"
            >
              Return to Doctors
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title={doctor.name} description={doctor.specialization} />
      
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctor Image and Quick Info */}
            <div className="md:col-span-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <img
                  src={doctor.profile_image_url || 'https://placehold.co/300x400?text=No+Image'}
                  alt={doctor.name}
                  className="w-full h-auto rounded-lg mb-6 object-cover"
                />
                
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                
                <div className="space-y-3">
                  <p className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium mr-2">Email:</span> {doctor.email}
                  </p>
                  <p className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium mr-2">Phone:</span> {doctor.phone}
                  </p>
                  <p className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium mr-2">Status:</span> 
                    <span className={`ml-2 inline-block w-3 h-3 rounded-full ${
                      doctor.availability_status === 'available' ? 'bg-green-500' : 
                      doctor.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="ml-2">{doctor.availability_status || 'Unknown'}</span>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <button 
                    onClick={handleVideoCallClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Start Video Call
                  </button>
                </div>
              </div>
            </div>
            
            {/* Doctor Details */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-3">
                  About Dr. {doctor.name}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Biography</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {doctor.bio || 'No biography available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Education</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {doctor.education || 'No education information available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Experience</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {doctor.experience || 'No experience information available.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Call Modal */}
      {showVideoCallModal && (
        <VideoCallModal 
          doctorId={doctor.id}
          doctorName={doctor.name}
          onClose={handleCloseVideoCall}
        />
      )}
    </Layout>
  );
};

export default DoctorProfile;
