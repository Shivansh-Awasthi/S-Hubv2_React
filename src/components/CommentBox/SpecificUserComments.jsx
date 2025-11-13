import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

const SpecificUserComments = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirectCountdown, setRedirectCountdown] = useState(7);

    // Check if content is an image URL
    const isImageContent = (content) => {
        if (!content) return false;

        // Common image URL patterns
        const imagePatterns = [
            /https?:\/\/.*\.(jpg|jpeg|png|gif|webp|bmp|svg)/i,
            /https?:\/\/i\.postimg\.cc/i,
            /https?:\/\/imgur\.com/i,
            /https?:\/\/i\.imgur\.com/i,
            /https?:\/\/cdn\.discordapp\.com\/attachments/i,
            /https?:\/\/storage\.googleapis\.com/i,
            /https?:\/\/firebasestorage\.googleapis\.com/i
        ];

        return imagePatterns.some(pattern => pattern.test(content));
    };

    // Render content with image detection
    const renderCommentContent = (content) => {
        if (isImageContent(content)) {
            return (
                <div className="flex items-center text-blue-400 dark:text-blue-300 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>send an attachment</span>
                </div>
            );
        }

        return content;
    };

    useEffect(() => {
        const fetchUserComments = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const xAuthToken = process.env.VITE_API_TOKEN;

                const headers = {};
                if (token) headers.Authorization = `Bearer ${token}`;
                if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

                // Fetch comments for the current user
                const response = await axios.get(
                    `${process.env.VITE_API_URL}/api/comments/user/${user.id}`,
                    { headers }
                );

                setComments(response.data.comments || []);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
                setError(err.response?.data?.error || 'Failed to load comments');
            } finally {
                setLoading(false);
            }
        };

        fetchUserComments();
    }, [user]);

    // Auto-redirect for non-logged in users
    useEffect(() => {
        if (!user && !loading) {
            const countdownInterval = setInterval(() => {
                setRedirectCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        window.location.href = '/signup';
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [user, loading]);

    // Format date to readable format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to create slug for download URLs (same as in your profile page)
    const createSlug = (text = "") => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };

    // Get platform slug - since we don't have platform data in comments,
    // we'll need to handle this based on available data
    const getPlatformSlug = (comment) => {
        // If the app data has platform information, use it
        if (comment.appId?.platform) {
            return createSlug(comment.appId.platform);
        }
        // Fallback to a default or try to get from title/other fields
        // You might need to adjust this based on your actual data structure
        return 'pc'; // default fallback
    };

    // Get game title for slug
    const getGameTitle = (comment) => {
        return comment.appId?.title || 'Unknown Game';
    };

    // Get game ID
    const getGameId = (comment) => {
        return comment.appId?._id || comment.appId;
    };

    // Construct proper download URL
    const getGameUrl = (comment) => {
        const platformSlug = getPlatformSlug(comment);
        const gameTitleSlug = createSlug(getGameTitle(comment));
        const gameId = getGameId(comment);

        if (gameId) {
            return `/download/${platformSlug}/${gameTitleSlug}/${gameId}`;
        }
        return '/'; // fallback to home if no game ID
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg font-medium">Loading your comments...</p>
                </div>
            </div>
        );
    }

    // Show login prompt for non-authenticated users
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                            My Comments
                        </h1>
                        <p className="text-lg text-gray-400">
                            Access your gaming conversations
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 text-center">
                        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
                        <p className="text-gray-300 mb-6">
                            Please log in to view your comments and join the gaming community discussions.
                        </p>

                        <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg mb-6">
                            <p className="text-amber-200 text-sm">
                                Redirecting to signup in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login Now
                            </Link>
                            <Link
                                to="/signup"
                                className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Create Account
                            </Link>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="text-center mt-8 space-y-4">
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                            <Link to="/games" className="hover:text-cyan-400 transition-colors">Browse Games</Link>
                            <Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} ToxicGame. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Comments</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                        My Comments
                    </h1>
                    <p className="text-gray-400 text-lg">
                        All comments you've posted across different games
                    </p>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">
                                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                            </div>
                            <div className="text-gray-300 text-sm">
                                Across {new Set(comments.map(c => c.appId?._id)).size} different games
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                {comments.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-lg mb-4">You haven't posted any comments yet</p>
                        <p className="text-gray-500 mb-8">Start the conversation by commenting on your favorite games</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                        >
                            Browse Games
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map(comment => {
                            const gameUrl = getGameUrl(comment);
                            return (
                                <div
                                    key={comment._id}
                                    className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Comment Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Game Title */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                                                <h3 className="text-white font-semibold text-lg truncate">
                                                    {getGameTitle(comment)}
                                                </h3>
                                            </div>

                                            {/* Comment Text */}
                                            <div className={`text-base mb-4 leading-relaxed ${isImageContent(comment.content)
                                                ? 'text-blue-400 font-medium'
                                                : 'text-gray-300'
                                                }`}>
                                                {isImageContent(comment.content) ? (
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>send an attachment</span>
                                                    </div>
                                                ) : (
                                                    comment.content
                                                )}
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                    {comment.isPinned && (
                                                        <span className="flex items-center gap-1 text-cyan-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                            </svg>
                                                            Pinned
                                                        </span>
                                                    )}
                                                    {comment.repliesCount > 0 && (
                                                        <span className="flex items-center gap-1 text-blue-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                            </svg>
                                                            {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => window.location.href = gameUrl}
                                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                                                    >
                                                        View Game
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecificUserComments;