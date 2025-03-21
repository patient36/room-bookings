'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import Search from './Search';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

const Nav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const tooggleVisible = () => setIsVisible(!isVisible);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-10 bg-white shadow-lg transition-all  ${isScrolled ? 'py-2' : 'py-4'
                }`}>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center transition-all duration-300">
                    <div className="text-2xl font-bold flex flex-row gap-2 items-center transition-all duration-300 w-1/3 max-sm:w-8">
                        <Logo />
                        <p className='text-blue-900 max-sm:hidden'>Loyalty Haven</p>
                    </div>
                    <Search />
                    <div className="flex justify-end items-center gap-3 space-x-4 w-1/3 max-sm:hidden">
                        <Link href="#" className="text-gray-700 hover:text-blue-600 font-bold">
                            Rooms
                        </Link>
                        <Link href="#" className="rounded-full px-6 bg-slate-700 font-bold text-white p-2 hover:text-pink-600 transition-all">
                            Sign In
                        </Link>
                    </div>
                    <div className='relative hidden max-sm:block'>
                        <button onClick={() => tooggleVisible()} className="text-gray-700 hover:text-blue-600">
                            <FaBars />
                        </button>
                        {isVisible && (
                            <div className="absolute right-0 mt-2 w-48 bg-sky-50 rounded-lg shadow-lg font-bold">
                                <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                    Rooms
                                </Link>
                                <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
