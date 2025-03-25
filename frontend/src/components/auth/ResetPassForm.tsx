import React, { useState } from 'react';

const ResetPassword: React.FC<{ setIsForgotPassword: (value: boolean) => void }> = ({ setIsForgotPassword }) => {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
            const otpDigits = pasteData.split('');
            const inputs = e.currentTarget.parentElement?.querySelectorAll('input');
            if (inputs) {
                otpDigits.forEach((digit, i) => {
                    if (inputs[i]) {
                        (inputs[i] as HTMLInputElement).value = digit;
                    }
                });
                setOtp(otpDigits);
                (inputs[5] as HTMLInputElement).focus();
            }
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const sendOtp = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            setStep('otp');
            setMessage(`OTP sent to ${email}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        if (otp.some(digit => !digit)) {
            setError('Please enter the complete OTP');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                body: JSON.stringify({
                    email,
                    OTP: otp.join('')
                }),
            });

            if (!response.ok) {
                throw new Error('Password reset failed');
            }

            const data = await response.json();
            setMessage(data.message || "Your OTP is now your temporary password. Use it to log in and change it immediately for your account's security.");
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 text-white">
            <img className="w-12 h-12" src="/logo.webp" alt="Logo" />
            <h2 className="text-xl font-semibold">
                {step === 'email' ? 'Reset Password' : 'Enter OTP'}
            </h2>

            {error && (
                <div className="w-full p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {message && (
                <div className={`w-full p-3 rounded-lg text-sm ${success ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                    {message}
                </div>
            )}

            {step === 'email' ? (
                <>
                    <div className="mt-4 w-full">
                        <label className="block font-semibold text-xs mb-2 text-gray-200">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border-none rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mt-6 w-full">
                        <button
                            onClick={sendOtp}
                            disabled={isLoading || !email}
                            className={`w-full py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition ${isLoading || !email ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm text-gray-200 text-center">
                        Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
                    </p>

                    <div className="mt-6 w-full flex justify-center gap-2">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-white focus:border-white outline-none"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.value.length === 1 && index < 5) {
                                        const nextInput = target.nextElementSibling as HTMLInputElement;
                                        if (nextInput) nextInput.focus();
                                    }
                                }}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    const target = e.target as HTMLInputElement;
                                    if (e.key === "Backspace" && index > 0 && target.value === "") {
                                        const prevInput = target.previousElementSibling as HTMLInputElement;
                                        if (prevInput) prevInput.focus();
                                    }
                                }}
                                onPaste={(e) => handlePaste(e, index)}
                            />
                        ))}
                    </div>

                    <div className="mt-6 w-full">
                        <button
                            onClick={resetPassword}
                            disabled={isLoading || otp.some(digit => !digit)}
                            className={`w-full py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition ${isLoading || otp.some(digit => !digit) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </>
            )}

            <div className="mt-4 text-center text-sm text-gray-200">
                <button
                    onClick={() => {
                        setIsForgotPassword(false);
                        setStep('email');
                        setError('');
                        setMessage('');
                    }}
                    className="hover:underline"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;