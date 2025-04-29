import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Brain, Baby, Bone, Eye, Stethoscope, Activity,
} from 'lucide-react';
import axios from 'axios';

const iconMap: Record<string, JSX.Element> = {
  cardiology: <Heart size={28} />,
  neurology: <Brain size={28} />,
  pediatrics: <Baby size={28} />,
  orthopedics: <Bone size={28} />,
  ophthalmology: <Eye size={28} />,
  'general medicine': <Stethoscope size={28} />,
};

interface Department {
  id: number;
  name: string;
  description: string;
  slug: string;
}

const DepartmentCard = ({ icon, title, description, link }: {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
}) => (
  <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
    <div className="flex justify-center mb-4">
      <div className="p-4 rounded-full bg-blue-50 dark:bg-cyan-900 text-healthoasis-blue dark:text-cyan-300 shadow">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-center">
      {description}
    </p>
  </div>
);

const Services = () => {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

    axios.get(`${API_URL}/api/departments`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setDepartments(data.data);
        } else {
          throw new Error('Departments data is not an array.');
        }
      })
      .catch((err) => {
        setError('Failed to load departments.');
        console.error('Error loading departments:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-healthoasis-blue dark:text-cyan-400">
            Specialized Medical Departments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our hospital is equipped with top departments to deliver personalized care across medical disciplines.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading departments...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(departments) &&
              departments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  icon={iconMap[dept.name.toLowerCase()] || <Activity size={28} />}
                  title={dept.name}
                  description={dept.description}
                  link={`/departments/${dept.slug}`}
                />
              ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/departments"
            className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-6 py-3 rounded-full shadow transition"
          >
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
