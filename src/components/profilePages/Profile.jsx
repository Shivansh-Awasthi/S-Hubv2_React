import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const Profile = () => {
    // Use global auth state instead of local JWT decoding/fetch
    const { user, loading: authLoading } = useAuth();

    // Local UI state
    const [games, setGames] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [localLoading, setLocalLoading] = useState(false);

    const loading = authLoading || localLoading;

    const tabList = [
        {
            key: 'overview', label: 'Overview', icon: (
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V7a4 4 0 118 0v4M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
            )
        },
        {
            key: 'liked', label: 'Liked', icon: (
                <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a4 4 0 014-4 4 4 0 014 4c0 2.21-1.79 4-4 4S4 8.21 4 6z" /></svg>
            )
        },
        {
            key: 'history', label: 'Game History', icon: (
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
        {
            key: 'watchlist', label: 'Watchlist', icon: (
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m6 0H9" /></svg>
            )
        },
    ];

    // Fetch purchased games when the global `user` becomes available/changes.
    useEffect(() => {
        const fetchPurchasedGames = async () => {
            if (!user || !user.purchasedGames || user.purchasedGames.length === 0) {
                setGames([]);
                return;
            }
            setLocalLoading(true);
            try {
                const token = localStorage.getItem("token");
                const xAuthToken = process.env.VITE_API_TOKEN;
                const headers = {};
                if (token) headers.Authorization = `Bearer ${token}`;
                if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

                // Try bulk fetch first
                try {
                    const gamesRes = await axios.get(
                        `${process.env.VITE_API_URL}/api/apps/get-multiple`,
                        {
                            params: { ids: user.purchasedGames.join(",") },
                            headers,
                        }
                    );
                    setGames(gamesRes.data.apps || []);
                } catch (bulkErr) {
                    // Fallback: fetch individually
                    const gameDetails = await Promise.all(
                        user.purchasedGames.map(async (id) => {
                            try {
                                const res = await axios.get(
                                    `${process.env.VITE_API_URL}/api/apps/get/${id}`,
                                    { headers }
                                );
                                return res.data.app;
                            } catch (err) {
                                return null;
                            }
                        })
                    );
                    setGames(gameDetails.filter(Boolean));
                }
            } catch (err) {
                console.error("Failed to load purchased games:", err);
                setGames([]);
            } finally {
                setLocalLoading(false);
            }
        };
        fetchPurchasedGames();
    }, [user]);

    // Function to create slug for download URLs
    const createSlug = (text = "") => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900  flex items-center justify-center">
                <div className="text-center p-8 bg-gray-900/80 rounded-2xl border border-gray-700/50">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p className="text-white text-lg font-semibold mb-2">Authentication Required</p>
                    <p className="text-gray-400 mb-6">You must be logged in to view your profile.</p>
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Banner */}
            <div className="w-full h-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-b-3xl mb-[-80px] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>

                {/* Edit Profile Button */}
                <button
                    onClick={() => window.location.href = '/settings'}
                    className="z-20 absolute right-6 bottom-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-2xl shadow-2xl px-8 py-3 text-base flex items-center gap-3 transition-all duration-200 border-2 border-purple-400/50 backdrop-blur-md group cursor-pointer hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(139,92,246,0.3)]"
                >
                    <span className="font-bold tracking-wide">Edit Profile</span>
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </button>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Avatar and Username */}
                <div className="flex flex-col items-center pt-0 pb-8">
                    <div className="-mt-20 mb-4 relative">
                        <div className="relative">
                            <img
                                src={user.avatar || DEFAULT_AVATAR}
                                alt="avatar"
                                className="w-32 h-32 rounded-full border-4 border-white/20 bg-gray-800 object-cover shadow-2xl"
                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">{user.username}</div>
                    <div className="text-gray-400 text-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-2 shadow-2xl">
                        {tabList.map(tab => (
                            <button
                                key={tab.key}
                                className={`px-8 py-4 flex items-center font-semibold transition-all duration-300 rounded-xl ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* Stats Cards */}
                        <div>
                            <div className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                                Game Statistics
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Points Card */}
                                <div className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300 group hover:scale-105">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="text-blue-400 text-sm font-semibold">+0%</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">70 <span className="text-lg font-normal text-blue-300">pts</span></div>
                                    <div className="text-gray-300 text-sm">Total Points Earned</div>
                                </div>

                                {/* Games Card */}
                                <div className="bg-gradient-to-br from-pink-900/40 to-pink-700/20 rounded-2xl p-6 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-300 group hover:scale-105">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-pink-400 text-sm font-semibold">+0</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{games.length}</div>
                                    <div className="text-gray-300 text-sm">Games Purchased</div>
                                </div>

                                {/* Spending Card */}
                                <div className="bg-gradient-to-br from-green-900/40 to-green-700/20 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm hover:border-green-400/40 transition-all duration-300 group hover:scale-105">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div className="text-green-400 text-sm font-semibold">Total</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        ₹{games.reduce((sum, g) => sum + (g.price || 0), 0).toLocaleString("en-IN")}
                                    </div>
                                    <div className="text-gray-300 text-sm">Total Spent</div>
                                </div>

                                {/* Member Card */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-xs px-3 py-1 rounded-full text-white font-semibold">
                                            Verified
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-white mb-1">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Recent'}
                                    </div>
                                    <div className="text-gray-300 text-sm">Member Since</div>
                                </div>
                            </div>
                        </div>

                        {/* Purchased Games List */}
                        <div>
                            <div className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"></div>
                                Your Game Library
                            </div>
                            {games.length === 0 ? (
                                <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-lg mb-4">Your game library is empty</p>
                                    <p className="text-gray-500 mb-8">Start building your collection by purchasing games</p>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                                    >
                                        Browse Games
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {games.map(game => {
                                        const downloadUrl = `/download/${createSlug(game.platform)}/${createSlug(game.title)}/${game._id}`;
                                        return (
                                            <a
                                                key={game._id}
                                                href={downloadUrl}
                                                className="block group"
                                            >
                                                <div className="relative bg-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500/30 group-hover:shadow-2xl">
                                                    {/* Game Cover */}
                                                    <div className="relative h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
                                                        <img
                                                            src={game.coverImg || "/default-game.png"}
                                                            alt={game.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                                                        {/* Platform Badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${game.platform === 'PC' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                                game.platform === 'Mac' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                                    game.platform === 'Android' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                                }`}>
                                                                {game.platform}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Game Info */}
                                                    <div className="p-5">
                                                        <div className="flex items-start gap-4">
                                                            {/* Thumbnail */}
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={game.thumbnail?.[0] || game.coverImg || "/default-game.png"}
                                                                    alt={game.title}
                                                                    className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600/50"
                                                                />
                                                            </div>

                                                            {/* Details */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-white text-lg mb-1 truncate">{game.title}</h3>
                                                                <p className="text-gray-400 text-sm mb-2">{game.architecture}</p>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-gray-300 text-sm font-medium">{game.size || 'N/A'}</span>
                                                                    <span className="bg-gradient-to-r from-green-400 to-blue-500 text-xs px-2 py-1 rounded-full text-white font-semibold">
                                                                        Purchased
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Download Button */}
                                                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-400">Ready to download</span>
                                                                <span className="text-purple-400 font-semibold flex items-center gap-1">
                                                                    Download
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab !== 'overview' && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 bg-gray-900/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Coming Soon</div>
                        <div className="text-gray-400 text-lg text-center max-w-md mb-8">
                            This feature will be available in a future update. Stay tuned for more awesome profile tools!
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-gray-800/50 text-gray-300 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-200">
                                Learn More
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                            >
                                Browse Games
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;