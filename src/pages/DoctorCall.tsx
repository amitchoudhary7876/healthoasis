import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZegoCall from '@/components/videocall/ZegoCall';

const DoctorCall = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  
  useEffect(() => {
    if (!doctorId) {
      setError('Doctor ID is missing');
      setLoading(false);
      return;
    }
    
    // Fetch doctor details to get the name
    fetch(`${API_URL}/api/doctors/${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch doctor. Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDoctorName(data.name || 'Doctor');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctor:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, [doctorId, API_URL]);
  
  const handleCloseCall = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Connecting to video call...</p>
        </div>
      </div>
    );
  }
  
  if (error || !doctorId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error Joining Video Call</h1>
          <p className="text-gray-600 mb-6">{error || 'Doctor ID is missing or invalid.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ZegoCall
        roomID={`doctor-${doctorId}`}
        userID={`doctor-${doctorId}`}
        userName={`Dr. ${doctorName}`}
        onClose={handleCloseCall}
      />
    </div>
  );
};

export default DoctorCall;
