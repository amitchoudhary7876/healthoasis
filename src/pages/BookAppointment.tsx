
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import AppointmentForm from '@/components/appointments/AppointmentForm';

import { useSearchParams } from 'react-router-dom';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const [error, setError] = React.useState<string | null>(null);
  return (
    <Layout>
      <PageHeader 
        title="Book an Appointment" 
        description="Schedule a consultation with one of our experienced healthcare professionals"
      />
      <div className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
            {error && (
              <div className="min-h-[40vh] flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-healthoasis-blue text-6xl font-bold">404</h1>
                  <h2 className="text-2xl font-bold mb-2">Booking Error</h2>
                  <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                    We're sorry, the appointment could not be booked. The doctor or patient may not exist, or there was a critical error.
                  </p>
                  <a href="/" className="primary-button inline-flex items-center">Return to Home</a>
                </div>
              </div>
            )}
            {!error && (
  <>
    {doctorId && (
      <div className="mb-4 flex justify-end">
        <a
          href={`/doctor/${doctorId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Start Video Call with Doctor
        </a>
      </div>
    )}
    <h2 className="text-2xl font-bold mb-6">Appointment Request Form</h2>
    <AppointmentForm />
  </>
)}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
