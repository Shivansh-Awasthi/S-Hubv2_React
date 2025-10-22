import React from 'react';
const HomeSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Slider Skeleton */}
            <div className="relative w-full mb-10">
                <div className="relative h-56 sm:h-72 md:h-88 lg:h-[25rem] overflow-hidden rounded-lg bg-gray-700 ring-1 ring-purple-500">
                    {/* Overlay text and button skeleton */}
                    <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-0">
                        <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
                        <div className="h-4 bg-gray-600 rounded w-64 mb-6"></div>
                        <div className="h-10 bg-gray-600 rounded w-36"></div>
                    </div>
                </div>

                {/* Pagination Dots Skeleton */}
                <div className="absolute flex space-x-2 bottom-7 left-1/2 transform -translate-x-1/2">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div
                            key={index}
                            className={`w-8 h-1 rounded-full bg-gray-600 ${index === 0 ? 'ring-1 ring-white-500' : ''
                                }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Ad Skeleton */}
            <div className="w-full h-20 bg-gray-700 rounded-lg mb-8"></div>

            {/* Mac Games Category Skeleton */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-5 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-40"></div>
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {Array.from({ length: 8 }, (_, i) => (
                        <MacGameSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* Mac Softwares Skeleton */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-5 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }, (_, i) => (
                        <MacSoftwareSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* PC Games Skeleton */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-5 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-36"></div>
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {Array.from({ length: 8 }, (_, i) => (
                        <PcGameSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* Android Games Skeleton */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-5 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }, (_, i) => (
                        <AndroidGameSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* PS2 Roms Skeleton */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-5 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-36"></div>
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }, (_, i) => (
                        <PS2GameSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mac Game Card Skeleton
const MacGameSkeleton = () => (
    <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-blue-500">
        <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
        <div className="flex flex-col p-3 bg-[#262626]">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
    </div>
);

// Mac Software Card Skeleton
const MacSoftwareSkeleton = () => (
    <div className="flex flex-col rounded-2xl h-36 overflow-hidden ring-1 ring-cyan-500">
        <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
            <div className="rounded-full w-14 h-14 bg-gray-700"></div>
        </div>
        <div className="flex flex-col p-4 bg-[#262626]">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
    </div>
);

// PC Game Card Skeleton
const PcGameSkeleton = () => (
    <div className="flex flex-col rounded-2xl h-52 overflow-hidden ring-1 ring-purple-500">
        <div className="h-36 bg-gray-700 rounded-t-2xl"></div>
        <div className="flex flex-col p-3 bg-[#262626]">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
    </div>
);

// Android Game Card Skeleton
const AndroidGameSkeleton = () => (
    <div className="flex flex-col rounded-2xl h-36 overflow-hidden ring-1 ring-green-500">
        <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
            <div className="rounded-full w-14 h-14 bg-gray-700"></div>
        </div>
        <div className="flex flex-col p-4 bg-[#262626]">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
    </div>
);

// PS2 Game Card Skeleton
const PS2GameSkeleton = () => (
    <div className="flex flex-col rounded-2xl h-36 overflow-hidden ring-1 ring-yellow-500">
        <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
            <div className="rounded-full w-14 h-14 bg-gray-700"></div>
        </div>
        <div className="flex flex-col p-4 bg-[#262626]">
            <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
    </div>
);

export default HomeSkeleton;
