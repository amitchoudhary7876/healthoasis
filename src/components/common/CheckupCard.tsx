import React from 'react';

const CheckupCard = ({ title, description, icon, price }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4 text-healthoasis-blue dark:text-blue-400">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <span className="text-healthoasis-blue dark:text-blue-400 font-bold">{price}</span>
    </div>
  );
};

export default CheckupCard;
