"use client"

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import { FaAngleLeft, FaAngleRight, FaFilter, FaTimes, FaUndo } from 'react-icons/fa';
import Link from 'next/link';
import { formatNumber } from '@/utils/formatNumbers';

interface Room {
    _id: string;
    name: string;
    description: string;
    price_per_hour: string;
    capacity: string;
    images: string[];
}

interface Filters {
    minPrice: number | null;
    maxPrice: number | null;
    capacity: number | null;
}

const DEFAULT_PAGE_SIZE = 18;

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filters, setFilters] = useState<Filters>({
        minPrice: null,
        maxPrice: null,
        capacity: null,
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [visibleRooms, setVisibleRooms] = useState<number>(DEFAULT_PAGE_SIZE);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    // Fetch rooms from the API
    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                sort: 'capacity,price_per_hour',
                minPrice: filters.minPrice?.toString() || '0',
                maxPrice: filters.maxPrice?.toString() || `${10 ** 10}`,
                minCapacity: filters.capacity?.toString() || '1',
                page: page.toString(),
                limit: DEFAULT_PAGE_SIZE.toString(),
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/booker/rooms/?${queryParams}`, {
                cache: 'no-store',
            });
            const data = await response.json();
            setRooms((prevRooms) => (page === 1 ? data.data.rooms : [...prevRooms, ...data.data.rooms]));
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch rooms when the component mounts or filters/page changes
    useEffect(() => {
        fetchRooms();
    }, [filters, page]);

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value === '' ? null : parseFloat(value),
        });
        setPage(1);
        setRooms([]);
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Reset filters to default values
    const resetFilters = () => {
        setFilters({
            minPrice: null,
            maxPrice: null,
            capacity: null,
        });
        setPage(1);
        setRooms([]);
    };

    const loadMoreRooms = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // Filter rooms based on selected filters (client-side filtering if needed)
    const filteredRooms = rooms.filter((room) => {
        const price = parseFloat(room.price_per_hour);
        const meetsMinPrice = filters.minPrice === null || price >= filters.minPrice;
        const meetsMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
        const meetsCapacity = filters.capacity === null || parseInt(room.capacity) >= filters.capacity;
        return meetsMinPrice && meetsMaxPrice && meetsCapacity;
    });

    return (
        <div>
            {/* Header */}
            <div className="p-4 bg-white shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="font-extrabold text-2xl text-blue-900">Our rooms</h1>
                    <button
                        onClick={toggleFilters}
                        className="flex items-center gap-2 p-2 bg-pink-400 cursor-pointer rounded-md hover:bg-pink-600 transition-colors duration-200"
                    >
                        {showFilters ? <FaTimes /> : <FaFilter />}
                        <span>Filters</span>
                    </button>
                </div>

                {/* Filters (Collapsible Navbar Style) */}
                {showFilters && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg">
                        {/* Price Range Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700">Price Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice ?? ''}
                                    onChange={handleFilterChange}
                                    className="w-1/2 p-2 border border-gray-300 text-slate-700 rounded-md"
                                    placeholder="Minimum Price"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice ?? ''}
                                    onChange={handleFilterChange}
                                    className="w-1/2 p-2 border border-gray-300 text-slate-700 rounded-md"
                                    placeholder="Maximum Price"
                                />
                            </div>
                        </div>

                        {/* Capacity Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={filters.capacity ?? ''}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 text-slate-700 rounded-md"
                                placeholder="Minimum Guests"
                            />
                        </div>

                        {/* Reset Filters Button */}
                        <div className="w-full sm:w-auto">
                            <button
                                onClick={resetFilters}
                                className="w-full sm:w-auto flex items-center gap-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                <FaUndo />
                                <span>Reset Filters</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Room List */}
            <div className="p-4 min-h-screen bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRooms.slice(0, visibleRooms).map((room) => (
                    <div
                        key={room._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 h-76 flex flex-col max-w-xs mx-auto">
                        {/* Carousel */}
                        <div className="flex-1 relative">
                            <Carousel
                                showThumbs={false}
                                showStatus={false}
                                infiniteLoop
                                className="h-full"
                                renderArrowPrev={(onClickHandler, hasPrev, label) => (
                                    <button
                                        type="button"
                                        onClick={onClickHandler}
                                        title={label}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/75 text-blue-900 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                                    >
                                        <FaAngleLeft />
                                    </button>
                                )}
                                renderArrowNext={(onClickHandler, hasNext, label) => (
                                    <button
                                        type="button"
                                        onClick={onClickHandler}
                                        title={label}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/75 text-blue-900 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                                    >
                                        <FaAngleRight />
                                    </button>
                                )}
                                renderIndicator={(onClickHandler, isSelected, index, label) => (
                                    <li
                                        key={index}
                                        onClick={onClickHandler}
                                        title={label}
                                        className={`inline-block w-2 h-2 mx-1 rounded-full transition-colors duration-200 cursor-pointer ${isSelected ? 'bg-pink-500' : 'bg-gray-300'
                                            }`}
                                    />
                                )}
                            >
                                {room.images.slice(0, 6).map((image, index) => (
                                    <div key={index} className="h-42">
                                        <Image
                                            height={400}
                                            width={400}
                                            src={`${image}`}
                                            alt={`Room ${room.name} image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>

                        {/* Card Content */}
                        <Link
                            target="_blank" rel="noopener noreferrer"
                            href={`/rooms/${room._id}`}
                            className="p-4 flex flex-col gap-2">
                            <h2 className="text-lg font-bold text-pink-500">{room.name}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-yellow-600">RWF {formatNumber(room.price_per_hour)} /hour</span>
                                <span className="text-sm text-gray-500">{formatNumber(room.capacity)} Guests</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {visibleRooms < filteredRooms.length && (
                <div className="flex justify-center p-4 bg-white shadow-md">
                    <button
                        onClick={loadMoreRooms}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Rooms;