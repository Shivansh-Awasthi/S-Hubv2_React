import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useParams } from 'react-router-dom';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

const CommentBox = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyPages, setReplyPages] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [submittingEdit, setSubmittingEdit] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [deletingComment, setDeletingComment] = useState(null);
    const [pinningComment, setPinningComment] = useState(null);
    const [blockingUser, setBlockingUser] = useState(null);
    const [showBlockModal, setShowBlockModal] = useState(null);
    const [blockReason, setBlockReason] = useState('');

    // Extract appId from URL
    const getAppIdFromUrl = () => {
        const pathSegments = window.location.pathname.split('/');
        // URL pattern: /download/mac/game-title/appId
        return pathSegments[pathSegments.length - 1]; // Last segment is appId
    };
    const appId = getAppIdFromUrl();

    useEffect(() => {
        fetchComments();
    }, [sortBy]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            const response = await axios.get(
                `${process.env.VITE_API_URL}/api/comments/${appId}?sort=${sortBy}`,
                { headers }
            );

            setComments(response.data.comments || []);

            const initialExpanded = {};
            const initialPages = {};
            response.data.comments?.forEach(comment => {
                initialExpanded[comment._id] = false;
                initialPages[comment._id] = 1;
            });
            setExpandedReplies(initialExpanded);
            setReplyPages(initialPages);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            setError(err.response?.data?.error || 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/${appId}`,
                { content: newComment },
                { headers }
            );

            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error("Failed to post comment:", err);
            setError(err.response?.data?.error || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartReply = (commentId) => {
        setReplyingTo(commentId);
        setReplyContent('');
        setShowMenu(null);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyContent('');
    };

    const handleSubmitReply = async (commentId) => {
        if (!replyContent.trim() || !user) return;

        try {
            setSubmittingReply(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/reply/${commentId}`,
                { content: replyContent },
                { headers }
            );

            setReplyingTo(null);
            setReplyContent('');
            fetchComments();
        } catch (err) {
            console.error("Failed to post reply:", err);
            setError(err.response?.data?.error || 'Failed to post reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleStartEdit = (comment) => {
        setEditingComment(comment._id);
        setEditContent(comment.content);
        setShowMenu(null);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditContent('');
    };

    const handleSubmitEdit = async (commentId) => {
        if (!editContent.trim() || !user) return;

        try {
            setSubmittingEdit(true);
            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.put(
                `${process.env.VITE_API_URL}/api/comments/edit/${commentId}`,
                { content: editContent },
                { headers }
            );

            setEditingComment(null);
            setEditContent('');
            fetchComments();
        } catch (err) {
            console.error("Failed to edit comment:", err);
            setError(err.response?.data?.error || 'Failed to edit comment');
        } finally {
            setSubmittingEdit(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!user) return;

        try {
            setDeletingComment(commentId);

            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.delete(
                `${process.env.VITE_API_URL}/api/comments/${commentId}`,
                { headers }
            );

            setShowMenu(null);
            setDeletingComment(null);
            fetchComments();
        } catch (err) {
            console.error("Failed to delete comment:", err);
            setError(err.response?.data?.error || 'Failed to delete comment');
            setDeletingComment(null);
        }
    };

    const handleAdminDeleteComment = async (commentId) => {
        if (!user) return;

        try {
            setDeletingComment(commentId);

            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.delete(
                `${process.env.VITE_API_URL}/api/comments/admin/${commentId}`,
                { headers }
            );

            setShowMenu(null);
            setDeletingComment(null);
            fetchComments();
        } catch (err) {
            console.error("Failed to delete comment as admin:", err);
            setError(err.response?.data?.error || 'Failed to delete comment as admin');
            setDeletingComment(null);
        }
    };

    const handlePinComment = async (commentId) => {
        if (!user) return;

        try {
            setPinningComment(commentId);

            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/pin/${commentId}`,
                {},
                { headers }
            );

            setShowMenu(null);
            setPinningComment(null);
            fetchComments();
        } catch (err) {
            console.error("Failed to pin/unpin comment:", err);
            setError(err.response?.data?.error || 'Failed to pin/unpin comment');
            setPinningComment(null);
        }
    };

    const handleBlockUser = async (userId, username) => {
        if (!user) return;

        try {
            setBlockingUser(userId);

            const token = localStorage.getItem("token");
            const xAuthToken = process.env.VITE_API_TOKEN;

            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

            await axios.post(
                `${process.env.VITE_API_URL}/api/comments/block/${userId}`,
                { reason: blockReason },
                { headers }
            );

            setShowBlockModal(null);
            setBlockReason('');
            setBlockingUser(null);

            // Show success message
            alert(`User ${username} has been blocked from commenting.`);

            // Refresh comments to reflect any changes
            fetchComments();
        } catch (err) {
            console.error("Failed to block user:", err);
            setError(err.response?.data?.error || 'Failed to block user');
            setBlockingUser(null);
        }
    };

    const openBlockModal = (comment) => {
        setShowBlockModal(comment._id);
        setBlockReason('');
        setShowMenu(null);
    };

    const closeBlockModal = () => {
        setShowBlockModal(null);
        setBlockReason('');
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const loadMoreReplies = (commentId) => {
        setReplyPages(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 1) + 1
        }));
    };

    const toggleMenu = (commentId, e) => {
        if (e) {
            e.stopPropagation();
        }
        setShowMenu(showMenu === commentId ? null : commentId);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate visible replies based on current page
    const getVisibleReplies = (comment) => {
        if (!comment.replies) return [];
        const page = replyPages[comment._id] || 1;
        const limit = 10;
        return comment.replies.slice(0, page * limit);
    };

    const hasMoreReplies = (comment) => {
        if (!comment.replies) return false;
        const page = replyPages[comment._id] || 1;
        const limit = 10;
        return comment.replies.length > page * limit;
    };

    const isCommentOwner = (comment) => {
        return user && comment.userId && user.id === comment.userId._id;
    };

    const isAdminOrMod = () => {
        return user && (user.role === 'ADMIN' || user.role === 'MOD');
    };

    const isAdmin = () => {
        return user && user.role === 'ADMIN';
    };

    const canDeleteComment = (comment) => {
        return isCommentOwner(comment) || isAdminOrMod();
    };

    const canEditComment = (comment) => {
        return isCommentOwner(comment);
    };

    const canBlockUser = (comment) => {
        if (!isAdminOrMod()) return false;

        const targetUser = comment.userId;

        // Cannot block yourself
        if (isCommentOwner(comment)) return false;

        // Mod cannot block Admin
        if (user.role === 'MOD' && targetUser?.role === 'ADMIN') return false;

        // Mod cannot block other Mods (unless you're Admin)
        if (user.role === 'MOD' && targetUser?.role === 'MOD') return false;

        return true;
    };

    if (loading) {
        return (
            <div className="min-h-96 bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading comments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-96 bg-gray-800/50 rounded-xl border border-gray-700 p-8 backdrop-blur-sm">
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
        );
    }

    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Community Comments
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                            {comments.filter(c => c.isPinned).length > 0 && (
                                <span className="text-cyan-400 ml-2">
                                    ({comments.filter(c => c.isPinned).length} pinned)
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Comment Input Form */}
            {user ? (
                <div className="p-6 border-b border-gray-700">
                    <form onSubmit={handleSubmitComment}>
                        <div className="flex items-start gap-4">
                            <img
                                src={user.avatar || DEFAULT_AVATAR}
                                alt="Your avatar"
                                className="mt-4 w-14 h-14 rounded-full border-2 border-pink-700 bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-purple-500 transition duration-200"
                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                            />
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts about this game..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                                    rows="3"
                                    disabled={submitting}
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className={`text-xs ${newComment.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                        {newComment.length}/500
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || submitting || newComment.length > 500}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-6 border-b border-gray-700 text-center">
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <p className="text-gray-300 mb-3">Join the conversation</p>
                        <a
                            href="/login"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Login to Comment
                        </a>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="p-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Comments Yet</h3>
                        <p className="text-gray-400">Be the first to share your thoughts about this game!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map(comment => {
                            const visibleReplies = getVisibleReplies(comment);
                            const showReplies = expandedReplies[comment._id];
                            const isOwner = isCommentOwner(comment);
                            const canEdit = canEditComment(comment);
                            const canDelete = canDeleteComment(comment);
                            const isAdminMod = isAdminOrMod();
                            const canBlock = canBlockUser(comment);

                            return (
                                <div
                                    key={comment._id}
                                    className={`bg-gray-700/30 rounded-lg border ${comment.isPinned
                                        ? 'border-cyan-500/50 bg-cyan-500/10'
                                        : 'border-gray-600'
                                        } p-4 transition-all duration-200`}
                                >
                                    {/* Comment Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={comment.userId?.avatar || DEFAULT_AVATAR}
                                                alt={comment.userId?.username}
                                                className="w-14 h-14 rounded-full border-2 border-indigo-700 bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-purple-500 transition duration-200"
                                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-white text-sm">
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
                                                <span className="text-gray-400 text-xs">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {comment.isPinned && (
                                                <div className="flex items-center gap-1 text-cyan-400 text-sm bg-cyan-500/20 px-2 py-1 rounded-full">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                                    </svg>
                                                    Pinned
                                                </div>
                                            )}

                                            {/* Three-dot menu for comment owner or admin/mod */}
                                            {(canDelete || canBlock) && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => toggleMenu(comment._id, e)}
                                                        className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-600"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                        </svg>
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {showMenu === comment._id && (
                                                        <div
                                                            className="absolute right-0 top-full mt-1 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Edit button - only for comment owner */}
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => handleStartEdit(comment)}
                                                                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                            )}

                                                            {/* Pin/Unpin button - only for admin/mod */}
                                                            {isAdminMod && (
                                                                <button
                                                                    onClick={() => handlePinComment(comment._id)}
                                                                    disabled={pinningComment === comment._id}
                                                                    className={`w-full px-4 py-2 text-sm ${comment.isPinned ? 'text-yellow-400' : 'text-yellow-300'
                                                                        } hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50 ${canEdit ? '' : 'rounded-t-lg'
                                                                        }`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                                                    </svg>
                                                                    {pinningComment === comment._id
                                                                        ? 'Toggling...'
                                                                        : comment.isPinned
                                                                            ? 'Unpin'
                                                                            : 'Pin to Top'
                                                                    }
                                                                </button>
                                                            )}

                                                            {/* Block User button - only for admin/mod with restrictions */}
                                                            {canBlock && (
                                                                <button
                                                                    onClick={() => openBlockModal(comment)}
                                                                    className="w-full px-4 py-2 text-sm text-orange-400 hover:bg-gray-600 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                    </svg>
                                                                    Block User
                                                                </button>
                                                            )}

                                                            {/* Delete button - for both owner and admin/mod */}
                                                            <button
                                                                onClick={() => {
                                                                    const message = isOwner
                                                                        ? 'Are you sure you want to delete your comment?'
                                                                        : 'Are you sure you want to delete this comment as admin/mod?';

                                                                    if (window.confirm(message)) {
                                                                        if (isOwner) {
                                                                            handleDeleteComment(comment._id);
                                                                        } else {
                                                                            handleAdminDeleteComment(comment._id);
                                                                        }
                                                                    }
                                                                }}
                                                                disabled={deletingComment === comment._id}
                                                                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                {deletingComment === comment._id ? 'Deleting...' : 'Delete'}
                                                                {isAdminMod && !isOwner && ' (Admin)'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment Content - Either display or edit form */}
                                    {editingComment === comment._id ? (
                                        <div className="mb-3">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent resize-none text-sm"
                                                rows="3"
                                                disabled={submittingEdit}
                                            />
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`text-xs ${editContent.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {editContent.length}/500
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-xs font-medium hover:bg-gray-500 transition-all duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSubmitEdit(comment._id)}
                                                        disabled={!editContent.trim() || submittingEdit || editContent.length > 500}
                                                        className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded text-xs font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {submittingEdit ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                            {comment.content}
                                        </p>
                                    )}

                                    {/* Comment Actions */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-gray-400">
                                            {/* Reply Button */}
                                            {user && (
                                                <button
                                                    onClick={() => handleStartReply(comment._id)}
                                                    className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                    </svg>
                                                    Reply
                                                </button>
                                            )}

                                            {/* Replies Count with Toggle */}
                                            {comment.repliesCount > 0 && (
                                                <button
                                                    onClick={() => toggleReplies(comment._id)}
                                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                    </svg>
                                                    {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                                                    {showReplies ? ' (Hide)' : ' (Show)'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply Input Form */}
                                    {replyingTo === comment._id && user && (
                                        <div className="mt-4 pl-6 border-l-2 border-cyan-500/20">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={user.avatar || DEFAULT_AVATAR}
                                                    alt="Your avatar"
                                                    className="mt-1 w-12 h-12 rounded-full border-2 border-black bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-purple-500 transition duration-200"
                                                    onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                />
                                                <div className="flex-1">
                                                    <textarea
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder="Write your reply..."
                                                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent resize-none text-sm"
                                                        rows="2"
                                                        disabled={submittingReply}
                                                    />
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className={`text-xs ${replyContent.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                                            {replyContent.length}/500
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={handleCancelReply}
                                                                className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-xs font-medium hover:bg-gray-500 transition-all duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleSubmitReply(comment._id)}
                                                                disabled={!replyContent.trim() || submittingReply || replyContent.length > 500}
                                                                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded text-xs font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {submittingReply ? 'Posting...' : 'Post Reply'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies Section */}
                                    {showReplies && comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-4 pl-6 border-l-2 border-cyan-500/20 space-y-4">
                                            {visibleReplies.map(reply => (
                                                <div key={reply._id} className="bg-gray-600/20 rounded-lg p-3">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <img
                                                            src={reply.userId?.avatar || DEFAULT_AVATAR}
                                                            alt={reply.userId?.username}
                                                            className="w-12 h-12 rounded-full border-2 border-black bg-gray-800 object-cover shadow-lg hover:ring-1 hover:ring-purple-500 transition duration-200"
                                                            onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-white text-xs">
                                                                    {reply.userId?.username}
                                                                </span>
                                                                {reply.userId?.role === 'ADMIN' && (
                                                                    <span className="bg-red-500 text-xs px-1 py-0.5 rounded-full text-white font-bold">
                                                                        ADMIN
                                                                    </span>
                                                                )}
                                                                {reply.userId?.role === 'MOD' && (
                                                                    <span className="bg-green-500 text-xs px-1 py-0.5 rounded-full text-white font-bold">
                                                                        MOD
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-gray-400 text-xs">
                                                                {formatDate(reply.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-xs leading-relaxed">
                                                        {reply.content}
                                                    </p>
                                                </div>
                                            ))}

                                            {/* Load More Replies Button */}
                                            {hasMoreReplies(comment) && (
                                                <div className="text-center">
                                                    <button
                                                        onClick={() => loadMoreReplies(comment._id)}
                                                        className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-500/50 transition-all duration-200"
                                                    >
                                                        Load More Replies ({comment.replies.length - visibleReplies.length} more)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Block User Modal */}
            {showBlockModal && (() => {
                const comment = comments.find(c => c._id === showBlockModal);
                if (!comment) return null;

                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-white mb-2">Block User</h3>
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to block <span className="font-semibold text-white">{comment.userId?.username}</span> from commenting?
                                This will prevent them from posting any comments on any games.
                            </p>

                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm mb-2">
                                    Reason (optional):
                                </label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    placeholder="Enter reason for blocking..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent resize-none"
                                    rows="3"
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={closeBlockModal}
                                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleBlockUser(comment.userId._id, comment.userId.username)}
                                    disabled={blockingUser === comment.userId._id}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
                                >
                                    {blockingUser === comment.userId._id ? 'Blocking...' : 'Block User'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default CommentBox;