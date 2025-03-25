"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
    setIsForgotPassword: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the login function from your AuthContext
            await login(email, password);

            // Redirect to dashboard after successful login
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 text-white">
            <img className="w-12 h-12" src="/logo.webp" alt="Logo" />
            <h2 className="text-xl font-semibold">Login to your Account</h2>

            {error && (
                <div className="w-full p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4 w-full">
                <div className="flex flex-col">
                    <label className="font-semibold text-xs mb-2 text-gray-200">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-none rounded-lg px-3 py-2 text-sm w-full outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white transition-all"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-xs mb-2 text-gray-200">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-none rounded-lg px-3 py-2 text-sm w-full outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white transition-all"
                        required
                    />
                </div>

                <div className="mt-6 w-full">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 bg-white text-blue-500 rounded-lg shadow-lg hover:bg-gray-100 transition font-extrabold cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>

            <div className="mt-4 text-center text-sm text-gray-200">
                <button
                    onClick={() => setIsForgotPassword(true)}
                    className="hover:underline text-pink-500"
                >
                    Forgot Password?
                </button>
            </div>

            <div className="mt-2 text-center text-sm text-gray-200">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-500 font-semibold hover:underline">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;