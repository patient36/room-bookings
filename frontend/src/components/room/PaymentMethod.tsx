import React, { useState } from 'react';
import { formatNumber } from '@/utils/formatNumbers';

interface PaymentMethodProps {
    activeMethod: 'momo' | 'stripe';
    onMethodChange: (method: 'momo' | 'stripe') => void;
    amount: number;
    roomId: string,
    onPaymentInitiated: (method: 'momo' | 'stripe') => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
    activeMethod,
    onMethodChange,
    amount,
    roomId,
    onPaymentInitiated,
}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    const handleMomoPayment = () => {
        if (!phoneNumber) {
            alert('Please enter your phone number');
            return;
        }
        if (amount <= 0) {
            alert('Invalid payment amount');
            return;
        }
        onPaymentInitiated('momo');
        // Here you would typically call your payment API
        console.log(`Initiating Mobile Money payment of $${amount} to ${phoneNumber}`);
    };

    const handleCardPayment = () => {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
            alert('Please fill all card details');
            return;
        }
        if (amount <= 0) {
            alert('Invalid payment amount');
            return;
        }
        onPaymentInitiated('stripe');
        // Here you would typically call your payment API
        console.log(`Initiating Credit Card payment of $${amount}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xs bg-black/10 rounded-md px-2 py-1 text-gray-800 mb-4">
                <strong className='text-pink-700'>Note:</strong> To secure your booking we ask you to pay for the room you have reserved. Refunds are made according to our terms and conditions.</h3>
            <div className="mb-4">
                <p className="text-md text-black font-medium">Total Amount: <span className="text-green-600">RWF {formatNumber(amount.toFixed(2))}</span></p>
            </div>
            <div className="flex border-b mb-6">
                <button
                    className={`flex-1 py-2 font-medium ${activeMethod === 'momo'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500'
                        }`}
                    onClick={() => onMethodChange('momo')}
                >
                    Mobile Money
                </button>
                <button
                    className={`flex-1 py-2 font-medium ${activeMethod === 'stripe'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500'
                        }`}
                    onClick={() => onMethodChange('stripe')}
                >
                    Credit Card
                </button>
            </div>

            {activeMethod === 'momo' ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                        <input
                            type="tel"
                            placeholder="e.g. 250781234567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleMomoPayment}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Pay RWF {formatNumber(amount.toFixed(2))} with Mobile Money
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card details</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full p-3 border  text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                className="w-full p-3 border  text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cardDetails.cvc}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                className="w-full p-3 border  text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCardPayment}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Pay RWF {formatNumber(amount.toFixed(2))} with Credit Card
                    </button>
                </div>
            )}
        </div>
    );
};