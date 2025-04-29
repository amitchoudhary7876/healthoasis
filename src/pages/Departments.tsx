import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api/departments`;

// Type for Department
interface Department {
  id: string;
  name: string;
  description: string;
}

const DepartmentCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-blue-50 text-healthoasis-blue">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 mb-4 text-center">{description}</p>
      <div className="text-center">
        <Link to={link} className="text-healthoasis-blue font-medium hover:text-blue-700 transition-colors">
          Learn More → 
        </Link>
      </div>
    </div>
  );
};

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('useEffect triggered'); // Log when useEffect is triggered

    const fetchDepartments = async () => {
      try {
        console.log('Fetching data from API...'); // Log when fetching starts
        console.log('API URL:', API_URL); // Log API URL for debugging

        const res = await fetch(API_URL);
        console.log('API response status:', res.status); // Log response status
        if (!res.ok) {
          throw new Error(`Failed to fetch departments: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Fetched data:', data); // Log fetched data

        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        console.log('Error fetching departments:', err); // Log errors
      } finally {
        setLoading(false);
        console.log('Loading finished'); // Log when loading finishes
      }
    };

    fetchDepartments();
  }, []); // Empty dependency array to run this only on component mount

  // Converts department name to lowercase slug, replacing spaces with '-'
  const slugify = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove non-word characters except hyphens

    return slug;
  };

  // Map department names to icons
  const departmentIcons: { [key: string]: keyof typeof LucideIcons } = {
    Cardiology: 'HeartPulse',
    Neurology: 'Brain',
    Pediatrics: 'Baby',
    Orthopedics: 'Bone',
    Ophthalmology: 'Eye',
    'General Medicine': 'Stethoscope',
    Pulmonology: 'Lungs',
    'Emergency Medicine': 'Siren',
  };

  const getIcon = (departmentName: string) => {
    const iconName = departmentIcons[departmentName];
    const IconComponent = LucideIcons[iconName] || LucideIcons.LayoutPanelTop;
    return <IconComponent size={28} />;
  };

  // Log departments state before rendering
  console.log('Departments state:', departments); // Log departments state

  return (
    <Layout>
      <PageHeader title="Our Departments" description="Specialized medical departments to serve your health needs" />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {loading && <p>Loading departments...</p>}
          {error && (
  <div className="min-h-[40vh] flex flex-col items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-healthoasis-blue text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-bold mb-2">Departments Not Found</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        We're sorry, the departments you were looking for couldn't be loaded or don't exist.
      </p>
      <a href="/" className="primary-button inline-flex items-center">Return to Home</a>
    </div>
  </div>
)}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                icon={getIcon(dept.name)}
                title={dept.name}
                description={dept.description}
                link={`/departments/${slugify(dept.name)}`}  // Updated link here
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Departments;
