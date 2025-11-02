import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { CiLock } from "react-icons/ci";
// import { jwtDecode } from 'jwt-decode';
import { useAuth, triggerAuthChange } from '../../../contexts/AuthContext.jsx'; // added
import NotificationBell from '../../CommentBox/NotificationBell.jsx';
import AdminCommentsOverview from '../../CommentBox/Admin/AdminCommentsOverview.jsx';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

// Utility functions
const createSlug = (text = '') => {
    const str = String(text || '');
    return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        || 'untitled';
};

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

// Search function
const searchApps = async (query, page = 1, limit = 7) => {
    try {
        const response = await fetch(
            `${process.env.VITE_API_URL}/api/apps/all?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}`,
            {
                headers: {
                    'X-Auth-Token': process.env.VITE_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Search failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Search error:', error);
        return { apps: [], total: 0 };
    }
};

// Skeleton Loading Component
const LiveSearchSkeleton = ({ itemCount }) => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-lg border border-purple-600/20 shadow-lg z-50">
        {Array.from({ length: itemCount }).map((_, index) => (
            <div key={index} className="py-2 px-4 animate-pulse">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                    <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Profile Icon Component
const ProfileIcon = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);
    // Use global auth user so header updates when auth changes
    const { user } = useAuth();

    // Click outside to close dropdown
    useEffect(() => {
        if (!showDropdown) return;

        const handleClick = (e) => {
            if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-icon-btn')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        // notify AuthProvider to refresh global user state
        try { triggerAuthChange(); } catch (e) { window.dispatchEvent(new Event('auth-change')); }
        setShowLogoutWarning(false);
        setShowDropdown(false);
        // optional: redirect to home
        window.location.href = '/';
    };

    return (
        <div className="relative flex items-center ml-4">

            <div className='mr-4'>
                <AdminCommentsOverview />
            </div>

            {/* Request Button */}
            <Link to="/request" className="relative inline-block group mr-2" style={{ marginRight: '24px' }}>
                <div className="relative">
                    {/* Shadow layers */}
                    <div className="absolute top-1 left-1 w-full h-full bg-black rounded-lg"></div>
                    <div className="absolute top-0.5 left-0.5 w-full h-full bg-purple-700 rounded-lg"></div>
                    {/* Main button */}
                    <div className="relative bg-[#5865F2] rounded-lg p-3 border-4 border-black transform transition-all duration-100 group-hover:-translate-x-1 group-hover:-translate-y-1 active:translate-x-0 active:translate-y-0">
                        <div className="flex items-center gap-2">
                            {/* Responsive label */}
                            <span className="text-white font-black text-sm uppercase tracking-tight hidden sm:inline">Request Game</span>
                            <span className="text-white font-black text-sm uppercase tracking-tight sm:hidden">Request</span>
                            {/* Ping effect dot */}
                            <div className="relative w-3 h-3">
                                <span className="absolute w-full h-full bg-yellow-300 rounded-full animate-ping opacity-75"></span>
                                <span className="absolute w-full h-full bg-yellow-300 rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className='mr-4'>
                <NotificationBell />
            </div>

            {/* Profile Icon Button or Login Button */}
            {user ? (
                <button
                    className="focus:outline-none profile-icon-btn"
                    onClick={() => setShowDropdown((v) => !v)}
                >
                    <img
                        src={user.avatar || DEFAULT_AVATAR}
                        alt="avatar"
                        className="w-14 h-14 rounded-full border-2 border-blue-400 bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-purple-500 transition duration-200"
                        onError={e => (e.target.src = DEFAULT_AVATAR)}
                    />
                </button>
            ) : (
                <Link to="/login" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                    Login
                </Link>
            )}

            {/* Profile Dropdown */}
            {user && showDropdown && (
                <div className="profile-dropdown absolute right-0 mt-[31rem] w-64 bg-[#181C23] rounded-2xl shadow-2xl py-4 z-50 border border-[#232323] flex flex-col gap-1">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">My profile</span>
                    </Link>
                    <Link to="/my-comments" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">My Comments</span>
                    </Link>
                    <Link to="/liked" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">Liked</span>
                    </Link>
                    <Link to="/watchlist" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">Watchlist</span>
                    </Link>
                    <div className="border-t border-[#232323] my-2"></div>
                    <Link to="/billing" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">Billing</span>
                    </Link>
                    <Link to="/membership" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">Subscription</span>
                    </Link>
                    <div className="border-t border-[#232323] my-2"></div>
                    <Link to="/settings" onClick={() => setShowDropdown(false)}>
                        <span className="block px-6 py-2 text-gray-200 hover:bg-[#232323] cursor-pointer text-base">Settings</span>
                    </Link>
                    <button
                        className="block w-full text-left px-6 py-2 text-red-400 hover:bg-[#232323] cursor-pointer text-base"
                        onClick={() => setShowLogoutWarning(true)}
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* Logout Warning Modal */}
            {showLogoutWarning && (
                <div className="fixed inset-0 flex items-center justify-center z-[300] bg-black/60 backdrop-blur-[8px] transition-all" onClick={() => setShowLogoutWarning(false)}>
                    <div className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full p-0" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
                        <div className="p-8 sm:p-10">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-2 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Are you sure you want to logout?</div>
                                <div className="text-gray-500 dark:text-gray-300 mb-4 text-base">You will need to login again to access your account.</div>
                                <div className="flex justify-center gap-4 w-full mt-4">
                                    <button
                                        className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-all text-lg"
                                        onClick={() => setShowLogoutWarning(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-600 transition-all text-lg"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main LiveSearch Component
const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ apps: [], total: 0 });
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // prevent the live dropdown from reopening immediately after a deliberate navigation (Enter / View all)
    const [preventOpen, setPreventOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Use global auth user so header updates immediately after login/logout
    const { user } = useAuth();
    const purchasedGames = user?.purchasedGames || [];
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'MOD' || user?.role === 'PREMIUM';

    // Handle search input change with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsLoading(true);
                searchApps(searchQuery, 1, 7)
                    .then(results => {
                        setSearchResults(results);
                        // Only auto-open results if not prevented by a recent "submit" action
                        if (!preventOpen) {
                            setShowResults(true);
                        }
                    })
                    .catch(error => {
                        console.error('Search error:', error);
                        setSearchResults({ apps: [], total: 0 });
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } else {
                setSearchResults({ apps: [], total: 0 });
                setShowResults(false);
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle click outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            const timestamp = Date.now();
            // prevent the live dropdown from reopening when we navigate
            setPreventOpen(true);
            setShowResults(false);
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}&t=${timestamp}`);
            // clear the flag after a short delay so live search resumes normally
            setTimeout(() => setPreventOpen(false), 800);
        }
    };

    // Clear search
    const handleClear = () => {
        setSearchQuery('');
        setSearchResults({ apps: [], total: 0 });
        setShowResults(false);
    };


    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
                {/* Search Bar */}
                <div className="flex-1">
                    <div
                        ref={searchRef}
                        className="flex flex-wrap relative ring-1 ring-[#3E3E3E] rounded-lg w-full max-w-[760px] z-21"
                    >
                        <form onSubmit={handleSearch} className="w-full flex items-center">
                            <input
                                type="text"
                                placeholder="Search the site"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-[#242424] hover:bg-[#262626] rounded-lg text-white py-3 pl-4 pr-12 h-12 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-opacity-80 transition duration-200"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-14 top-0 h-full w-4 flex items-center justify-center rounded-full"
                                >
                                    <RxCross2 className="text-xxl h-7 w-7 text-[#8e8e8e] hover:text-[#ffffff]" />
                                </button>
                            )}
                            <button type="submit" className="absolute right-1 top-0 h-full w-12 flex items-center justify-center rounded-full">
                                <CiSearch className="text-xxl h-7 w-7 text-[#8e8e8e] hover:text-[#ffffff]" />
                            </button>
                        </form>

                        {/* Live Search Results Dropdown */}
                        {showResults && searchQuery.trim() && (
                            <>
                                {isLoading ? (
                                    <LiveSearchSkeleton itemCount={7} />
                                ) : searchResults.apps && searchResults.apps.length > 0 ? (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-lg border border-purple-600/20 shadow-lg z-50">
                                        {/* Ambient background elements */}
                                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                        <ul className="divide-y divide-gray-700/30 relative z-10">
                                            {searchResults.apps.map((app) => {
                                                const isPurchased = purchasedGames.includes(app._id);
                                                // Updated unlock logic to include copyrighted games
                                                const isUnlocked = isAdmin ||
                                                    (!app.isPaid && !app.copyrighted) ||
                                                    (app.isPaid && isPurchased) ||
                                                    (app.copyrighted && user);
                                                const isLocked = !isUnlocked;

                                                // Create appropriate URL based on game type and auth status
                                                const downloadUrl = `/download/${createSlug(app.platform)}/${createSlug(app.title)}/${app._id}`;

                                                return (
                                                    <li
                                                        key={app._id}
                                                        className={`py-2 px-4 hover:bg-black/20 transition-all duration-200 relative ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <Link
                                                            to={downloadUrl}
                                                            className={`flex items-center ${isLocked ? 'pointer-events-none' : ''}`}
                                                            onClick={(e) => handleSearchResultClick(app, e)}
                                                        >
                                                            <div className="relative flex-shrink-0">
                                                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                                                <img
                                                                    className="relative w-10 h-10 rounded-lg object-cover border border-purple-500/20"
                                                                    src={app.thumbnail?.[0] || '/default-thumbnail.jpg'}
                                                                    alt={app.title}
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/40x40/1E1E1E/8e8e8e?text=IMG';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <p className={`font-medium truncate ${getPlatformColorClass(app.platform)}`}>
                                                                    {app.title}
                                                                </p>
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-xs text-gray-400">{app.platform}</p>
                                                                    {/* Copyright/Premium indicator */}
                                                                    {(app.copyrighted || app.isPaid) && (
                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${app.copyrighted ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'
                                                                            }`}>
                                                                            {app.copyrighted ? 'Copyright' : 'Premium'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>

                                                        {/* Lock Icon and Message for Locked Games */}
                                                        {isLocked && (
                                                            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10 bg-black/50 rounded">
                                                                <div className="text-center">
                                                                    <CiLock className="text-white font-bold text-xl mx-auto mb-1" />
                                                                    <span className="text-white text-xs block">
                                                                        {app.copyrighted ? "Copyright Claim" : "Premium Game"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}

                                            {/* View all results link */}
                                            <li className="py-2 px-4 bg-black/30">
                                                <button
                                                    className="text-center block w-full text-sm text-purple-400 hover:text-purple-300 font-medium"
                                                    onClick={() => {
                                                        // prevent dropdown from reopening on navigation
                                                        setPreventOpen(true);
                                                        setShowResults(false);
                                                        const timestamp = Date.now();
                                                        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}&t=${timestamp}`);
                                                        setTimeout(() => setPreventOpen(false), 800);
                                                    }}
                                                >
                                                    View all {searchResults.total} results
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    // No results found
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-lg border border-purple-600/20 shadow-lg overflow-hidden z-50">
                                        {/* Ambient background elements */}
                                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                        <div className="p-4 text-center relative z-10">
                                            <p className="text-gray-300 text-sm">No results found for "{searchQuery}"</p>
                                            <p className="text-gray-400 text-xs mt-1">Try different keywords or check spelling</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Buttons: Request & Profile/Login */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end mt-2 md:mt-0 ml-0 md:ml-4 w-full md:w-auto gap-0 space-y-2 md:space-y-0 md:gap-2">
                    <div className="flex flex-col w-full gap-2 md:flex-row md:w-auto md:gap-2">
                        <ProfileIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;