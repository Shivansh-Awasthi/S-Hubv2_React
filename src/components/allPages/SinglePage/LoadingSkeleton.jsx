import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Header section skeleton */}
            <div className="flex flex-wrap flex-col xl:flex-row px-2 justify-center items-center">
                {/* Left Content */}
                <div className="flex-1">
                    {/* App title and icon skeleton */}
                    <div className="flex pb-4 sm:pb-4 flex-grow flex-col rounded-lg shadow-sm">
                        <div className="flex items-center gap-4 text-slate-800 gap-3 sm:gap-5">
                            {/* App icon skeleton */}
                            <div className="relative inline-block h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] rounded-lg bg-gray-700"></div>
                            <div className="flex w-full flex-col">
                                {/* App title skeleton */}
                                <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                                {/* Platform skeleton */}
                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Screenshot skeleton */}
                    <div className="relative bg-gray-700 w-full h-[13rem] sm:h-[19rem] md:h-[20rem] lg:h-[26rem] rounded-lg"></div>
                </div>

                {/* Right Card */}
                <div className="w-full max-w-[22rem] md:ml-4 lg:ml-4 h-full p-8 bg-[#262626] rounded-lg shadow-md mt-6 xl:mt-[5.7rem] ring-1 ring-[#3E3E3E]">
                    {/* Platform skeleton */}
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>

                    {/* Language skeleton */}
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-6"></div>

                    {/* Tested skeleton */}
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>

                    {/* Size skeleton */}
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>

                    {/* Updated at skeleton */}
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>

                    {/* Download button skeleton */}
                    <div className="h-12 bg-green-700 rounded-lg w-full"></div>
                </div>
            </div>

            {/* Description tabs skeleton */}
            <div className="mt-8">
                <div className="flex border-b border-gray-700">
                    <div className="h-10 bg-gray-700 rounded-t w-32 mr-4"></div>
                    <div className="h-10 bg-gray-700 rounded-t w-32 mr-4"></div>
                </div>
                <div className="mt-4 space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
            </div>

            {/* Comments section skeleton */}
            <div className="ring-2 ring-[#2E2E2E] rounded-lg flex flex-col items-center mt-8 p-4">
                <div className="h-8 bg-gray-700 rounded w-48 mb-8"></div>
                <div className="w-full max-w-3xl space-y-4">
                    <div className="h-24 bg-gray-700 rounded w-full"></div>
                    <div className="h-24 bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
