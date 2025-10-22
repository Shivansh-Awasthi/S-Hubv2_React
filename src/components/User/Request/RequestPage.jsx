import React, { useEffect, useState, useRef } from "react";
import GameRequestList from "./GameRequestList";
import GameRequest from "./GameRequest";

function MemberOnlyCard() {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[8px] transition-all">
            <div className="relative w-full max-w-2xl mx-4" style={{ zIndex: 201 }}>
                {/* Card Container */}
                <div className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    {/* Top Border Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
                    {/* Card Content */}
                    <div className="p-8 sm:p-12">
                        {/* Icon Section */}
                        <div className="mb-10 flex justify-center">
                            <div className="group relative">
                                <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-blue-500/40 to-indigo-500/40 animate-pulse group-hover:from-blue-600/40 group-hover:to-indigo-600/40 transition-all duration-300"></div>
                                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 shadow-xl p-4 transition-all duration-300">
                                    <img src="https://i.postimg.cc/9fxCdJDc/image-removebg-preview.png" alt="ToxicGames" className="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                        {/* Title Section */}
                        <div className="text-center space-y-3 mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Request is for Members Only
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                                Unlock exclusive features and join thousands of gamers in discovering and requesting new games.
                            </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            {/* Login Button */}
                            <a href="/login" className="flex-1 group relative overflow-hidden rounded-xl bg-blue-500 p-px hover:shadow-lg transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:opacity-90 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 text-white font-semibold group-hover:bg-transparent transition-all duration-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In Now
                                </div>
                            </a>
                            {/* Register Button */}
                            <a href="/signup" className="flex-1 group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 p-px hover:shadow-lg transition-all duration-300">
                                <div className="relative flex items-center justify-center gap-2 px-8 py-4 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Create Account
                                </div>
                            </a>
                        </div>
                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        Request Games
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-11">
                                    Join our community in discovering and requesting new games
                                </p>
                            </div>
                            <div className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        Vote & Support
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-11">
                                    Participate in game selection process
                                </p>
                            </div>
                            <div className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        Track Progress
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-11">
                                    Monitor your requests in real-time
                                </p>
                            </div>
                            <div className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        Exclusive Updates
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-11">
                                    Get notified about request updates
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RequestPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showMemberCard, setShowMemberCard] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
            // Scroll effect for non-logged-in users
            setTimeout(() => {
                // Scroll to bottom
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });

                // Then scroll back to top and show member card
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    setShowMemberCard(true);
                }, 2000);
            }, 100);
        }
    }, []);

    return (
        <div className="bg-[#030712] min-h-screen" ref={contentRef}>
            {/* Always render the content */}
            <GameRequest />
            <GameRequestList />

            {/* Show member card only after scroll effect */}
            {!isLoggedIn && showMemberCard && <MemberOnlyCard />}
        </div>
    );
}


export default RequestPage;