import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import {
  FlaskConical,
  FileText,
  Clock,
  Calendar,
  Microscope,
  Heart,
  Droplets,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import labBanner from '@/image/lab-technicians-talking-video-call-with-professional-chemist-doctor-explaning-vaccine-reactions.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LabTests = () => {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, delay: 100 });
    AOS.refresh();
  }, []);

  const steps = [
    { step: 1, title: 'Schedule', desc: 'Book online or by phone' },
    { step: 2, title: 'Sample Collection', desc: 'Quick and painless' },
    { step: 3, title: 'Results', desc: 'Online or with your doctor' },
  ];

  const services = [
    {
      Icon: Heart,
      title: 'Hematology',
      desc: 'Blood counts, clotting studies, and other blood component analyses.',
    },
    {
      Icon: FlaskConical,
      title: 'Clinical Chemistry',
      desc: 'Measurement of chemicals and compounds in blood and bodily fluids.',
    },
    {
      Icon: Microscope,
      title: 'Microbiology',
      desc: 'Identification of bacteria, viruses, fungi, and parasites.',
    },
    {
      Icon: Droplets,
      title: 'Immunology',
      desc: 'Testing for immune system function and disorders.',
    },
  ];

  return (
    <Layout>
      <section
        className="relative bg-cover bg-center h-[400px]"
        style={{ backgroundImage: `url(${labBanner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-4">
              Advanced Laboratory Testing
            </h1>
            <p className="text-lg">
              Accurate, fast, and reliable diagnostics to support your care.
            </p>
          </div>
        </div>
      </section>

      <div className="py-12 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-healthoasis-blue dark:text-white">
                Advanced Diagnostic Testing
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Our state-of-the-art laboratory provides a wide range of
                diagnostic tests with precision and efficiency. We use the
                latest technology and methodologies to ensure accurate results
                for better healthcare decisions.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                All tests are conducted by our team of experienced lab
                technicians and pathologists, who adhere to strict quality
                control measures and international standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link to="/book-appointment" className="primary-button text-center">
                  Appointment
                </Link>
                <Link to="/contact" className="secondary-button text-center">
                  Contact Lab Department
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Laboratory testing"
                className="rounded-lg shadow-xl object-cover h-96"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Our Laboratory Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {services.map(({ Icon, title, desc }, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-4 rounded-full inline-flex mb-4 shadow-inner">
                    <Icon className="text-healthoasis-blue" />
                  </div>
                  <h3 className="font-bold mb-2 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Common Lab Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Blood Tests',
                  items: [
                    'Complete Blood Count (CBC)',
                    'Lipid Panel (Cholesterol)',
                    'Blood Glucose and HbA1c Tests',
                    'Liver Function Tests',
                    'Kidney Function Tests',
                  ],
                },
                {
                  title: 'Other Diagnostic Tests',
                  items: [
                    'Urinalysis',
                    'Thyroid Function Tests',
                    'Allergy Testing',
                    'Hormone Tests',
                    'Genetic Tests',
                  ],
                },
              ].map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-bold mb-3 dark:text-white">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-healthoasis-blue rounded-full mr-2"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-8 rounded-lg mb-16">
            <h3 className="text-xl font-bold mb-8 text-center dark:text-white">
              How It Works
            </h3>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-12">
              {steps.map(({ step, title, desc }, i) => (
                <React.Fragment key={i}>
                  <div
                    className="relative z-10 flex flex-col items-center text-center max-w-[200px]"
                    data-aos="fade"
                    data-aos-delay={i * 100}
                  >
                    <div className="w-14 h-14 mb-4 flex items-center justify-center text-xl font-bold rounded-full border-4 border-blue-600 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 shadow-md">
                      {step}
                    </div>
                    <h4 className="font-semibold text-lg mb-1 dark:text-white">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {desc}
                    </p>
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="hidden md:block w-16 h-1 bg-blue-300 dark:bg-blue-700 rounded-full"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex-1 flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <Clock className="text-healthoasis-blue" />
              </div>
              <div>
                <h3 className="font-bold mb-1 dark:text-white">Lab Hours</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monday-Friday: 7:00 AM - 7:00 PM<br />
                  Saturday: 8:00 AM - 2:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <Calendar className="text-healthoasis-blue" />
              </div>
              <div>
                <h3 className="font-bold mb-1 dark:text-white">Appointments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Walk-ins welcome for basic tests<br />
                  Appointments recommended for specialized tests
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <FileText className="text-healthoasis-blue" />
              </div>
              <div>
                <h3 className="font-bold mb-1 dark:text-white">Results</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Most results available within 24-48 hours<br />
                  Access online or through your doctor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LabTests;