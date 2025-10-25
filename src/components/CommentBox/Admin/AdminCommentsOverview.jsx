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
        navigate(`/download/mac/${comment.appId.slug}/${comment.appId._id}`, {
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
                <div className="absolute right-0 top-12 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">Recent Comments</h3>
                                    <p className="text-gray-400 text-xs">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchLatestComments}
                                    disabled={refreshing}
                                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                    title="Refresh"
                                >
                                    <svg
                                        className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>

                                <button
                                    onClick={handleViewAll}
                                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                                >
                                    View All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="max-h-96 overflow-y-auto">
                        {latestComments.length === 0 ? (
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No new comments</p>
                                <button
                                    onClick={handleViewAll}
                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                                >
                                    View All Comments
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-700">
                                {latestComments.map(comment => (
                                    <div
                                        key={comment._id}
                                        className="p-4 hover:bg-gray-700/30 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* User Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={comment.userId?.avatar || DEFAULT_AVATAR}
                                                    alt={comment.userId?.username}
                                                    className="w-8 h-8 rounded-full border-2 border-cyan-500/20"
                                                    onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                />
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full border border-gray-800 animate-pulse"></div>
                                            </div>

                                            {/* Comment Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-white text-sm">
                                                        {comment.userId?.username}
                                                    </span>
                                                    {comment.userId?.role === 'ADMIN' && (
                                                        <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded text-white font-bold">
                                                            ADMIN
                                                        </span>
                                                    )}
                                                    {comment.userId?.role === 'MOD' && (
                                                        <span className="bg-green-500 text-xs px-1.5 py-0.5 rounded text-white font-bold">
                                                            MOD
                                                        </span>
                                                    )}
                                                    <span className="text-gray-400 text-xs ml-auto">
                                                        {formatTimeAgo(comment.createdAt)}
                                                    </span>
                                                </div>

                                                <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                                                    {truncateContent(comment.content, 70)}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-cyan-400 text-xs font-medium">
                                                        {comment.appId?.title}
                                                    </span>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => handleGoToComment(comment)}
                                                            className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded text-xs font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                                                            title="Go to game and reply"
                                                        >
                                                            Reply
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkAsRead(comment._id)}
                                                            className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded text-xs font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                                                            title="Mark as read"
                                                        >
                                                            Read
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {latestComments.length > 0 && (
                        <div className="p-3 border-t border-gray-700 bg-gray-750 rounded-b-xl">
                            <button
                                onClick={handleViewAll}
                                className="w-full py-2 text-center text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200"
                            >
                                View All Comments →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCommentsOverview;