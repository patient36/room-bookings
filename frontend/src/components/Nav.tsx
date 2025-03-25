'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import Search from './Search';
import Link from 'next/link';
import { FaBars, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Nav = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-20 bg-white shadow-lg transition-all ${isScrolled ? 'py-2' : 'py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 w-1/3 max-sm:w-8">
                        <Logo />
                        <Link href='/' className="bg-gradient-to-r from-pink-400 to-blue-700 text-transparent bg-clip-text font-extrabold text-3xl tracking-wide drop-shadow-md max-sm:hidden">
                            Loyalty Haven
                        </Link>
                    </div>

                    {/* Search */}
                    <Search />

                    {/* Desktop Navigation */}
                    <div className="flex items-center justify-end gap-4 w-1/3 max-sm:hidden">
                        <Link href="/rooms" className="text-gray-700 hover:text-blue-600 font-bold">
                            Rooms
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="rounded-full flex items-center justify-center bg-slate-700 text-white p-2 hover:bg-slate-600 transition-all"
                                    style={{ height: "40px", width: "40px" }}
                                    aria-label="User menu"
                                >
                                    {user.name[0].toUpperCase()}
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-30">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaUser className="mr-2" /> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaSignOutAlt className="mr-2" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-full px-6 bg-slate-700 font-bold text-white py-2 hover:bg-slate-600 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className='relative hidden max-sm:block'>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 hover:text-blue-600"
                            aria-label="Menu"
                        >
                            <FaBars />
                        </button>

                        {isMobileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-30">
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    href="/rooms"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Rooms
                                </Link>
                                {user ? (
                                    <>
                                        <Link
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            href="/dashboard"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        href="/login"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close menus when clicking outside */}
            {(isUserMenuOpen || isMobileMenuOpen) && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                />
            )}
        </nav>
    );
};

export default Nav;