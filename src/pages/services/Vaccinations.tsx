import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Syringe, Shield, Baby, Users, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Vaccinations = () => {
  return (
    <Layout>
      <PageHeader 
        title="Vaccinations" 
        description="Protect Yourself and Your Loved Ones"
      />
      
      <div className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-healthoasis-blue dark:text-white">Comprehensive Vaccination Services</h2>
              <p className="mb-4 text-gray-800 dark:text-gray-300">
                At HealthOasis, we offer a complete range of vaccinations for patients of all ages,
                from childhood immunizations to adult boosters and travel vaccines.
              </p>
              <p className="mb-4 text-gray-800 dark:text-gray-300">
                Our vaccination services are administered by qualified healthcare professionals who follow 
                the highest safety standards and keep up with the latest immunization guidelines.
              </p>
              <div className="bg-blue-50 dark:bg-blue-800 border-l-4 border-healthoasis-blue dark:border-blue-500 p-4 mt-6">
                <div className="flex items-start">
                  <Shield className="text-healthoasis-blue dark:text-white mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-healthoasis-blue dark:text-white">Why vaccinate?</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Vaccinations are one of the most effective ways to prevent infectious diseases and protect both individual and public health.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Vaccination" 
                className="rounded-lg shadow-xl object-cover h-96"
              />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-healthoasis-blue dark:text-white">Our Vaccination Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-healthoasis-blue dark:border-blue-500">
                <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full inline-flex mb-4">
                  <Baby className="text-healthoasis-blue dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-healthoasis-blue dark:text-white">Childhood Vaccinations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Complete immunization program for infants and children following recommended schedules.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>DTaP (Diphtheria, Tetanus, Pertussis)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>MMR (Measles, Mumps, Rubella)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Polio vaccine</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Hepatitis A & B</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>And more...</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-healthoasis-blue dark:border-blue-500">
                <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full inline-flex mb-4">
                  <Users className="text-healthoasis-blue dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-healthoasis-blue dark:text-white">Adult Vaccinations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Essential vaccines and boosters for adults to maintain immunity throughout life.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Influenza (Flu) vaccine</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Td/Tdap (Tetanus, Diphtheria, Pertussis)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Pneumococcal vaccines</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Shingles vaccine</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>And more...</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-healthoasis-blue dark:border-blue-500">
                <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full inline-flex mb-4">
                  <Syringe className="text-healthoasis-blue dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-healthoasis-blue dark:text-white">Travel Vaccinations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Specialized immunizations for international travelers based on destination requirements.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Yellow Fever</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Typhoid</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Malaria prevention</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>Japanese Encephalitis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2">✓</div>
                    <span>And more...</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold mb-6 text-healthoasis-blue dark:text-white">Vaccination Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 border-2 border-healthoasis-blue text-healthoasis-blue dark:text-white">
                  1
                </div>
                <h3 className="font-bold mb-2 text-healthoasis-blue dark:text-white">Consultation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Meet with our healthcare provider to discuss your vaccination needs
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 border-2 border-healthoasis-blue text-healthoasis-blue dark:text-white">
                  2
                </div>
                <h3 className="font-bold mb-2 text-healthoasis-blue dark:text-white">Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Health assessment to ensure safety and review vaccination history
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 border-2 border-healthoasis-blue text-healthoasis-blue dark:text-white">
                  3
                </div>
                <h3 className="font-bold mb-2 text-healthoasis-blue dark:text-white">Administration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Quick and safe administration of the vaccine by trained professionals
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 border-2 border-healthoasis-blue text-healthoasis-blue dark:text-white">
                  4
                </div>
                <h3 className="font-bold mb-2 text-healthoasis-blue dark:text-white">Follow-up</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Post-vaccination guidance and scheduling of any follow-up doses
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 dark:bg-blue-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-healthoasis-blue dark:text-white">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg text-healthoasis-blue dark:text-white font-semibold">What vaccines are recommended for adults?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Adults should receive vaccines like the flu vaccine, shingles vaccine, and pneumococcal vaccines, along with other age-specific vaccines.</p>
                </div>
                <div>
                  <h4 className="text-lg text-healthoasis-blue dark:text-white font-semibold">Do I need to get vaccinated if I am healthy?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Yes, vaccines are essential for protecting yourself and others, even if you feel healthy.</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-healthoasis-blue dark:text-white">Contact Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">For more information or to schedule an appointment, feel free to contact us.</p>
              <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vaccinations;
