import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaRegCommentDots } from "react-icons/fa";
import axios from 'axios';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Set up polling every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const isNotificationRead = (notification) => {
        return notification.isRead ||
            (notification.readBy && notification.readBy.some(read =>
                read.userId && read.userId.toString() === user?.id
            ));
    };

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            // Fetch notifications
            const notificationsResponse = await axios.get(
                `${process.env.VITE_API_URL}/api/comments/notifications`,
                { headers }
            );

            // 🔥 FILTER OUT READ NOTIFICATIONS for the bell dropdown
            const allNotifications = notificationsResponse.data.notifications || [];
            const unreadNotifications = allNotifications.filter(notification => !isNotificationRead(notification));

            setNotifications(unreadNotifications);
            setUnreadCount(unreadNotifications.length);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
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

            // Remove from local state immediately for better UX
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
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

            // Clear all notifications from bell dropdown
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read first
        await handleMarkAsRead(notification._id);

        // Navigate to the correct game URL structure: /download/mac/game-slug/appId
        navigate(`/download/mac/${notification.appId.slug}/${notification.appId._id}`, {
            state: {
                scrollToComment: notification.parentId,
                highlightComment: notification.parentId
            }
        });
        setIsOpen(false);
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

    if (!user) return null;

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaRegCommentDots className="w-8 h-8 text-gray-300" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-gray-800 font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 top-full mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchNotifications}
                                    disabled={loading}
                                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                    title="Refresh"
                                >
                                    <svg
                                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        disabled={loading}
                                        className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {loading ? '...' : 'Read all'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List - Only shows UNREAD notifications */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
                                    Loading notifications...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    No new notifications
                                </div>
                            ) : (
                                notifications.slice(0, 10).map(notification => (
                                    <div
                                        key={notification._id}
                                        className="p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors group"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar with blue dot for unread */}
                                            <div className="relative">
                                                <img
                                                    src={notification.userId?.avatar || DEFAULT_AVATAR}
                                                    alt={notification.userId?.username}
                                                    className="w-10 h-10 rounded-full border-2 border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors"
                                                    onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                />
                                                {/* Blue dot indicator for unread */}
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-white text-sm">
                                                        {notification.userId?.username}
                                                    </span>
                                                    {notification.userId?.role === 'ADMIN' && (
                                                        <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full text-white font-bold">
                                                            ADMIN
                                                        </span>
                                                    )}
                                                    {notification.userId?.role === 'MOD' && (
                                                        <span className="bg-green-500 text-xs px-1.5 py-0.5 rounded-full text-white font-bold">
                                                            MOD
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-300 text-sm mb-1">
                                                    replied to your comment in <span className="font-semibold text-cyan-400">{notification.appId?.title}</span>
                                                </p>

                                                <p className="text-gray-400 text-xs leading-relaxed mb-2">
                                                    {truncateContent(notification.content)}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500 text-xs">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                    <span className="text-cyan-400 text-xs font-medium">
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mark as Read Button */}
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className="p-1 text-gray-400 hover:text-white transition-colors rounded opacity-0 group-hover:opacity-100"
                                                title="Mark as read"
                                                disabled={loading}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer - Show even if there are notifications */}
                        <div className="p-4 border-t border-gray-700 text-center">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                            >
                                {notifications.length > 0 ? 'View all notifications →' : 'Go to notifications page →'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;