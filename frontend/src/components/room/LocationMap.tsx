import React from 'react';
import Map from '@/components/MapWrapper';

interface LocationMapProps {
  street: string;
  location: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({ street, location }) => {
  return (
    <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
      <Map
        address={`${street}, ${location}`}
        className="h-full w-full"
        zoom={15}
      />
    </div>
  );
};