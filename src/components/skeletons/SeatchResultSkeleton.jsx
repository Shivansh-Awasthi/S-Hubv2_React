import React from 'react';

const SearchSkeleton = ({ itemCount = 10 }) => {
    // Create an array of the specified length to map over
    const items = Array.from({ length: itemCount }, (_, i) => i);

    // Generate random widths for more natural-looking skeletons
    const getRandomWidth = (min, max) => {
        return `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
    };

    return (
        <div className="animate-pulse relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>

            {/* Header section */}
            <div className="cover mb-8 relative">
                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10"></div>
                <div className="flex items-center justify-center">
                    <div className="h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg"></div>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30"></div>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-16 ml-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"></div>
                    </div>
                </div>
            </div>

            {/* Search results list */}
            <div className="w-full md:w-full pt-3 pb-3 ring-1 ring-purple-500/20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl relative">
                {/* Grid accent elements */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg"></div>

                <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-700/50">
                        {items.map((index) => (
                            <li key={index} className="py-3 sm:py-3 px-6 relative hover:bg-gray-800/50 transition-all duration-200">
                                <div className="flex items-center justify-between w-full">
                                    {/* Thumbnail with shimmer effect */}
                                    <div className="flex-shrink-0 relative overflow-hidden">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 w-full h-full">
                                                <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-gray-600/10 to-transparent animate-shimmer"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title and platform */}
                                    <div className="flex-1 min-w-0 ms-4">
                                        <div className="h-5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md" style={{ width: getRandomWidth(60, 90) }}></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md mt-2" style={{ width: getRandomWidth(30, 50) }}></div>
                                    </div>

                                    {/* Size */}
                                    <div className="flex-1 flex justify-center hidden sm:block">
                                        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md w-16"></div>
                                    </div>

                                    {/* Date */}
                                    <div className="text-right hidden md:block">
                                        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md w-24"></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Pagination skeleton - Enhanced Design */}
            <div className="flex justify-center mt-10 relative">
                {/* Pagination decorative elements */}
                <div className="absolute left-1/4 -top-8 w-24 h-24 bg-purple-600 opacity-5 rounded-full blur-2xl -z-10"></div>
                <div className="absolute right-1/4 -top-8 w-24 h-24 bg-blue-600 opacity-5 rounded-full blur-2xl -z-10"></div>

                <div className="inline-flex items-center relative z-10">
                    {/* Previous Button Skeleton */}
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-l-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
                    </div>

                    {/* Page Numbers Skeleton - Desktop */}
                    <div className="hidden sm:flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`h-10 w-10 ${i === 3 ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-gray-700 to-gray-800'} relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Pagination Skeleton */}
                    <div className="flex sm:hidden">
                        <div className="h-10 w-20 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
                        </div>
                    </div>

                    {/* Next Button Skeleton */}
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-r-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
                    </div>
                </div>

                {/* Decorative line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10"></div>
            </div>
        </div>
    );
};

export default SearchSkeleton;
