import React from 'react';


// Platform-specific configuration for download links
const platformConfig = {
    Mac: [
        { label: "Viking File" },
        { label: "OneDrive" },
        { label: "Torrent" },
        { label: "Buzzheavier" },
        { label: "Mediafire" },
        { label: "AkiraBox" }
    ],
    PC: [
        { label: "Viking File ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) },
        { label: "Buzzheavier ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) },
        { label: "FuckingFast ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) },
        { label: "Bzzhr.co ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) },
        { label: "Buzzheavier ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) },
        { label: "AkiraBox ", custom: (<span className='text-[#55ff00]'>(Pre-Installed)</span>) }
    ],
    Android: [
        { label: "APK" },
        { label: "APK Mirror" },
        { label: "OBB" },
        { label: "OBB Mirror" },
        { label: "Other" }
    ],
    Playstation: [
        { label: "Buzzheavier" },
        { label: "FuckingFast" },
        { label: "Bzzhr.co" },
        { label: "Viking File" },
        { label: "AkiraBox" }
    ]
};

const DownloadSection = ({ platform, downloadLinks }) => {
    if (!platform || !downloadLinks || downloadLinks.length === 0) {
        return (
            <div className="mt-6 text-center">
                <p className="text-red-500">No download links available</p>
            </div>
        );
    }

    // Function to determine button color based on mirror number
    const getButtonColor = (index) => {
        const colors = [
            'bg-yellow-600 hover:bg-yellow-800', // Mirror 1
            'bg-green-600 hover:bg-green-700', // Mirror 2
            'bg-purple-600 hover:bg-purple-700', // Mirror 3
            'bg-orange-600 hover:bg-orange-700', // Mirror 4
            'bg-pink-600 hover:bg-pink-700', // Mirror 5
            'bg-blue-600 hover:bg-blue-700',
        ];
        return colors[index % colors.length];
    };

    // Get the appropriate config for the platform
    const config = platformConfig[platform] || [];

    return (
        <div className="mt-3">
            <div className="h-0.5 bg-[#8E8E8E] opacity-10 w-full mb-2"></div>
            <h3 className="text-xl text-gray-200 font-medium mb-4">Download Links</h3>
            {/* Colorful buttons for download options */}
            <div className="flex flex-wrap justify-center gap-4">
                {downloadLinks.map((link, index) => {
                    if (!link || link === "no" || index >= config.length) return null;

                    return (
                        <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-6 py-3 rounded-lg text-white ${getButtonColor(index)} transition-transform transform hover:scale-105`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 text-xl"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                            <span>
                                {config[index].label}
                                {config[index].custom && config[index].custom}
                            </span>
                        </a>
                    );
                })}
            </div>
            <p className="mt-4 text-sm text-gray-400">
                If one download link doesn't work, try another one. All mirrors contain the same files.
            </p>
        </div>
    );
};

export default DownloadSection;
