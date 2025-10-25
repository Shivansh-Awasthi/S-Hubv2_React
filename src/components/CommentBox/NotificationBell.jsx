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

                    {/* Dropdown Content - UPDATED STYLING */}
                    <div className="absolute top-full right-0 z-50 mt-2 w-96 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 dark:from-indigo-700 dark:to-purple-700">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center font-semibold text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-indigo-600">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={fetchNotifications}
                                        disabled={loading}
                                        className="text-xs text-indigo-100 hover:text-white focus:outline-none"
                                        title="Refresh"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                    </button>

                                    {notifications.length > 0 && (
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            disabled={loading}
                                            className="flex items-center text-xs text-indigo-100 transition-colors hover:text-white focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Read all</span>
                                            {loading && (
                                                <svg className="ml-1 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-1 flex justify-end">
                                <span className="text-xs text-indigo-200 italic">Updated: Just now</span>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
                            {loading ? (
                                <div className="flex justify-center py-6 text-gray-500 dark:text-gray-400">
                                    <svg className="mr-3 -ml-1 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Loading notifications...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    No new notifications
                                </div>
                            ) : (
                                notifications.slice(0, 10).map(notification => (
                                    <div
                                        key={notification._id}
                                        className="group relative transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="block px-4 py-3">
                                            <div className="flex">
                                                {/* Green Icon */}
                                                <div className="shrink-0 mr-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 pr-8">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {notification.userId?.username} replied to your comment in <span className="text-pink-600">{notification.appId?.title}</span>
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                        {truncateContent(notification.content)}
                                                    </p>

                                                    <div className="mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {formatTimeAgo(notification.createdAt)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                                                            View Details
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mark as Read Button */}
                                        <button
                                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                                            className="absolute top-3 right-3 rounded-full bg-gray-100 p-1.5 text-gray-500 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:text-cyan-500 focus:opacity-100 dark:bg-gray-800 dark:hover:text-cyan-400"
                                            title="Mark as read"
                                            disabled={loading}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-center border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="inline-flex items-center text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                View all notifications
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

export default NotificationBell;