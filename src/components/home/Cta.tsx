import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, Clock } from 'lucide-react';

const Cta = () => {
  const [workingHours, setWorkingHours] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    fetch(`${API_URL}/api/working-hours`)
      .then(res => res.json())
      .then(data => setWorkingHours(data))
      .catch(err => console.error("Failed to fetch working hours:", err));
  }, []);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute.padStart(2, '0')} ${suffix}`;
  };

  const getFormattedHours = () => {
    if (!workingHours.length) return [];

    const daysMap = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday',
    };

    const week: any = {};
    workingHours.forEach(day => {
      week[day.day_of_week] = day;
    });

    const output = [];

    const weekdayHours = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => week[d]);
    const isWeekdaySame = weekdayHours.every(
      (d) => d.start_time === weekdayHours[0].start_time && d.end_time === weekdayHours[0].end_time
    );
    if (isWeekdaySame) {
      output.push(`Mon–Fri: ${formatTime(weekdayHours[0].start_time)} - ${formatTime(weekdayHours[0].end_time)}`);
    }

    const sat = week['Saturday'];
    if (sat) {
      output.push(`Sat: ${sat.is_emergency_only ? 'Emergency Only' : `${formatTime(sat.start_time)} - ${formatTime(sat.end_time)}`}`);
    }

    const sun = week['Sunday'];
    if (sun) {
      output.push(`Sun: ${sun.is_emergency_only ? 'Emergency Only' : `${formatTime(sun.start_time)} - ${formatTime(sun.end_time)}`}`);
    }

    return output;
  };

  const hours = getFormattedHours();

  return (
    <section className="bg-healthoasis-blue dark:bg-gray-900 text-white py-16 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Emergency Contact */}
          <div className="bg-blue-700 bg-opacity-30 dark:bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4">
              <Phone className="text-healthoasis-blue" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Emergency Contact</h3>
            <p className="mb-3 text-white text-opacity-90 dark:text-gray-300">
              Available 24/7 for any medical emergency
            </p>
            <a href="tel:+1 (800) 989797" className="text-xl font-bold dark:text-white">
              +1 (800) 989797
            </a>
          </div>

          {/* Book Appointment */}
          <div className="bg-blue-700 bg-opacity-30 dark:bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4">
              <Calendar className="text-healthoasis-blue" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Book Appointment</h3>
            <p className="mb-3 text-white text-opacity-90 dark:text-gray-300">
              Schedule an appointment with our specialists
            </p>
            <Link
              to="/book-appointment"
              className="bg-white dark:bg-gray-100 text-healthoasis-blue px-4 py-2 rounded font-medium hover:bg-opacity-90 transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Working Hours */}
          <div className="bg-blue-700 bg-opacity-30 dark:bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4">
              <Clock className="text-healthoasis-blue" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Working Hours</h3>
            <ul className="space-y-2 text-white text-opacity-90 dark:text-gray-300">
              {hours.length > 0 ? (
                hours.map((line, idx) => <li key={idx}>{line}</li>)
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
