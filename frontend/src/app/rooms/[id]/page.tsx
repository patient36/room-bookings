"use client";

import React, { useEffect, useState } from 'react';
import { RoomHeader } from '@/components/room/RoomHeader';
import { RoomDescription } from '@/components/room/RoomDescription';
import { RoomGallery } from '@/components/room/RoomGallery';
import { AmenitiesList } from '@/components/room/AmenitiesList';
import { LocationMap } from '@/components/room/LocationMap';
import { BookingForm } from '@/components/room/BookingForm';
import { BookingSummary } from '@/components/room/BookingSummary';
import { PaymentMethod } from '@/components/room/PaymentMethod';

interface Room {
    _id: string;
    name: string;
    description: string;
    area: string;
    street: string;
    location: string;
    amenities: string[];
    price_per_hour: number;
    capacity: number;
    images: string[];
    availability: string;
}

const Room = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [room, setRoom] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkInUTC, setCheckInUTC] = useState<string>('');
    const [checkOutUTC, setCheckOutUTC] = useState<string>('');
    const [activePaymentMethod, setActivePaymentMethod] = useState<'momo' | 'stripe'>('momo');
    const [isVerifyingBooking, setIsVerifyingBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    // Fetch room data
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/booker/rooms/${id}`);
                if (!response.ok) throw new Error('Failed to fetch room data');
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

    // Payment
    const handlePaymentInitiated = (method: 'momo' | 'stripe') => {
        console.log(`Payment initiated with ${method} for amount: $${totalPrice.toFixed(2)}`);
        // Here you would typically:
        // 1. Show a loading state
        // 2. Call your payment API
        // 3. Handle the response
    };

    // Convert local datetime to UTC ISO string
    const handleDateTimeChange = (type: 'checkIn' | 'checkOut', localDateTime: string) => {
        if (!localDateTime) {
            type === 'checkIn' ? setCheckInUTC('') : setCheckOutUTC('');
            return;
        }

        const utcISOString = new Date(localDateTime).toISOString();

        if (type === 'checkIn') {
            setCheckInUTC(utcISOString);
            if (checkOutUTC && utcISOString >= checkOutUTC) {
                setCheckOutUTC('');
            }
        } else {
            if (checkInUTC && utcISOString <= checkInUTC) {
                alert("Check-out must be after check-in");
                return;
            }
            setCheckOutUTC(utcISOString);
        }
    };

    // Calculate hours between UTC dates
    const calculateUTCHours = (): number => {
        if (!checkInUTC || !checkOutUTC) return 0;

        const start = new Date(checkInUTC).getTime();
        const end = new Date(checkOutUTC).getTime();
        return Math.ceil((end - start) / (1000 * 60 * 60));
    };

    const handleVerifyBooking = async () => {
        if (!checkInUTC || !checkOutUTC) {
            setBookingError("Please select both check-in and check-out dates");
            return;
        }

        setIsVerifyingBooking(true);
        setBookingError(null);

        try {
            console.log("Verifying booking for:", {
                roomId: id,
                checkInUTC,
                checkOutUTC
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Booking verification will be implemented here");
        } catch (error) {
            setBookingError(error instanceof Error ? error.message : "Failed to verify booking");
        } finally {
            setIsVerifyingBooking(false);
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    if (!room) return <div className="flex items-center justify-center h-screen">Room not found</div>;

    const totalHours = calculateUTCHours();
    const totalPrice = room.price_per_hour * totalHours;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header and Images */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <RoomHeader name={room.name} />

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-700 mb-2">About this space</h2>
                            <RoomDescription description={room.description} />
                        </div>

                        <RoomGallery images={room.images} name={room.name} />
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Amenities */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
                            <AmenitiesList amenities={room.amenities} availability={room.availability} price={room.price_per_hour} />
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Location</h3>
                                <p className="text-gray-600 mb-4">{room.street}, {room.location}</p>
                                <LocationMap street={room.street} location={room.location} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Booking */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Book this space</h3>

                            <BookingForm
                                checkInUTC={checkInUTC}
                                checkOutUTC={checkOutUTC}
                                onCheckInChange={(value) => handleDateTimeChange('checkIn', value)}
                                onCheckOutChange={(value) => handleDateTimeChange('checkOut', value)}
                                roomId={id}
                            />

                            <BookingSummary
                                pricePerHour={room.price_per_hour}
                                totalHours={totalHours}
                                totalPrice={totalPrice}
                                onVerifyBooking={handleVerifyBooking}
                                isVerifying={isVerifyingBooking}
                                bookingError={bookingError}
                                hasValidDates={!!checkInUTC && !!checkOutUTC}
                            />
                        </div>

                        {/* Payment */}
                        <PaymentMethod
                            activeMethod={activePaymentMethod}
                            onMethodChange={setActivePaymentMethod}
                            amount={totalPrice}
                            onPaymentInitiated={handlePaymentInitiated}
                            roomId={id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;