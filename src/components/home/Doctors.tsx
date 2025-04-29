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

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={doctor.profile_image_url}
        alt={doctor.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {doctor.name}
        </h3>
        {/* Uncomment if you want specialization info */}
        {/* <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialization}</p> */}
      </div>
    </div>
  );
};

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/doctors`)
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      });
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
