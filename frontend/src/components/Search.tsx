import { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);

    const handleSearch = (searchQuery: string) => {
        const mockResults = [
            'Deluxe Room',
            'Executive Suite',
            'Family Room',
            'Ocean View Room',
            'Standard Room',
        ].filter((room) =>
            room.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setResults(mockResults);
    };

    return (
        <div className="flex items-center justify-center w-1/3 max-sm:w-2/3 relative">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search for rooms"
                    value={query}
                    onBlur={() => setQuery("")}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="text-blue-800 placeholder:text-gray-500 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {query && results.length > 0 && (
                <div className="absolute top-full mt-6 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                className="text-pink-400 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                            >
                                {result}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Search;