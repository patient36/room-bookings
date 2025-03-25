import React from 'react';

interface RoomHeaderProps {
  name: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ name }) => {
  return (
    <h1 className="text-3xl font-extrabold text-pink-500 mb-2">
      {name}
    </h1>
  );
};