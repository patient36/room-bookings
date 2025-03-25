import React, { useState } from 'react';
import Image from 'next/image';
import ImageModal from '@/components/GalleryModel';

interface RoomGalleryProps {
  images: string[];
  name: string;
}

export const RoomGallery: React.FC<RoomGalleryProps> = ({ images, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={`${name} image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
              priority={index < 2}
            />
          </div>
        ))}
      </div>

      {images.length > 4 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 py-2 px-4 bg-black/50 hover:bg-black rounded-lg font-medium text-white cursor-pointer transition-all"
        >
          View all {images.length} photos
        </button>
      )}

      {isModalOpen && (
        <ImageModal images={images} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};