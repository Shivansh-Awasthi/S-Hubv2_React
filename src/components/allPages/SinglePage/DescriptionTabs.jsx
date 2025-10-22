import React, { useState, useRef, useEffect } from 'react';

const DescriptionTabs = ({ data }) => {
    const [activeTab, setActiveTab] = useState('description');
    const [showMore, setShowMore] = useState(false);
    const [linePosition, setLinePosition] = useState('0px');
    const [lineWidth, setLineWidth] = useState('0px');
    const descriptionRef = useRef(null);
    const installationRef = useRef(null);
    const isMac = data?.platform === "Mac";
    const isPC = data?.platform === "PC";

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const element = tab === 'description' ? descriptionRef.current : installationRef.current;
        if (element) {
            const { offsetLeft, offsetWidth } = element;
            setLinePosition(`${offsetLeft - 48}px`);
            setLineWidth(`${offsetWidth + 10}px`);
        }
    };

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    useEffect(() => {
        if (isMac && descriptionRef.current) {
            const { offsetLeft, offsetWidth } = descriptionRef.current;
            setLinePosition(`${offsetLeft - 48}px`);
            setLineWidth(`${offsetWidth + 10}px`);
        }
    }, [isMac]);


    if (!data) {
        return <div>Loading description...</div>;
    }

    // Default system requirements for Mac and PC
    const defaultMacRequirements = {
        os: 'Apple silicon Chipset',
        processor: 'Mac Air M1 or later',
        memory: '8 GB RAM',
        graphics: 'Apple GPU (integrated)',
        storage: 'N/A',
        additionalNotes: '/System/Applications/Application-Name.app',
    };
    const defaultPCRequirements = {
        os: 'Windows 10',
        processor: 'i5 10700F or later',
        memory: '8 GB RAM',
        graphics: 'NVidia GeForce RTX 3050',
        storage: 'N/A',
        additionalNotes: 'GameName.exe',
    };
    // Use defaults if data.systemRequirements is missing or incomplete
    function fillDefaults(defaults, provided) {
        if (!provided) return defaults;
        const result = { ...defaults };
        for (const key in defaults) {
            if (provided[key] && String(provided[key]).trim() !== '') {
                result[key] = provided[key];
            }
        }
        return result;
    }
    const macReq = isMac ? fillDefaults(defaultMacRequirements, data.systemRequirements) : null;
    const pcReq = isPC ? fillDefaults(defaultPCRequirements, data.systemRequirements) : null;

    return (
        <div className="mt-8 mb-8 bg-[#030712] z-20 rounded-2xl overflow-hidden shadow-2xl border-b-4 border-purple-600">
            {/* Tabs Section - Show for Mac or PC */}
            {(isMac || isPC) && (
                <div className="relative">
                    <div className="flex bg-[#0F0F0F] p-1 rounded-t-2xl gap-2">
                        <button
                            ref={descriptionRef}
                            onClick={() => handleTabClick('description')}
                            className={`flex-1 text-sm sm:text-sm lg:text-2xl md:text-lg font-bold py-4 transition-all duration-300 ${activeTab === 'description'
                                ? 'text-white bg-gradient-to-r from-pink-800 to-orange-500 rounded-xl shadow-lg'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            DESCRIPTION
                        </button>
                        {isMac && (
                            <>
                                <button
                                    ref={installationRef}
                                    onClick={() => handleTabClick('installation')}
                                    className={`flex-1 text-sm sm:text-sm lg:text-2xl md:text-lg font-bold py-4 transition-all duration-300 ${activeTab === 'installation'
                                        ? 'text-white bg-gradient-to-r from-pink-800 to-orange-500 rounded-xl shadow-lg'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    FIX: INSTALLATION ERROR
                                </button>
                                <button
                                    onClick={() => handleTabClick('macrequirements')}
                                    className={`flex-1 text-sm sm:text-sm lg:text-2xl md:text-lg font-bold py-4 transition-all duration-300 ${activeTab === 'macrequirements'
                                        ? 'text-white bg-gradient-to-r from-pink-800 to-orange-500 rounded-xl shadow-lg'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    SYSTEM REQUIREMENTS
                                </button>
                            </>
                        )}
                        {isPC && (
                            <button
                                onClick={() => handleTabClick('requirements')}
                                className={`flex-1 text-sm sm:text-sm lg:text-2xl md:text-lg font-bold py-4 transition-all duration-300 ${activeTab === 'requirements'
                                    ? 'text-white bg-gradient-to-r from-pink-800 to-orange-500 rounded-xl shadow-lg'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                SYSTEM REQUIREMENTS
                            </button>
                        )}
                        {/* Animated underline - hidden but kept for functionality */}
                        <div
                            className="absolute -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 opacity-0"
                            style={{
                                left: linePosition,
                                width: lineWidth
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-6 sm:p-5">
                {isMac ? (
                    activeTab === 'description' ? (
                        <>
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <p
                                    className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed relative z-10"
                                    dangerouslySetInnerHTML={{
                                        __html: showMore
                                            ? (data.description ? data.description.replace(/\\n/g, '<br />') : "No description available.")
                                            : (data.description ? data.description.replace(/\\n/g, '<br />').substring(0, 800) + '...' : "No description available.")
                                    }}
                                />
                            </div>
                            <button
                                className="mt-6 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                onClick={toggleShowMore}
                            >
                                {showMore ? "Show Less" : "Show More"}
                            </button>
                        </>
                    ) : activeTab === 'installation' ? (
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                            <div className="bg-[#0F0F0F] p-6 rounded-xl border border-purple-500/20 shadow-lg relative z-10">
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">Installation Fix Instructions</h3>

                                <div
                                    className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6"
                                    dangerouslySetInnerHTML={{
                                        __html: `
                                        <p class="mb-4">Enter the command in terminal: <code class="px-2 py-1 bg-black/50 rounded text-yellow-400 font-mono">xattr -cr</code>
                                        then after it space and then drop the application to the terminal and press Enter.</p>

                                        <p class="mb-4">Or you can disable gatekeeper globally by entering
                                        <code class="px-2 py-1 bg-black/50 rounded text-yellow-400 font-mono">sudo spctl --master-disable</code> in terminal.</p>

                                        <p class="mb-4">Below I have analyzed the most common <span class="text-red-400 font-bold">FIX</span> in this video.</p>
                                    `
                                    }}
                                />

                                <div className="rounded-xl overflow-hidden shadow-xl" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                                    <iframe
                                        src="https://player.vimeo.com/video/1046166571?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                        className="border-0"
                                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        title="Fix. The application is damaged and cannot be opened, you should move it to the bin."
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'macrequirements' ? (
                        // MAC SYSTEM REQUIREMENTS TAB
                        <div className="py-5">
                            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                                {/* Installation Guide Box */}
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                                    <div className="p-4 sm:p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.3 7l8.7 5 8.7-5M12 22V12"></path></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Installation Guide</h2>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Step-by-step setup process</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                                        <div className="space-y-6">
                                            {/* Placeholder steps for you to edit later */}
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">1</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">Run the downloaded image and drag the application to the Applications folder shortcut</div>
                                                </div>
                                                <div className="absolute left-3 top-6 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                                            </div>
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">2</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-600">If the game shows erroe while launching.</div>
                                                </div>
                                                <div className="absolute left-3 top-6 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                                            </div>
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">3</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        Enter the folllowing command: <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-500/20"><svg className="w-4 h-4 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span className="font-mono text-sm text-blue-700 dark:text-blue-300 font-medium">{macReq && macReq.additionalNotes && String(macReq.additionalNotes).trim() !== '' ? macReq.additionalNotes : 'xattr -cr /Applications/Application_Name.app'}</span></span> to the Terminal then press enter.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Important Notes Placeholder */}
                                        <div className="relative mt-8">
                                            <div className="absolute -inset-x-4 sm:-inset-x-8 inset-y-0 bg-gray-50 dark:bg-gray-800/50"></div>
                                            <div className="relative px-4 sm:px-6 py-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-amber-500" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Important Notes</h3>
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">To Enable/Disable Metal Performance HUD follow below guide.</p>
                                                    </div>
                                                </div>
                                                <div className="ml-11 space-y-3">
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Open the Finder, go to the applications and Right click on the game.</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Then select "show package contents".</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Then navigate to <span className='text-cyan-500'> contents</span> → <span className='text-cyan-500'>wineskin</span> → <span className='text-cyan-500'>advanced</span> → <span className='text-cyan-500'>advanced</span>.</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Then check/uncheck Metal Performance HUD.</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* System Requirements Box */}
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
                                    <div className="p-4 sm:p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 17v-6M8 11v6M16 11v6"></path></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Requirements</h2>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Minimum specifications needed</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                                        <div className="mt-8 first:mt-0 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">Apple Silicon chip is mandatory to play. Intel Macs are not supported for most games.</h3>
                                                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
                                            </div>
                                        </div>
                                        {/* Example requirements, replace with real data if available */}
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">macOS</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">Apple silicon Chipset</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Processor</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{macReq.processor}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{macReq.memory}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Graphics</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">Apple GPU (integrated)</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{macReq.storage}</dd></div></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Mac default: show description
                        <>
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        Description
                                    </h2>
                                    <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mt-2"></div>
                                </div>

                                <p
                                    className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed relative z-10"
                                    dangerouslySetInnerHTML={{
                                        __html: showMore
                                            ? (data.description ? data.description.replace(/\\n/g, '<br />') : "No description available.")
                                            : (data.description ? data.description.replace(/\\n/g, '<br />').substring(0, 800) + '...' : "No description available.")
                                    }}
                                />

                                <button
                                    className="mt-6 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                    onClick={toggleShowMore}
                                >
                                    {showMore ? "Show Less" : "Show More"}
                                </button>
                            </div>
                        </>
                    )
                ) : isPC ? (
                    activeTab === 'requirements' ? (
                        // PC SYSTEM REQUIREMENTS TAB
                        <div className="px-4 py-12">
                            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                                {/* Installation Guide Box */}
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
                                    <div className="p-4 sm:p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.3 7l8.7 5 8.7-5M12 22V12"></path></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Installation Guide</h2>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Step-by-step setup process</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                                        <div className="space-y-6">
                                            {/* Step 1 */}
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">1</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">Run the downloaded image and drag the application to the Applications folder shortcut.</div>
                                                </div>
                                                <div className="absolute left-3 top-6 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                                            </div>
                                            {/* Step 2 */}
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">2</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">Just extract the rar / zip file.</div>
                                                </div>
                                                <div className="absolute left-3 top-6 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                                            </div>
                                            {/* Step 3 */}
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 text-blue-500"><span className="text-xs font-semibold">3</span></div>
                                                <div className="relative">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">Simply launch the game from <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-500/20"><svg className="w-4 h-4 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span className="font-mono text-sm text-blue-700 dark:text-blue-300 font-medium">{pcReq.additionalNotes}</span></span> inside the game folder</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Important Notes */}
                                        <div className="relative mt-8">
                                            <div className="absolute -inset-x-4 sm:-inset-x-8 inset-y-0 bg-gray-50 dark:bg-gray-800/50"></div>
                                            <div className="relative px-4 sm:px-6 py-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-amber-500" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Important Notes</h3>
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please review these important details before installation</p>
                                                    </div>
                                                </div>
                                                <div className="ml-11 space-y-3">
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Install necessary apps from Redist or _CommonRedist to ensure game launches without any problems.</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Always extract game in Antivirus / Defender excluded folder - Please check our FAQs to know why it is important.</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">Always run the game as administrator</p></div>
                                                    <div className="flex gap-3"><div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div><p className="flex-1 text-sm text-gray-600 dark:text-gray-300">For detailed guide, make sure to read Installation Guide.txt inside the game files.</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* System Requirements Box */}
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
                                    <div className="p-4 sm:p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 17v-6M8 11v6M16 11v6"></path></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Requirements</h2>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Minimum specifications needed</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                                        <div className="mt-8 first:mt-0 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">Requires a 64-bit processor and operating system</h3>
                                                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
                                            </div>
                                        </div>
                                        {/* Example requirements, replace with real data if available */}
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">OS</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{pcReq.os}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Processor</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{pcReq.processor}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{pcReq.memory}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Graphics</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{pcReq.graphics}</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">DirectX</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">Version 11</dd></div></div></div>
                                        <div className="relative mb-3 last:mb-0"><div className="absolute inset-0 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"></div><div className="relative p-3"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</dt><dd className="text-sm font-semibold text-gray-900 dark:text-white">{pcReq.storage}</dd></div></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // PC default: show description
                        <>
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        Description
                                    </h2>
                                    <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mt-2"></div>
                                </div>

                                <p
                                    className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed relative z-10"
                                    dangerouslySetInnerHTML={{
                                        __html: showMore
                                            ? (data.description ? data.description.replace(/\\n/g, '<br />') : "No description available.")
                                            : (data.description ? data.description.replace(/\\n/g, '<br />').substring(0, 800) + '...' : "No description available.")
                                    }}
                                />

                                <button
                                    className="mt-6 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                    onClick={toggleShowMore}
                                >
                                    {showMore ? "Show Less" : "Show More"}
                                </button>
                            </div>
                        </>
                    )
                ) : (
                    // Non-Mac/PC fallback (show description)
                    <>
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-600 opacity-20 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                    Description
                                </h2>
                                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mt-2"></div>
                            </div>

                            <p
                                className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed relative z-10"
                                dangerouslySetInnerHTML={{
                                    __html: showMore
                                        ? (data.description ? data.description.replace(/\\n/g, '<br />') : "No description available.")
                                        : (data.description ? data.description.replace(/\\n/g, '<br />').substring(0, 800) + '...' : "No description available.")
                                }}
                            />

                            <button
                                className="mt-6 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                onClick={toggleShowMore}
                            >
                                {showMore ? "Show Less" : "Show More"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DescriptionTabs;
