"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageModal from '@/components/GalleryModel';

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
    const [checkInDate, setCheckInDate] = useState<string>('');
    const [checkOutDate, setCheckOutDate] = useState<string>('');
    const [activePaymentMethod, setActivePaymentMethod] = useState<'momo' | 'stripe'>('momo');

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
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 2x2 Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Left - Image Grid (kept the same) */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 p-2">
                            {room.images.slice(0, 4).map((image, index) => (
                                <div key={index} className="relative aspect-square">
                                    <Image
                                        src={image}
                                        alt={`Room ${room.name} image ${index + 1}`}
                                        fill
                                        quality={100}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>

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
                    </div>

                    {/* Top Right - Room Details */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.name}</h1>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-semibold text-blue-600">
                                ${room.price_per_hour} /hour
                            </span>
                            <span className="text-lg text-gray-500">
                                {room.capacity} Guests
                            </span>
                        </div>

                        <p className="text-gray-600 mb-6">{room.description}</p>

                        <div className="space-y-3 mb-6">
                            <h3 className="text-lg font-semibold">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, index) => (
                                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <h3 className="text-lg font-semibold">Location</h3>
                            <p className="text-gray-600">{room.street}, {room.location}</p>
                            {/* Map Embed */}
                            
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Room area</h3>
                            <p className="text-gray-600">{room.area} sqft</p>
                        </div>
                    </div>


                    {/* Bottom Left - Calendar/Booking Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Select Dates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                <input
                                    type="date"
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>${room.price_per_hour} x hours</span>
                                    <span>${room.price_per_hour * 2}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Total</span>
                                    <span>${room.price_per_hour * 2}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right - Payment Options */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                        <div className="flex border-b mb-4">
                            <button
                                className={`px-4 py-2 font-medium ${activePaymentMethod === 'momo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActivePaymentMethod('momo')}
                            >
                                MTN RW MoMoPay
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activePaymentMethod === 'stripe' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActivePaymentMethod('stripe')}
                            >
                                Credit Card
                            </button>
                        </div>

                        {activePaymentMethod === 'momo' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g., 0244123456"
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                                    <select className="w-full p-2 border rounded-lg">
                                        <option>MTN</option>
                                        <option>Vodafone</option>
                                        <option>AirtelTigo</option>
                                    </select>
                                </div>
                                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                    Pay with Mobile Money
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Pay with Credit Card
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ImageModal images={room.images} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default Room;