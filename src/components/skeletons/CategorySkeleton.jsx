import React from 'react';

const CategorySkeleton = ({ itemCount = 12, platform = 'Generic' }) => {
    // Create an array of the specified length to map over
    const items = Array.from({ length: itemCount }, (_, i) => i);

    return (
        <div className="container mx-auto p-2 animate-pulse">
            {/* Header section */}
            <div className="cover mb-6">
                <div className="flex items-center">
                    <div className="h-8 bg-gray-700 rounded w-40"></div>
                    <div className="h-8 bg-gray-700 rounded w-12 ml-2"></div>
                </div>
            </div>

            {/* Grid of skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                {items.map((index) => (
                    <SkeletonCard key={index} platform={platform} />
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center mt-10">
                <div className="flex space-x-2">
                    <div className="h-10 w-24 bg-gray-700 rounded"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded"></div>
                    <div className="h-10 w-24 bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    );
};

// Different card layouts based on platform
const SkeletonCard = ({ platform }) => {
    // Different skeleton styles based on platform
    switch (platform) {
        case 'Android':
            // Android apps have a distinctive rounded icon centered at the top
            return (
                <div className="flex flex-col rounded-2xl h-36 overflow-hidden ring-1 ring-white/10">
                    <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
                        <div className="rounded-full w-14 h-14 bg-gray-700"></div>
                    </div>
                    <div className="flex flex-col p-4 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            );

        case 'PS2':
            // PS2 games have a distinctive blue border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-blue-500">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'PS3':
            // PS3 games have a distinctive red border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-red-500">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'PS4':
            // PS4 games have a distinctive green border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-green-500">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'PPSSPP':
            // PPSSPP games have a distinctive yellow border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-yellow-500">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'PlayStation':
            // Generic PlayStation style with purple border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-purple-500">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'Mac':
            // Mac apps have a slightly different height and a subtle border
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-white/10">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );

        case 'PC':
        default:
            // PC games have the standard card layout
            return (
                <div className="flex flex-col rounded-2xl h-52 overflow-hidden">
                    <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
                    <div className="flex flex-col p-3 bg-[#262626]">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            );
    }
};

export default CategorySkeleton;
