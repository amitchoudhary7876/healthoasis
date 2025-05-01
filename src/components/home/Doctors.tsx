import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
type Doctor = {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  profile_image_url: string;
};

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <Link to={`/doctors/${doctor.id}`} className="block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
        <img src={doctor.profile_image_url} alt={doctor.name} className="w-full h-56 object-cover" />
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold dark:text-white mb-2">{doctor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doctor.specialization}</p>
        </div>
      </div>
    </Link>
  );
};

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Home: Fetching doctors from:', `${API_URL}/api/doctors`);
    
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doctors`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'omit' // Don't include credentials to avoid CORS issues
        });

        console.log('Home: Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Home: Error response:', errorText);
          throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Home: Fetched doctors data:', data);
        
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setDoctors(data.data);
        } else {
          console.error('Home: Unexpected data format:', data);
          throw new Error('Unexpected doctors format received');
        }
      } catch (error) {
        console.error('Home: Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Doctors
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our team of highly qualified and dedicated doctors are committed to providing you with the best medical care.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/doctors"
            className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-6 py-3 rounded-full shadow transition"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
