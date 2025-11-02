import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CiLock } from 'react-icons/ci';
import SearchSkeleton from './../../skeletons/SeatchResultSkeleton.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';

// Function to format dates consistently
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Function to create slug (you can place this in a separate utils file)
const createSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

const SearchResults = () => {
    // Use React Router's useLocation to get current URL
    const location = useLocation();
    const navigate = useNavigate();

    // USE THE SAME AUTH CONTEXT AS HEADER
    const { user } = useAuth();

    // Query state from URL
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalApps, setTotalApps] = useState(0);
    const itemsPerPage = 48;
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch data from API
    const fetchData = async (searchQuery, page) => {
        if (!searchQuery || searchQuery.length < 1) {
            setError(<span style={{ fontSize: '15px' }}>⚠ Search field is empty.</span>);
            setData([]);
            setTotalApps(0);
            setLoading(false);
            setHasSearched(false);
            return;
        }
        setLoading(true);
        setError('');
        setHasSearched(true);
        try {
            const trimmedQuery = searchQuery.trim();
            const response = await fetch(
                `${process.env.VITE_API_URL}/api/apps/all?page=${page}&limit=${itemsPerPage}&q=${encodeURIComponent(trimmedQuery)}`,
                {
                    headers: {
                        'X-Auth-Token': process.env.VITE_API_TOKEN
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const responseData = await response.json();
            if (responseData.success) {
                setData(responseData.apps);
                setTotalApps(responseData.total);
                setError('');
            } else {
                setError('Failed to load data. Please try again later.');
            }
        } catch (error) {
            console.error("Error fetching apps:", error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Get query from URL on mount AND when URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlQuery = urlParams.get('query') || '';
        setQuery(urlQuery);
    }, [location.search]);

    // Reset page to 1 when query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // Fetch data when query or page changes
    useEffect(() => {
        if (query) {
            fetchData(query, currentPage);
        } else {
            setData([]);
            setTotalApps(0);
            setHasSearched(false);
        }
    }, [query, currentPage]);

    // Calculate total pages based on the total apps count
    const totalPages = Math.ceil(totalApps / itemsPerPage);

    // Handle Page Change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // UPDATED: Platform color function to match header
    const getPlatformColorClass = (platform) => {
        const platformColors = {
            mac: 'text-blue-400',
            pc: 'text-green-400',
            android: 'text-green-500',
            ps2: 'text-purple-400',
            ps3: 'text-blue-500',
            ppsspp: 'text-orange-400',
            smac: 'text-cyan-400'
        };
        return platformColors[platform?.toLowerCase()] || 'text-gray-300';
    };

    // Handle search result click for copyrighted/paid games
    const handleSearchResultClick = (ele, e) => {
        const purchasedGames = user?.purchasedGames || [];
        const isPurchased = purchasedGames.includes(ele._id);
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'MOD' || user?.role === 'PREMIUM';
        const isUnlocked = isAdmin || !ele.isPaid || isPurchased;
        const isCopyrighted = ele.copyrighted === true;

        // NEW: Priority order - paid lock first, then copyright lock for non-logged in users
        const isPaidLock = !isUnlocked;
        const isCopyrightLock = isCopyrighted && !user;
        const isLocked = isPaidLock || isCopyrightLock;

        // If the game is locked, prevent navigation
        if (isLocked) {
            e.preventDefault();
            return;
        }
    };

    return (
        <div>
            <div className='cover mb-6'>
                {data.length > 0 && !error && (
                    <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-3xl font-bold mb-4'>
                        Search Results <span className='font-medium ml-2 text-[#8E8E8E]'>{totalApps}</span>
                    </h1>
                )}
            </div>

            {loading ? (
                <SearchSkeleton itemCount={12} />
            ) : error ? (
                <div>
                    <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-3xl font-bold mb-6'>Oops! Something went wrong</h1>
                    <div className="p-6 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl text-sm text-center border border-purple-600/20 shadow-lg relative overflow-hidden">
                        {/* Ambient background elements */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>
                        <p className="relative z-10">{error}</p>
                    </div>
                </div>
            ) : (!loading && data.length === 0 && hasSearched) ? (
                <div>
                    <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-3xl font-bold mb-6'>No Results Found</h1>
                    <div className="p-6 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl text-sm text-center border border-purple-600/20 shadow-lg relative overflow-hidden">
                        {/* Ambient background elements */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>
                        <p className="relative z-10 text-white">Sorry, your search did not yield any results. Try changing or shortening your query.</p>
                    </div>
                </div>
            ) : (
                <div className="w-full md:w-full pt-3 pb-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl border border-purple-600/20 shadow-lg relative overflow-hidden">
                    {/* Ambient background elements */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                    <div className="flow-root relative z-10">
                        <ul role="list" className="divide-y divide-gray-700/30">
                            {data.map((ele) => {
                                // UPDATED UNLOCK LOGIC WITH PRIORITY ORDER
                                const purchasedGames = user?.purchasedGames || [];
                                const isPurchased = purchasedGames.includes(ele._id);
                                const isAdmin = user?.role === 'ADMIN' || user?.role === 'MOD' || user?.role === 'PREMIUM';
                                const isUnlocked = isAdmin || !ele.isPaid || isPurchased;
                                const isCopyrighted = ele.copyrighted === true;

                                // NEW: Priority order - paid lock first, then copyright lock for non-logged in users
                                const isPaidLock = !isUnlocked;
                                const isCopyrightLock = isCopyrighted && !user;
                                const isLocked = isPaidLock || isCopyrightLock;

                                // Create appropriate URL based on game type and auth status
                                let downloadUrl = `/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`;

                                return (
                                    <li
                                        key={ele._id}
                                        className={`py-2 sm:py-2 p-8 relative hover:bg-black/20 transition-all duration-200 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <Link
                                            to={downloadUrl}
                                            className={`flex items-center justify-between w-full ${isLocked ? 'pointer-events-none' : ''}`}
                                            onClick={(e) => handleSearchResultClick(ele, e)}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                                <img
                                                    className="relative w-12 h-12 rounded-lg object-cover border border-purple-500/20 transition-all duration-300 hover:scale-105"
                                                    src={ele.thumbnail[0]}
                                                    alt={ele.title}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 ms-4">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-medium truncate ${getPlatformColorClass(ele.platform)}`}>
                                                        {ele.title}
                                                    </p>
                                                    {/* Copyright/Premium indicator */}
                                                    {(ele.copyrighted || ele.isPaid) && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${ele.isPaid ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {ele.isPaid ? 'Premium' : 'Copyright'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm truncate flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-1 ${getPlatformColorClass(ele.platform)}`}>
                                                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                                        <path d="M12 18h.01" />
                                                    </svg>
                                                    <span className={`${getPlatformColorClass(ele.platform)} font-medium`}>
                                                        {ele.platform}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex-1 flex justify-center text-sm font-semibold text-gray-400 hidden sm:block">
                                                {ele.size}
                                            </div>
                                            <div className="text-right text-sm text-gray-400 hidden md:block">
                                                {formatDate(ele.updatedAt)}
                                            </div>
                                        </Link>

                                        {/* Lock Overlay for Locked Games */}
                                        {isLocked && (
                                            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-black/50 rounded">
                                                <div className="text-center">
                                                    <CiLock className="text-cyan-400 font-bold text-2xl mx-auto mb-1" />
                                                    <span className="text-white text-xs block">
                                                        {isPaidLock ? <span className='text-violet-500'>Premium Game </span> :
                                                            <span className='text-red-500'>Copyright Claim</span>}
                                                    </span>

                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}

            {/* Pagination Controls - Improved Design */}
            {totalApps > itemsPerPage && !loading && query && (
                <div className="flex justify-center mt-8 mb-8">
                    <nav aria-label="Page navigation" className="inline-flex items-center">
                        {/* Previous Button */}
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`relative px-4 py-2.5 rounded-l-md text-sm font-medium transition-all duration-300
                                ${currentPage === 1
                                    ? 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#1E1E1E] to-[#121212] text-white hover:from-purple-600 hover:to-blue-600 hover:text-white hover:scale-105 border border-purple-500/20'
                                } border-r border-purple-500/20 focus:z-20 focus:outline-none transform transition-transform shadow-lg`}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex">
                            {(() => {
                                const pageNumbers = [];
                                const maxPagesToShow = 5;

                                if (totalPages <= maxPagesToShow) {
                                    for (let i = 1; i <= totalPages; i++) {
                                        pageNumbers.push(i);
                                    }
                                } else {
                                    if (currentPage <= 3) {
                                        for (let i = 1; i <= 4; i++) {
                                            pageNumbers.push(i);
                                        }
                                        pageNumbers.push('ellipsis');
                                        pageNumbers.push(totalPages);
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumbers.push(1);
                                        pageNumbers.push('ellipsis');
                                        for (let i = totalPages - 3; i <= totalPages; i++) {
                                            pageNumbers.push(i);
                                        }
                                    } else {
                                        pageNumbers.push(1);
                                        pageNumbers.push('ellipsis');
                                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                            pageNumbers.push(i);
                                        }
                                        pageNumbers.push('ellipsis');
                                        pageNumbers.push(totalPages);
                                    }
                                }

                                return pageNumbers.map((pageNumber, index) => {
                                    if (pageNumber === 'ellipsis') {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-400 bg-gradient-to-r from-[#1E1E1E] to-[#121212] border border-purple-500/20"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300
                                                ${currentPage === pageNumber
                                                    ? 'z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                                                    : 'bg-gradient-to-r from-[#1E1E1E] to-[#121212] text-white hover:from-purple-600/70 hover:to-blue-600/70 hover:scale-105 border border-purple-500/20'
                                                } border-r border-purple-500/20 focus:z-20 focus:outline-none transform transition-transform shadow-lg`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* Mobile Pagination */}
                        <div className="flex sm:hidden">
                            <span className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white border-r border-purple-500/20 shadow-lg shadow-purple-500/20">
                                {currentPage} / {totalPages}
                            </span>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`relative px-4 py-2.5 rounded-r-md text-sm font-medium transition-all duration-300
                                ${currentPage === totalPages
                                    ? 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#1E1E1E] to-[#121212] text-white hover:from-purple-600 hover:to-blue-600 hover:text-white hover:scale-105 border border-purple-500/20'
                                } focus:z-20 focus:outline-none transform transition-transform shadow-lg`}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default SearchResults;