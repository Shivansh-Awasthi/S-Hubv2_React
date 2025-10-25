import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const AdminCommentsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Pagination and filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [totalUnread, setTotalUnread] = useState(0);
    const [totalRead, setTotalRead] = useState(0);

    // Scroll state
    const [scrollToCommentId, setScrollToCommentId] = useState(null);
    const [commentScrolled, setCommentScrolled] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState('all'); // all, read, unread
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostReplies, pinned
    const [searchTerm, setSearchTerm] = useState('');

    // Handle scroll to comment from navigation state
    useEffect(() => {
        if (location.state?.scrollToComment || location.state?.highlightComment) {
            const commentId = location.state.scrollToComment || location.state.highlightComment;

            setScrollToCommentId(commentId);

            // Clear the state after reading it to prevent repeated scrolling
            window.history.replaceState({ ...location.state, scrollToComment: null, highlightComment: null }, '');
        }
    }, [location.state]);

    // Reset scroll state after scrolling is complete
    const handleCommentScrolled = () => {

        setCommentScrolled(true);
        // Reset after a delay to ensure smooth user experience
        setTimeout(() => {
            setScrollToCommentId(null);
            setCommentScrolled(false);
        }, 1000);
    };

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'MOD')) {
            fetchComments();
        }
    }, [user, currentPage, statusFilter, sortBy, searchTerm]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            const params = {
                page: currentPage,
                limit: 20,
                sortBy,
                status: statusFilter,
                ...(searchTerm && { search: searchTerm })
            };

            const response = await axios.get(
                `${process.env.VITE_API_URL}/api/comments/admin/all`,
                { headers, params }
            );

            setComments(response.data.comments || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalComments(response.data.pagination?.totalComments || 0);
            setTotalUnread(response.data.pagination?.totalUnread || 0);
            setTotalRead(response.data.pagination?.totalRead || 0);
        } catch (err) {
            console.error("Failed to fetch admin comments:", err);
            setError(err.response?.data?.error || 'Failed to load comments');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchComments();
    };

    const handleMarkAsRead = async (commentId) => {
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

            // Update local state
            setComments(prev => prev.map(comment =>
                comment._id === commentId
                    ? { ...comment, adminRead: true }
                    : comment
            ));

            // Update counts
            setTotalUnread(prev => Math.max(0, prev - 1));
            setTotalRead(prev => prev + 1);
        } catch (err) {
            console.error("Failed to mark comment as read:", err);
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
                `${process.env.VITE_API_URL}/api/comments/admin/mark-all-read`,
                {},
                { headers }
            );

            // Update all comments to read
            setComments(prev => prev.map(comment => ({ ...comment, adminRead: true })));
            setTotalRead(totalComments);
            setTotalUnread(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleGoToComment = (comment) => {

        // Ensure we have valid data for navigation
        if (!comment.appId || !comment.appId._id) {
            console.error('Invalid app data for comment:', comment);
            alert('Error: Could not navigate to comment. App data is missing.');
            return;
        }

        // Create a safe slug from the title
        const gameSlug = comment.appId.title
            ? comment.appId.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            : 'game';;

        // Navigate to the game page with scroll state - REMOVED replace: true
        navigate(`/download/mac/${gameSlug}/${comment.appId._id}`, {
            state: {
                scrollToComment: comment._id,
                highlightComment: comment._id,
                fromAdmin: true
            }
            // REMOVED: replace: true
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchComments();
    };

    const handleResetFilters = () => {
        setStatusFilter('all');
        setSortBy('newest');
        setSearchTerm('');
        setCurrentPage(1);
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    const formatFullDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateContent = (content, maxLength = 150) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Check if user is admin/mod
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MOD')) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
                        <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && comments.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-300">Loading comments...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Error Loading Comments</h3>
                            <p className="text-gray-400 mb-4">{error}</p>
                            <button
                                onClick={fetchComments}
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

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm mb-6">
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Comments Management
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    {totalComments} total comments • {totalUnread} unread • {totalRead} read
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

                                {totalUnread > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="md:col-span-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search comments..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="all">All Comments</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="mostReplies">Most Replies</option>
                                <option value="pinned">Pinned First</option>
                            </select>
                        </div>

                        {/* Active Filters */}
                        {(statusFilter !== 'all' || searchTerm || sortBy !== 'newest') && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-400">Active filters:</span>
                                {statusFilter !== 'all' && (
                                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs">
                                        {statusFilter === 'unread' ? 'Unread Only' : 'Read Only'}
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                                        Search: "{searchTerm}"
                                    </span>
                                )}
                                {sortBy !== 'newest' && (
                                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                                        {sortBy === 'oldest' ? 'Oldest First' :
                                            sortBy === 'mostReplies' ? 'Most Replies' : 'Pinned First'}
                                    </span>
                                )}
                                <button
                                    onClick={handleResetFilters}
                                    className="text-gray-400 hover:text-white text-xs underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center backdrop-blur-sm">
                            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Comments Found</h3>
                            <p className="text-gray-400">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'No comments have been posted yet.'}
                            </p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div
                                key={comment._id}
                                className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-200 ${comment.adminRead
                                    ? 'bg-gray-800/30 border-gray-600 opacity-80'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/30'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* User Avatar */}
                                    <div className="relative">
                                        <img
                                            src={comment.userId?.avatar || DEFAULT_AVATAR}
                                            alt={comment.userId?.username}
                                            className={`w-12 h-12 rounded-full border-2 ${comment.adminRead
                                                ? 'border-gray-500/20'
                                                : 'border-cyan-500/20'
                                                }`}
                                            onError={e => (e.target.src = DEFAULT_AVATAR)}
                                        />
                                        {!comment.adminRead && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                                        )}
                                    </div>

                                    {/* Comment Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`font-semibold text-lg ${comment.adminRead ? 'text-gray-400' : 'text-white'
                                                }`}>
                                                {comment.userId?.username}
                                            </span>
                                            {comment.userId?.role === 'ADMIN' && (
                                                <span className="bg-red-500 text-xs px-2 py-1 rounded-full text-white font-bold">
                                                    ADMIN
                                                </span>
                                            )}
                                            {comment.userId?.role === 'MOD' && (
                                                <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white font-bold">
                                                    MOD
                                                </span>
                                            )}
                                        </div>

                                        <p className={`text-base mb-3 ${comment.adminRead ? 'text-gray-400' : 'text-gray-300'
                                            }`}>
                                            {truncateContent(comment.content)}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm mb-3">
                                            <span className={`${comment.adminRead ? 'text-gray-500' : 'text-gray-400'
                                                }`}>
                                                in <span className="font-semibold text-cyan-400">{comment.appId?.title}</span>
                                            </span>
                                            <span className={`${comment.adminRead ? 'text-gray-500' : 'text-gray-400'
                                                }`}>
                                                {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                                            </span>
                                            {comment.isPinned && (
                                                <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs">
                                                    📌 Pinned
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${comment.adminRead ? 'text-gray-500' : 'text-gray-400'
                                                }`}>
                                                {formatTimeAgo(comment.createdAt)} • {formatFullDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleGoToComment(comment)}
                                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 text-sm"
                                        >
                                            View & Reply
                                        </button>

                                        {!comment.adminRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(comment._id)}
                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${currentPage === pageNum
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Loading overlay for pagination */}
                {loading && comments.length > 0 && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-3">
                            <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                            <span className="text-white">Loading comments...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCommentsPage;