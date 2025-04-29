import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import img1 from '../../image/portrait-female-pediatrician-work.jpg';
import img2 from '../../image/male-patient-bed-talking-nurse.jpg';
import img3 from '../../image/close-up-doctor-with-stethoscope.jpg';
import img4 from '../../image/doctor-with-face-mask-against-covid19-discussing-with-nurse-hospital-waiting-area-disabled-senior-woman-wheelchair-waiting-examination-assistant-working-reception-computer.jpg';
import img5 from '../../image/medium-shot-nurse-doctor-checking-patient.jpg';

const heroImages = [
  { url: img1, alt: 'Female Pediatrician' },
  { url: img2, alt: 'Patient with Nurse' },
  { url: img3, alt: 'Doctor with Stethoscope' },
  { url: img4, alt: 'Doctor with Mask & Nurse' },
  { url: img5, alt: 'Nurse Checking Patient' },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const length = heroImages.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, length]);

  const prevSlide = () =>
    setCurrentIndex(currentIndex === 0 ? length - 1 : currentIndex - 1);
  const nextSlide = () => setCurrentIndex((currentIndex + 1) % length);

  return (
    <section
      className="relative w-full h-[100dvh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black/60" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 h-full flex items-center">
        <div
          className="text-white dark:text-gray-100 max-w-2xl animate-fade-in-up"
          key={currentIndex}
        >
          <h2 className="text-xl mb-2 font-light text-white dark:text-gray-300">
            Welcome to HealthOasis
          </h2>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Your Health Is Our <br /> Top Priority
          </h1>
          <p className="text-base sm:text-lg mb-8 text-gray-200 dark:text-gray-300">
            Providing exceptional healthcare services with compassion and
            cutting-edge technology to ensure your wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book-appointment">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
                Book Appointment
              </button>
            </Link>
            <Link to="/contact">
              <button className="bg-white text-gray-900 dark:bg-gray-100 dark:text-gray-900 px-6 py-3 rounded-md font-bold hover:bg-gray-200 dark:hover:bg-gray-300 transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex
                ? 'bg-white dark:bg-gray-200'
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
