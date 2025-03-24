"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageModal from '@/components/GalleryModel';
import { images } from '../rooms';

interface Room {
    _id: string;
    name: string;
    description: string;
    area: string;
    street: string;
    location: string;
    availability: string;
    amenities: [string];
    owner: string;
    price_per_hour: number;
    capacity: number;
    images: string[];
}

const Room = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);

    const [room, setRoom] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/booker/rooms/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch room data');
                }
                const data = await response.json();
                setRoom(data.room);
            } catch (error) {
                console.error('Error fetching room:', error);
                setError('Failed to load room data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    if (!room) {
        return <div className="flex items-center justify-center h-screen">Room not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Grid (2x2) */}
                <div className="grid grid-cols-2 gap-2 p-2">
                    {room.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative aspect-square">
                            <Image
                                src={image}
                                alt={`Room ${room.name} image ${index + 1}`}
                                fill // Fill the container
                                className="object-cover rounded-lg" // Ensure the image covers the square
                            />
                        </div>
                    ))}
                </div>

                {/* "View All" Button */}
                {room.images.length > 4 && (
                    <div className="p-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-black bg-opacity-50 text-white py-2 px-4 rounded-lg hover:bg-opacity-75 transition-colors duration-200"
                        >
                            View All ({room.images.length} Photos)
                        </button>
                    </div>
                )}

                {/* Room Details Card */}
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.name}</h1>
                    <p className="text-gray-600 mb-6">{room.description}</p>

                    {/* Price and Capacity */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-semibold text-blue-600">
                            ${room.price_per_hour} /hour
                        </span>
                        <span className="text-lg text-gray-500">
                            {room.capacity} Guests
                        </span>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium">WiFi:</span>
                            <span className="ml-2 text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium">Parking:</span>
                            <span className="ml-2 text-gray-600">Free</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium">Air Conditioning:</span>
                            <span className="ml-2 text-gray-600">Yes</span>
                        </div>
                    </div>

                    {/* Call to Action Button */}
                    <button
                        onClick={() => alert(`Booking room: ${room.name}`)}
                        className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <ImageModal images={images} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default Room;