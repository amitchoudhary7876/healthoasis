
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { 
  Heart, Brain, Baby, Bone, Eye, Stethoscope, 
  Wind, Activity, Pill, Microscope 
} from 'lucide-react';

const departmentData: {
  [key: string]: {
    title: string;
    icon: JSX.Element;
    description: string;
    fullDescription: string;
    services: string[];
  };
} = {
  'cardiology': {
    title: 'Cardiology',
    icon: <Heart size={28} />,
    description: 'Specialized care for heart conditions and .',
    fullDescription: 'Our Cardiology Department is staffed by expert cardiologists who diagnose and treat diseases of the heart and blood vessels. We use advanced technology for both prevention and treatment of cardiovascular conditions.',
    services: [
      'Echocardiography',
      'Stress Testing',
      'Cardiac Catheterization',
      'Electrocardiogram (ECG)',
      'Heart Disease Management',
      'Pacemaker Implantation and Management'
    ]
  },
  'neurology': {
    title: 'Neurology',
    icon: <Brain size={28} />,
    description: 'Expert diagnosis and treatment for neurological disorders.',
    fullDescription: 'The Neurology Department specializes in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and nerves. Our team of neurologists uses cutting-edge technology to provide accurate diagnoses and effective treatment plans.',
    services: [
      'EEG (Electroencephalogram)',
      'EMG (Electromyography)',
      'Stroke Treatment and Prevention',
      'Epilepsy Management',
      'Multiple Sclerosis Treatment',
      'Headache Clinic'
    ]
  },
  'pediatrics': {
    title: 'Pediatrics',
    icon: <Baby size={28} />,
    description: 'Comprehensive healthcare for infants, children, and adolescents.',
    fullDescription: 'Our Pediatrics Department provides specialized care for children from birth through adolescence. Our pediatricians offer preventive care, treat common childhood illnesses, and manage chronic conditions with compassion and expertise.',
    services: [
      'Well-Child Visits',
      'Vaccinations',
      'Developmental Screening',
      'Pediatric Infectious Disease Management',
      'Child Nutrition Counseling',
      'Adolescent Medicine'
    ]
  },
  'orthopedics': {
    title: 'Orthopedics',
    icon: <Bone size={28} />,
    description: 'Treatment for bones, joints, ligaments, tendons, and muscles.',
    fullDescription: 'The Orthopedics Department focuses on the prevention, diagnosis, and treatment of disorders of the musculoskeletal system. Our orthopedic surgeons and specialists provide comprehensive care for bone and joint conditions.',
    services: [
      'Joint Replacement Surgery',
      'Sports Medicine',
      'Fracture Care',
      'Physical Therapy',
      'Spine Surgery',
      'Arthroscopic Surgery'
    ]
  },
  'ophthalmology': {
    title: 'Ophthalmology',
    icon: <Eye size={28} />,
    description: 'Complete eye care services for all ages.',
    fullDescription: 'Our Ophthalmology Department provides comprehensive eye care for patients of all ages. Our ophthalmologists diagnose and treat eye diseases, perform surgeries, and prescribe corrective lenses to improve and maintain vision health.',
    services: [
      'Comprehensive Eye Exams',
      'Cataract Surgery',
      'Glaucoma Treatment',
      'LASIK and Refractive Surgery',
      'Diabetic Eye Care',
      'Pediatric Ophthalmology'
    ]
  },
  'general-medicine': {
    title: 'General Medicine',
    icon: <Stethoscope size={28} />,
    description: 'Primary care for patients of all ages.',
    fullDescription: 'The General Medicine Department provides primary healthcare services for adults and older adolescents. Our internists diagnose and treat a wide range of conditions, focusing on preventive care and management of chronic diseases.',
    services: [
      'Annual Physical Examinations',
      'Health Screenings',
      'Chronic Disease Management',
      'Immunizations',
      'Health Education',
      'Minor Procedures'
    ]
  },
  'pulmonology': {
    title: 'Pulmonology',
    icon: <Wind size={28} />,
    description: 'Diagnosis and treatment of lung and respiratory disorders.',
    fullDescription: 'Our Pulmonology Department specializes in the diagnosis and treatment of respiratory conditions. Our pulmonologists use advanced diagnostic techniques and treatment methods to care for patients with lung and breathing disorders.',
    services: [
      'Pulmonary Function Testing',
      'Bronchoscopy',
      'Asthma Management',
      'COPD Treatment',
      'Sleep Apnea Diagnosis and Management',
      'Pulmonary Rehabilitation'
    ]
  },
  'emergency-medicine': {
    title: 'Emergency Medicine',
    icon: <Activity size={28} />,
    description: 'Immediate care for acute illnesses and injuries.',
    fullDescription: 'The Emergency Medicine Department provides immediate medical care for acute illnesses and injuries. Our emergency physicians are trained to handle a wide range of medical emergencies, from minor injuries to life-threatening conditions.',
    services: [
      'Trauma Care',
      'Cardiac Emergencies',
      'Stroke Treatment',
      'Pediatric Emergencies',
      'Wound Care',
      'Critical Care'
    ]
  },
  'pharmacy': {
    title: 'Pharmacy',
    icon: <Pill size={28} />,
    description: 'Comprehensive medication dispensing and consultation services.',
    fullDescription: 'Our Pharmacy Department provides medication dispensing and consultation services to inpatients and outpatients. Our pharmacists work with healthcare providers to ensure safe and effective medication use.',
    services: [
      'Prescription Filling',
      'Medication Counseling',
      'Medication Therapy Management',
      'Compounding Services',
      'Immunizations',
      'Specialty Medications'
    ]
  },
  'laboratory': {
    title: 'Laboratory',
    icon: <Microscope size={28} />,
    description: 'Advanced diagnostic testing and analysis.',
    fullDescription: 'The Laboratory Department provides diagnostic testing to aid in disease diagnosis, treatment, and prevention. Our laboratory technologists and pathologists use state-of-the-art equipment to perform a wide range of tests.',
    services: [
      'Blood Tests',
      'Urinalysis',
      'Microbiology',
      'Histopathology',
      'Cytology',
      'Molecular Diagnostics'
    ]
  }
};

const DepartmentDetail = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const department = departmentId ? departmentData[departmentId] : null;

  if (!department) {
    return (
      <Layout>
        <PageHeader title="Department Not Found" description="The department you're looking for doesn't exist." />
        <div className="container-custom py-16 text-center">
          <p>We couldn't find the department you're looking for. Please check the URL or return to the departments page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title={department.title} description={department.description} />
      
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-center mb-8">
            <div className="p-6 rounded-full bg-blue-50 text-healthoasis-blue">
              {department.icon}
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-8 text-center">
              {department.fullDescription}
            </p>
            
            <h3 className="text-2xl font-bold mb-4 text-center">Our Services</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-healthoasis-blue mr-3"></div>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DepartmentDetail;
