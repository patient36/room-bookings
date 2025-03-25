import React from 'react';
import { formatNumber } from '@/utils/formatNumbers';

interface AmenitiesListProps {
  amenities: string[];
  availability: string;
  price: number;
}

export const AmenitiesList: React.FC<AmenitiesListProps> = ({ amenities, availability, price }) => {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {amenities.map((amenity, index) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
          >
            {amenity}
          </span>
        ))}
      </div>
      <div className="flex flex-col p-2 gap-4 mt-4">
        <h2 className='text-blue-500 font-bold' >
          Open: <span className=" text-pink-700 px-4 py-2  text-sm font-medium">{availability}</span>
        </h2>
        <h2 className='text-blue-500 font-bold' >
          Price: <span className=" text-yellow-500 px-4 py-2  text-sm font-medium">RWF {formatNumber(price)}/hour</span>
        </h2>
      </div>
    </>
  );
};