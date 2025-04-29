import React from 'react';

const IconCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full inline-flex mb-4 text-blue-600 dark:text-blue-300">
        {icon}
      </div>
      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default IconCard;
