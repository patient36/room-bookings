import React from 'react';

const ResetPassword: React.FC<{ setIsForgotPassword: (value: boolean) => void }> = ({ setIsForgotPassword }) => {
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
                (inputs[5] as HTMLInputElement).focus();
            }
        }
    };

    const maskEmail = (email: string): string => {
        const [user, domain] = email.split("@");
        const maskedUser = user.length > 2 ? `${user.slice(0, 2)}**` : `${user}*`;
        const [domainName, domainExt] = domain.split(".");
        const maskedDomain = `${domainName[0]}***.${domainExt}`;
        return `${maskedUser}@${maskedDomain}`;
    };

    const email = maskEmail('fake@mail.co')

    return (
        <div className="flex flex-col items-center gap-4 text-white">
            <img className="w-12 h-12" src="/logo.webp" alt="Logo" />
            <h2 className="text-xl font-semibold">Reset Password</h2>
            <p className="text-sm text-gray-200 text-center">
                An OTP has been sent to <span className="font-semibold">{email}</span>. Please check your email.
            </p>

            {/* OTP Input Field */}
            <div className="mt-6 w-full flex justify-center gap-2">
                {[...Array(6)].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-white focus:border-white outline-none"
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const target = e.target as HTMLInputElement;
                            // Automatically focus the next input
                            if (target.value.length === 1 && index < 5) {
                                const nextInput = target.nextElementSibling as HTMLInputElement;
                                if (nextInput) {
                                    nextInput.focus();
                                }
                            }
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const target = e.target as HTMLInputElement;
                            // Handle backspace to move to the previous input
                            if (e.key === "Backspace" && index > 0 && target.value === "") {
                                const prevInput = target.previousElementSibling as HTMLInputElement;
                                if (prevInput) {
                                    prevInput.focus();
                                }
                            }
                        }}
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e, index)}
                    />
                ))}
            </div>

            <div className="mt-6 w-full">
                <button className="w-full py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition">
                    Verify OTP
                </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-200">
                <button onClick={() => setIsForgotPassword(false)} className="hover:underline">
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;