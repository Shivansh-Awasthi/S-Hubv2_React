import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const ReplyNotifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

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
    const renderNotificationContent = (content) => {
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

        return truncateContent(content);
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            const response = await axios.get(
                `${process.env.VITE_API_URL}/api/comments/notifications`,
                { headers }
            );

            setNotifications(response.data.notifications || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError(err.response?.data?.error || 'Failed to load notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAsRead = async (notificationId, e) => {
        if (e) e.stopPropagation();

        try {
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/notifications/${notificationId}/read`,
                {},
                { headers }
            );

            // 🔥 FIXED: Update the notification as read instead of removing it
            setNotifications(prev => prev.map(notif =>
                notif._id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            ));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/notifications/read-all`,
                {},
                { headers }
            );

            // 🔥 FIXED: Mark all as read instead of clearing the array
            setNotifications(prev => prev.map(notif =>
                ({ ...notif, isRead: true })
            ));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read when clicked (if not already read)
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }

        // Navigate to the game page with comment ID for scrolling
        navigate(`/download/mac/${notification.appId.title.toLowerCase().replace(/\s+/g, '-')}/${notification.appId._id}`, {
            state: {
                scrollToComment: notification.parentId,
                highlightComment: notification.parentId
            }
        });
    };

    const isNotificationRead = (notification) => {
        return notification.isRead;
    };

    const getUnreadCount = () => {
        return notifications.filter(notif => !isNotificationRead(notif)).length;
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return '0 seconds ago';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    const truncateContent = (content, maxLength = 100) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
                        <p className="text-gray-400 mb-6">Please log in to view your notifications</p>
                        <a
                            href="/login"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                        >
                            Login to Continue
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-300">Loading notifications...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Error Loading Notifications</h3>
                            <p className="text-gray-400 mb-4">{error}</p>
                            <button
                                onClick={fetchNotifications}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const unreadCount = getUnreadCount();

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm mb-6">
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Notifications
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                                    {unreadCount > 0 && (
                                        <span className="text-cyan-400 ml-2">
                                            ({unreadCount} unread)
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                    title="Refresh"
                                >
                                    <svg
                                        className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center backdrop-blur-sm">
                            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Notifications</h3>
                            <p className="text-gray-400">You'll see notifications here when someone replies to your comments.</p>
                        </div>
                    ) : (
                        notifications.map(notification => {
                            const isRead = isNotificationRead(notification);

                            return (
                                <div
                                    key={notification._id}
                                    className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-200 cursor-pointer group ${isRead
                                        ? 'bg-gray-800/30 border-gray-600 opacity-70'
                                        : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/30'
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* User Avatar */}
                                        <div className="relative">
                                            <img
                                                src={notification.userId?.avatar || DEFAULT_AVATAR}
                                                alt={notification.userId?.username}
                                                className={`w-14 h-14 rounded-full border-2 border-yellow-500 bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-yellow-600 transition duration-200${isRead
                                                    ? 'border-gray-500/20'
                                                    : 'border-cyan-500/20 group-hover:border-yellow-600'
                                                    }`}
                                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                                            />
                                            {!isRead && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                                            )}
                                        </div>

                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`font-semibold text-lg ${isRead ? 'text-gray-400' : 'text-white'
                                                    }`}>
                                                    {notification.userId?.username}
                                                </span>
                                                {notification.userId?.role === 'ADMIN' && (
                                                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full text-white font-bold">
                                                        ADMIN
                                                    </span>
                                                )}
                                                {notification.userId?.role === 'MOD' && (
                                                    <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white font-bold">
                                                        MOD
                                                    </span>
                                                )}
                                            </div>

                                            <p className={`text-base mb-3 ${isRead ? 'text-gray-400' : 'text-gray-300'
                                                }`}>
                                                replied to your comment in{' '}
                                                <span className={`font-semibold ${isRead ? 'text-cyan-300' : 'text-cyan-400'
                                                    }`}>
                                                    {notification.appId?.title}
                                                </span>
                                            </p>

                                            <div className={`rounded-lg p-4 border mb-3 ${isRead
                                                ? 'bg-gray-700/30 border-gray-600'
                                                : 'bg-gray-700/50 border-gray-600'
                                                }`}>
                                                <div className={`text-sm leading-relaxed ${isRead ? 'text-gray-300' :
                                                    isImageContent(notification.content) ? 'text-blue-400' : 'text-gray-200'
                                                    }`}>
                                                    {isImageContent(notification.content) ? (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-medium">send an attachment</span>
                                                        </div>
                                                    ) : (
                                                        `"${truncateContent(notification.content)}"`
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm ${isRead ? 'text-gray-500' : 'text-gray-400'
                                                    }`}>
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                <button className={`flex items-center gap-1 text-sm font-medium ${isRead ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-400 hover:text-cyan-300'
                                                    }`}>
                                                    View Details
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mark as Read Button - Only show for unread notifications */}
                                        {!isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(notification._id, e);
                                                }}
                                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700 opacity-0 group-hover:opacity-100"
                                                title="Mark as read"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReplyNotifications;