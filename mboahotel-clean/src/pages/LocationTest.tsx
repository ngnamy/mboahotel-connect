import React from 'react';
import LocationDemo from '../components/LocationDemo';

const LocationTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <LocationDemo />
      </div>
    </div>
  );
};

export default LocationTest;