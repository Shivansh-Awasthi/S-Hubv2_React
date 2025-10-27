import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SiImessage } from "react-icons/si";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const AdminCommentsOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [latestComments, setLatestComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Move the condition check after all hooks
    const isAdminOrMod = user && (user.role === 'ADMIN' || user.role === 'MOD');

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

        return truncateContent(content, 70);
    };

    const fetchLatestComments = async () => {
        if (!isAdminOrMod) return;

        try {
            setRefreshing(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            const response = await axios.get(
                `${process.env.VITE_API_URL}/api/comments/admin/all`,
                {
                    headers,
                    params: {
                        page: 1,
                        limit: 4,
                        status: 'unread',
                        sortBy: 'newest'
                    }
                }
            );

            setLatestComments(response.data.comments || []);
            setUnreadCount(response.data.pagination?.totalUnread || 0);
        } catch (err) {
            console.error("Failed to fetch latest comments:", err);
            setError(err.response?.data?.error || 'Failed to load comments');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!isAdminOrMod) return;

        fetchLatestComments();

        // Set up polling every 2 minutes
        const interval = setInterval(fetchLatestComments, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isAdminOrMod]); // Add isAdminOrMod to dependencies

    const handleMarkAsRead = async (commentId) => {
        if (!isAdminOrMod) return;

        try {
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/admin/${commentId}/read`,
                {},
                { headers }
            );

            setLatestComments(prev => prev.filter(comment => comment._id !== commentId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark comment as read:", err);
        }
    };

    const handleGoToComment = (comment) => {
        setIsOpen(false);
        navigate(`/download/mac/${comment.appId.title.toLowerCase().replace(/\s+/g, '-')}/${comment.appId._id}`, {
            state: {
                scrollToComment: comment._id,
                highlightComment: comment._id
            }
        });
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/admin/comments');
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const truncateContent = (content, maxLength = 80) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Return null at the end after all hooks have been called
    if (!isAdminOrMod) {
        return null;
    }

    return (
        <div className="relative">
            {/* Comments Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                title="Recent Comments"
            >
                <SiImessage className="w-8 h-8 text-gray-300" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute top-full right-0 z-50 mt-2 w-96 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 dark:from-indigo-700 dark:to-purple-700">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center font-semibold text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Recent Comments
                                    {unreadCount > 0 && (
                                        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-indigo-600">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={fetchLatestComments}
                                        disabled={refreshing}
                                        className="text-xs text-indigo-100 hover:text-white focus:outline-none"
                                        title="Refresh"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={handleViewAll}
                                        className="flex items-center text-xs text-indigo-100 transition-colors hover:text-white focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                        <span>View All</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-1 flex justify-end">
                                <span className="text-xs text-indigo-200 italic">
                                    {unreadCount > 0 ? `${unreadCount} unread comments` : 'All caught up!'}
                                </span>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
                            {latestComments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">No new comments</p>
                                    <button
                                        onClick={handleViewAll}
                                        className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                    >
                                        View All Comments
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                latestComments.map(comment => (
                                    <div
                                        key={comment._id}
                                        className="group relative transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                        onClick={() => handleGoToComment(comment)}
                                    >
                                        {/* Blue line indicator for unread */}
                                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500"></div>

                                        <div className="block px-4 py-3">
                                            <div className="flex">
                                                {/* User Avatar with green background */}
                                                <div className="shrink-0 mr-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                        <img
                                                            src={comment.userId?.avatar || DEFAULT_AVATAR}
                                                            alt={comment.userId?.username}
                                                            className="w-8 h-8 rounded-full"
                                                            onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Comment Content */}
                                                <div className="flex-1 min-w-0 pr-8">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {comment.userId?.username}
                                                        </span>
                                                        {comment.userId?.role === 'ADMIN' && (
                                                            <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full text-white font-bold">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                        {comment.userId?.role === 'MOD' && (
                                                            <span className="bg-green-500 text-xs px-1.5 py-0.5 rounded-full text-white font-bold">
                                                                MOD
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className={`text-sm mt-1 ${isImageContent(comment.content)
                                                            ? 'text-blue-400 dark:text-blue-300 font-medium'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                        } line-clamp-2`}>
                                                        {renderCommentContent(comment.content)}
                                                    </div>

                                                    <div className="mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {formatTimeAgo(comment.createdAt)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-orange-600 text-sm font-medium">
                                                            {comment.appId?.title}
                                                        </span>
                                                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                                                            View Details
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleGoToComment(comment);
                                                }}
                                                className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:text-cyan-500 focus:opacity-100 dark:bg-gray-800 dark:hover:text-cyan-400"
                                                title="Go to game and reply"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(comment._id);
                                                }}
                                                className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:text-green-500 focus:opacity-100 dark:bg-gray-800 dark:hover:text-green-400"
                                                title="Mark as read"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-center border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                            <button
                                onClick={handleViewAll}
                                className="inline-flex items-center text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                View all comments
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminCommentsOverview;