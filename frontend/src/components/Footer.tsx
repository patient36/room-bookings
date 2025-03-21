'use client';

import { useEffect, useState } from 'react';

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const interval = setInterval(() => {
            setYear(new Date().getFullYear());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {year} Loyalty Haven. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
