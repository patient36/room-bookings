"use client";
import { useState } from "react";

const Register = () => {
    const [step, setStep] = useState(1); // Current step
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        emailOTP: "",
        phoneOTP: "",
        password: "",
        confirmPassword: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 3) {
            // Final submission logic
            console.log("Form Data:", formData);
            alert("Registration successful!");
        } else {
            setStep((prev) => prev + 1); // Move to the next step
        }
    };

    // Progress bar
    const progress = (step / 3) * 100;

    return (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/dest3.jpg')" }}>
            {/* Overlay for better readability */}
            <div className="absolute top-0 z-0 inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-lg shadow p-6 max-sm:m-2">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Step {step} of 3
                    </p>
                </div>

                {/* Step 1: Collect username, email, and phone */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Step 1: Basic Information</h2>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="JohnDoe"
                                value={formData.username}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="johndoe@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="123-456-7890"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Collect OTPs */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Step 2: Verify Credentials</h2>
                        <p className="text-sm text-gray-600">
                            OTPs have been sent to your email and phone for verification purposes.
                        </p>
                        <div>
                            <label htmlFor="emailOTP" className="block mb-2 text-sm font-medium text-gray-900">
                                Email OTP
                            </label>
                            <input
                                id="emailOTP"
                                type="text"
                                placeholder="Enter OTP"
                                value={formData.emailOTP}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneOTP" className="block mb-2 text-sm font-medium text-gray-900">
                                Phone OTP
                            </label>
                            <input
                                id="phoneOTP"
                                type="text"
                                placeholder="Enter OTP"
                                value={formData.phoneOTP}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Collect password */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Step 3: Set Password</h2>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep((prev) => prev - 1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Previous
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {step === 3 ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Register;