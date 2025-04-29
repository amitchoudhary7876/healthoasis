
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-healthoasis-blue py-16 text-white text-center">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="max-w-3xl mx-auto text-lg">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
