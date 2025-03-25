"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
    const { setUser } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        emailOTP: "",
        phoneOTP: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateCredentials = async () => {
        if (!formData.email || !formData.phone) {
            setError("Please provide both email and phone number");
            return false;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/validate-credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone
                })
            });

            if (!response.ok) {
                throw new Error(await response.text() || "Validation failed");
            }

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Validation failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            const isValid = await validateCredentials();
            if (isValid) {
                setStep(2);
            }
        }
        else if (step === 2) {
            if (!formData.emailOTP || !formData.phoneOTP) {
                setError("Please enter both OTPs");
                return;
            }
            setStep(3);
        }
        else if (step === 3) {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            setIsLoading(true);
            setError("");
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify({
                        name: formData.username,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                        EmailOTP: formData.emailOTP,
                        PhoneOTP: formData.phoneOTP
                    })
                });

                if (!response.ok) {
                    throw new Error(await response.text() || "Registration failed");
                }

                // Auto login
                const data = await response.json();
                
                // Update auth context with user data
                setUser(data);

                // Redirect to dashboard
                router.push("/dashboard");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Registration failed");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const progress = (step / 3) * 100;

    return (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/dest3.jpg')" }}>
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

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

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
                                minLength={6}
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
                            disabled={isLoading}
                        >
                            Previous
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {step === 3 ? "Registering..." : "Processing..."}
                            </span>
                        ) : (
                            step === 3 ? "Register" : "Next"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Register;