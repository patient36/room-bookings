import React, { useState } from 'react';

interface BookingFormProps {
    checkInUTC: string;
    checkOutUTC: string;
    roomId: string,
    onCheckInChange: (value: string) => void;
    onCheckOutChange: (value: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    checkInUTC,
    checkOutUTC,
    onCheckInChange,
    onCheckOutChange,
    roomId
}) => {
    const formatForInput = (utcISOString: string): string => {
        if (!utcISOString) return '';
        const date = new Date(utcISOString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input
                    type="datetime-local"
                    value={formatForInput(checkInUTC)}
                    onChange={(e) => onCheckInChange(e.target.value)}
                    min={formatForInput(new Date().toISOString())}
                    className="w-full p-3 border  text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input
                    type="datetime-local"
                    value={formatForInput(checkOutUTC)}
                    onChange={(e) => onCheckOutChange(e.target.value)}
                    min={checkInUTC ? formatForInput(checkInUTC) : formatForInput(new Date().toISOString())}
                    className="w-full p-3 border text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};