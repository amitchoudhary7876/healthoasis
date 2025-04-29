// pages/MedicalCheckups.tsx
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Stethoscope, Heart, Activity, Calendar } from 'lucide-react';
import CheckupCard from '@/components/common/CheckupCard';
import IconCard from '@/components/common/IconCard';
import { Link } from 'react-router-dom';

const MedicalCheckups = () => {
  return (
    <Layout>
      <PageHeader 
        title="Medical Checkups" 
        description="Comprehensive Health Screenings and Preventive Care"
      />
      
      <div className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-healthoasis-blue">Prioritize Your Health With Regular Checkups</h2>
              <p className="mb-4">
                Our comprehensive medical checkup programs are designed to detect potential health issues 
                before they become serious, helping you maintain optimal health through preventive care.
              </p>
              <p className="mb-4">
                Each checkup is conducted by experienced healthcare professionals using advanced diagnostic 
                equipment to provide you with thorough assessments and personalized health recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link to="/book-appointment" className="primary-button text-center">
                  Schedule a Checkup
                </Link>
                <Link to="/contact" className="secondary-button text-center">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Doctor reviewing medical results with patient" 
                className="rounded-lg shadow-xl object-cover h-96"
              />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Health Checkup Packages</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CheckupCard 
                title="Essential Health Screening" 
                description="A fundamental checkup covering essential health parameters."
                icon={<Stethoscope />}
                price="$199"
              />
              <CheckupCard 
                title="Complete Health Assessment" 
                description="A thorough examination to assess your overall health."
                icon={<Heart />}
                price="$399"
              />
              <CheckupCard 
                title="Executive Health Screening" 
                description="Our most advanced health assessment with specialized tests."
                icon={<Activity />}
                price="$599"
              />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Why Regular Checkups Matter</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <IconCard 
                icon={<Stethoscope />}
                title="Early Detection"
                description="Identify health issues before symptoms appear."
              />
              <IconCard 
                icon={<Heart />}
                title="Disease Prevention"
                description="Helps prevent the development of chronic conditions."
              />
              <IconCard 
                icon={<Activity />}
                title="Lifestyle Guidance"
                description="Personalized advice on diet, exercise, and healthy habits."
              />
              <IconCard 
                icon={<Calendar />}
                title="Long-term Monitoring"
                description="Track health changes over time."
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalCheckups;
