import React from 'react';
import { formatNumber } from '@/utils/formatNumbers';

interface BookingSummaryProps {
  pricePerHour: number;
  totalHours: number;
  totalPrice: number;
  onVerifyBooking: () => void;
  isVerifying: boolean;
  bookingError: string | null;
  hasValidDates: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  pricePerHour,
  totalHours,
  totalPrice,
  onVerifyBooking,
  isVerifying,
  bookingError,
  hasValidDates,
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-pink-600 mb-2">Booking Summary</h3>
      <div className="space-y-2">
        {hasValidDates && (
          <>
            <div className="flex justify-between text-black">
              <span>RWF {formatNumber(pricePerHour)} × {formatNumber(totalHours)} hours</span>
              <span>RWF {formatNumber(totalPrice.toFixed(2))}</span>
            </div>
            <div className="flex justify-between text-black font-semibold border-t pt-2">
              <span>Total</span>
              <span>RWF {formatNumber(totalPrice.toFixed(2))}</span>
            </div>
          </>
        )}
      </div>
      <div className="space-y-2">
        <button
          onClick={onVerifyBooking}
          disabled={!hasValidDates || isVerifying}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${!hasValidDates
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Check Availability'
          )}
        </button>

        {bookingError && (
          <p className="text-red-500 text-sm mt-2">{bookingError}</p>
        )}
      </div>
    </div>
  );
};