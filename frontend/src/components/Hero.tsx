"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "/hero-bg.jpg",
    "/dest1.jpg",
    "/dest2.jpg",
    "/dest3.jpg",
    "/dest4.jpg",
    "/dest5.jpg",
    "/dest6.jpg",
];


export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState({ x: "", y: "" });

    useEffect(() => {
        const interval = setInterval(() => {
            setDirection({ x: "0%", y: "100%" });
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: direction.x, y: direction.y }}
                    animate={{ opacity: 1, x: "0%", y: "0%" }}
                    exit={{ opacity: 0, x: `-${direction.x}`, y: `-${direction.y}` }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[index]})` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Book rooms readily available for you at the best prices.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                type="date"
                                className="p-3 border border-gray-300 rounded-lg text-black w-full sm:w-2/5"
                            />
                            <input
                                type="date"
                                className="p-3 border border-gray-300 rounded-lg text-black w-full sm:w-2/5"
                            />
                            <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 w-full sm:w-1/5">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
