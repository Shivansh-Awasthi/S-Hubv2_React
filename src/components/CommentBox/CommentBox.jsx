import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useParams } from 'react-router-dom';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=U&background=random";

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder, disabled, rows = 4, isAdminOrMod = false, maxLength = 2000 }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [textStyle, setTextStyle] = useState('normal');
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleFormat = (format) => {
        const textarea = document.getElementById('rich-text-area');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let newText = '';
        let newSelectionStart = start;
        let newSelectionEnd = end;

        switch (format) {
            case 'bold':
                if (selectedText) {
                    newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
                    newSelectionStart = start + 2;
                    newSelectionEnd = end + 2;
                } else {
                    newText = value + '****';
                    newSelectionStart = value.length + 2;
                    newSelectionEnd = value.length + 2;
                }
                break;

            case 'italic':
                if (selectedText) {
                    newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
                    newSelectionStart = start + 1;
                    newSelectionEnd = end + 1;
                } else {
                    newText = value + '**';
                    newSelectionStart = value.length + 1;
                    newSelectionEnd = value.length + 1;
                }
                break;

            case 'underline':
                if (selectedText) {
                    newText = value.substring(0, start) + `__${selectedText}__` + value.substring(end);
                    newSelectionStart = start + 2;
                    newSelectionEnd = end + 2;
                } else {
                    newText = value + '____';
                    newSelectionStart = value.length + 2;
                    newSelectionEnd = value.length + 2;
                }
                break;

            case 'h1':
                if (selectedText) {
                    // For heading 1, replace the current line with heading
                    const lines = value.split('\n');
                    let currentLineIndex = 0;
                    let currentPos = 0;

                    for (let i = 0; i < lines.length; i++) {
                        if (start >= currentPos && start <= currentPos + lines[i].length) {
                            currentLineIndex = i;
                            break;
                        }
                        currentPos += lines[i].length + 1; // +1 for newline
                    }

                    lines[currentLineIndex] = `# ${selectedText}`;
                    newText = lines.join('\n');
                    newSelectionStart = currentPos + 2 + selectedText.length;
                    newSelectionEnd = newSelectionStart;
                } else {
                    // If no text selected, insert heading on new line
                    const currentLineStart = value.lastIndexOf('\n', start) + 1;
                    const currentLineEnd = value.indexOf('\n', start);
                    const currentLine = value.substring(currentLineStart, currentLineEnd === -1 ? value.length : currentLineEnd);

                    if (currentLine.trim() === '') {
                        // Empty line, just add heading
                        newText = value.substring(0, currentLineStart) + `# ` + value.substring(currentLineStart);
                        newSelectionStart = currentLineStart + 2;
                        newSelectionEnd = newSelectionStart;
                    } else {
                        // Replace current line with heading
                        newText = value.substring(0, currentLineStart) + `# ${currentLine}` + value.substring(currentLineEnd === -1 ? value.length : currentLineEnd);
                        newSelectionStart = currentLineStart + 2 + currentLine.length;
                        newSelectionEnd = newSelectionStart;
                    }
                }
                setTextStyle('normal');
                break;

            case 'h2':
                if (selectedText) {
                    // For heading 2, replace the current line with heading
                    const lines = value.split('\n');
                    let currentLineIndex = 0;
                    let currentPos = 0;

                    for (let i = 0; i < lines.length; i++) {
                        if (start >= currentPos && start <= currentPos + lines[i].length) {
                            currentLineIndex = i;
                            break;
                        }
                        currentPos += lines[i].length + 1; // +1 for newline
                    }

                    lines[currentLineIndex] = `## ${selectedText}`;
                    newText = lines.join('\n');
                    newSelectionStart = currentPos + 3 + selectedText.length;
                    newSelectionEnd = newSelectionStart;
                } else {
                    // If no text selected, insert heading on new line
                    const currentLineStart = value.lastIndexOf('\n', start) + 1;
                    const currentLineEnd = value.indexOf('\n', start);
                    const currentLine = value.substring(currentLineStart, currentLineEnd === -1 ? value.length : currentLineEnd);

                    if (currentLine.trim() === '') {
                        // Empty line, just add heading
                        newText = value.substring(0, currentLineStart) + `## ` + value.substring(currentLineStart);
                        newSelectionStart = currentLineStart + 3;
                        newSelectionEnd = newSelectionStart;
                    } else {
                        // Replace current line with heading
                        newText = value.substring(0, currentLineStart) + `## ${currentLine}` + value.substring(currentLineEnd === -1 ? value.length : currentLineEnd);
                        newSelectionStart = currentLineStart + 3 + currentLine.length;
                        newSelectionEnd = newSelectionStart;
                    }
                }
                setTextStyle('normal');
                break;

            default:
                return;
        }

        onChange(newText);

        // Restore cursor position after state update
        setTimeout(() => {
            const updatedTextarea = document.getElementById('rich-text-area');
            if (updatedTextarea) {
                updatedTextarea.focus();
                updatedTextarea.setSelectionRange(newSelectionStart, newSelectionEnd);
            }
        }, 0);
    };

    const handleInsertImage = () => {
        if (!imageUrl.trim()) return;

        const markdownImage = `![](${imageUrl})`;
        const newText = value + (value ? '\n' : '') + markdownImage + '\n';

        onChange(newText);
        setImageUrl('');
        setShowImageInput(false);
    };

    // Markdown parser to convert markdown to HTML
    const parseMarkdown = (text) => {
        if (!text) return '';

        // Split by lines and process each line
        const lines = text.split('\n');
        let inParagraph = false;
        let html = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Only process headings if user is admin/mod
            if (isAdminOrMod && line.startsWith('# ')) {
                // Close previous paragraph if open
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                html += `<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 pb-2 border-b border-slate-200 dark:border-slate-600">${line.substring(2)}</h1>`;
            } else if (isAdminOrMod && line.startsWith('## ')) {
                // Close previous paragraph if open
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                html += `<h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2">${line.substring(3)}</h2>`;
            } else if (line === '') {
                // Empty line, close paragraph
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
            } else {
                // Regular text line
                if (!inParagraph) {
                    html += '<p class="mb-2 w-full">';
                    inParagraph = true;
                } else {
                    html += '<br>';
                }

                // For non-admin users in preview, escape # at start of line
                let processedLine = line;
                if (!isAdminOrMod) {
                    // If line starts with # but we're not processing as heading, ensure # is visible
                    if (line.startsWith('# ')) {
                        processedLine = '#' + processedLine.substring(1);
                    } else if (line.startsWith('## ')) {
                        processedLine = '##' + processedLine.substring(2);
                    }
                }

                // Process inline formatting (available for all users)
                processedLine = processedLine
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
                    .replace(/!\[\]\((.*?)\)/g, '<div class="my-2 relative inline-block"><img src="$1" alt="User uploaded image" class="max-w-[200px] max-h-[150px] rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm object-cover mr-4" loading="lazy" onerror="this.style.display=\'none\'" data-src="$1"><div class="absolute bottom-1 right-4 rounded-full p-1 transition-all duration-200 cursor-pointer" onclick="window.reactExpandImage && window.reactExpandImage(\'$1\')"><svg class="w-5 h-5 text-white" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21L21 3M3 21H9M3 21L3 15M21 3H15M21 3V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>');

                html += processedLine;
            }
        }

        // Close final paragraph if still open
        if (inParagraph) {
            html += '</p>';
        }

        return html;
    };

    const previewHTML = parseMarkdown(value);

    const handleTextStyleChange = (style) => {
        setTextStyle(style);
        if (style === 'h1' || style === 'h2') {
            handleFormat(style);
        }
    };

    const characterCount = value.length;
    const isOverLimit = !isAdminOrMod && characterCount > maxLength;

    return (
        <div className={`rich-text-editor border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}>
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-t-lg">
                {/* Text Style Dropdown for Admin/Mod */}
                {isAdminOrMod && (
                    <div className="flex items-center gap-2 mr-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Style:</span>
                        <select
                            value={textStyle}
                            onChange={(e) => handleTextStyleChange(e.target.value)}
                            className="bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded px-2 py-1 text-sm text-white dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => handleFormat('bold')}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Bold (Ctrl+B)"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h16M3 12h16m-7 6h7" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => handleFormat('italic')}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Italic (Ctrl+I)"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => handleFormat('underline')}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Underline (Ctrl+U)"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4a7 7 0 1014 0V3M4 21h16" />
                    </svg>
                </button>

                {/* Image Button */}
                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Insert Image"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                <div className="flex-1"></div>
            </div>

            {/* Image Input Form */}
            {showImageInput && (
                <div className="border-b border-slate-200 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Paste image URL"
                                className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowImageInput(false)}
                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInsertImage}
                                disabled={!imageUrl.trim()}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Insert Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Text Input Area */}
            <div className="relative">
                <textarea
                    id="rich-text-area"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className="w-full bg-transparent border-0 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 resize-none whitespace-pre-wrap"
                    maxLength={isAdminOrMod ? undefined : maxLength}
                />
            </div>

            {/* Character Count and Live Preview */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Preview:</div>
                    <div className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-slate-500'}`}>
                        {characterCount}
                        {!isAdminOrMod && ` / ${maxLength}`}
                        {isAdminOrMod && ' characters (no limit)'}
                    </div>
                </div>
                {value && (
                    <div
                        className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 dark:prose-invert prose-headings:mt-4 prose-headings:mb-2 prose-p:leading-relaxed flex flex-wrap gap-2"
                        dangerouslySetInnerHTML={{ __html: previewHTML }}
                    />
                )}
            </div>
        </div>
    );
};

// Component to render formatted content with image expand functionality
const FormattedContent = ({ content, className = "", userRole = null }) => {
    const [expandedImage, setExpandedImage] = useState(null);

    const parseMarkdown = (text) => {
        if (!text) return '';

        // Split by lines and process each line
        const lines = text.split('\n');
        let inParagraph = false;
        let html = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Only process headings if user is admin/mod
            const isAdminOrMod = userRole === 'ADMIN' || userRole === 'MOD';

            if (isAdminOrMod && line.startsWith('# ')) {
                // Close previous paragraph if open
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                html += `<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-3 pb-2 border-b border-slate-200 dark:border-slate-600">${line.substring(2)}</h1>`;
            } else if (isAdminOrMod && line.startsWith('## ')) {
                // Close previous paragraph if open
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
                html += `<h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2">${line.substring(3)}</h2>`;
            } else if (line === '') {
                // Empty line, close paragraph
                if (inParagraph) {
                    html += '</p>';
                    inParagraph = false;
                }
            } else {
                // Regular text line
                if (!inParagraph) {
                    html += '<p class="mb-2 leading-relaxed w-full">';
                    inParagraph = true;
                } else {
                    html += '<br>';
                }

                // For non-admin users, escape # at start of line to prevent heading behavior
                let processedLine = line;
                if (!isAdminOrMod) {
                    // If line starts with # but we're not processing as heading, ensure # is visible
                    if (line.startsWith('# ')) {
                        processedLine = '#' + processedLine.substring(1);
                    } else if (line.startsWith('## ')) {
                        processedLine = '##' + processedLine.substring(2);
                    }
                }

                // Process inline formatting (available for all users)
                processedLine = processedLine
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
                    .replace(/!\[\]\((.*?)\)/g, '<div class="my-2 relative inline-block"><img src="$1" alt="User uploaded image" class="max-w-[200px] max-h-[150px] rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm object-cover mr-4" loading="lazy" onerror="this.style.display=\'none\'" data-src="$1"><div class="absolute bottom-1 right-4 rounded-full p-1 transition-all duration-200 cursor-pointer" onclick="window.reactExpandImage && window.reactExpandImage(\'$1\')"><svg class="w-5 h-5 text-white" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21L21 3M3 21H9M3 21L3 15M21 3H15M21 3V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>');

                html += processedLine;
            }
        }

        // Close final paragraph if still open
        if (inParagraph) {
            html += '</p>';
        }

        return html;
    };

    // Set up global function for image expansion
    useEffect(() => {
        window.reactExpandImage = (src) => {
            setExpandedImage(src);
        };

        return () => {
            window.reactExpandImage = null;
        };
    }, []);

    const htmlContent = parseMarkdown(content);

    return (
        <>
            <div
                className={`prose prose-sm max-w-none text-slate-800 dark:text-slate-200 dark:prose-invert leading-relaxed prose-headings:mt-4 prose-headings:mb-2 prose-p:leading-relaxed flex flex-wrap gap-2 ${className}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Expanded Image Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 cursor-zoom-out"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={expandedImage}
                            alt="Expanded view"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setExpandedImage(null)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            Click anywhere to close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Rest of the CommentBox component remains exactly the same...
const CommentBox = ({ scrollToCommentId, onCommentScrolled }) => {
    const { user } = useAuth();
    const { id: urlId } = useParams();
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

    const getAppId = () => {
        if (urlId) return urlId;
        const pathSegments = window.location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment && /^[0-9a-fA-F]{24}$/.test(lastSegment)) {
            return lastSegment;
        }
        if (pathSegments.length >= 2) {
            const secondLastSegment = pathSegments[pathSegments.length - 2];
            if (secondLastSegment && /^[0-9a-fA-F]{24}$/.test(secondLastSegment)) {
                return secondLastSegment;
            }
        }
        console.warn('Could not extract appId from URL. Current path:', window.location.pathname);
        return null;
    };

    const appId = getAppId();

    useEffect(() => {
        if (appId) {
            fetchComments();
        } else {
            setError('Could not load comments: Invalid app ID');
            setLoading(false);
        }
    }, [sortBy, appId]);

    useEffect(() => {
        if (scrollToCommentId && comments.length > 0) {
            console.log('Scroll requested to comment:', scrollToCommentId);
            attemptScroll(scrollToCommentId, 0);
        }
    }, [scrollToCommentId, comments]);

    const attemptScroll = (commentId, attemptCount = 0) => {
        if (attemptCount > 3) {
            console.warn('Failed to scroll to comment after 3 attempts:', commentId);
            if (onCommentScrolled) onCommentScrolled();
            return;
        }

        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                element.classList.add('comment-highlight');
                setTimeout(() => {
                    element.classList.remove('comment-highlight');
                }, 5000);
                if (onCommentScrolled) {
                    onCommentScrolled();
                }
            }, 3000);
        } else {
            setTimeout(() => {
                attemptScroll(commentId, attemptCount + 1);
            }, 700);
        }
    };

    const fetchComments = async () => {
        if (!appId) {
            console.error('Cannot fetch comments: appId is null');
            setError('Invalid app ID');
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

        // Check character limit for non-admin users
        if (!isAdminOrMod() && newComment.length > 2000) {
            setError('Comment exceeds 500 character limit');
            return;
        }

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
            setError(null);
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

        // Check character limit for non-admin users
        if (!isAdminOrMod() && replyContent.length > 2000) {
            setError('Reply exceeds 500 character limit');
            return;
        }

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
            setError(null);
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

        // Check character limit for non-admin users
        if (!isAdminOrMod() && editContent.length > 2000) {
            setError('Comment exceeds 500 character limit');
            return;
        }

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
            setError(null);
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
            alert(`User ${username} has been blocked from commenting.`);
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
        if (isCommentOwner(comment)) return false;
        if (user.role === 'MOD' && targetUser?.role === 'ADMIN') return false;
        if (user.role === 'MOD' && targetUser?.role === 'MOD') return false;
        return true;
    };

    const highlightStyles = `
        .comment-highlight {
            animation: highlight-pulse 3s ease-in-out;
            border-radius: 8px;
        }
        
        @keyframes highlight-pulse {
            0% {
                background-color: rgba(59, 130, 246, 0.1);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            50% {
                background-color: rgba(59, 130, 246, 0.3);
                box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
                background-color: rgba(59, 130, 246, 0.1);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
        }

        .rich-text-editor .prose strong {
            font-weight: 600;
            color: inherit;
        }

        .rich-text-editor .prose em {
            font-style: italic;
            color: inherit;
        }

        .rich-text-editor .prose u {
            text-decoration: underline;
            color: inherit;
        }

        .rich-text-editor .prose h1 {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 1em;
            margin-bottom: 0.75em;
            color: inherit;
        }

        .rich-text-editor .prose h2 {
            font-size: 1.25em;
            font-weight: 600;
            margin-top: 0.75em;
            margin-bottom: 0.5em;
            color: inherit;
        }

        .cursor-zoom-in {
            cursor: zoom-in;
        }

        .cursor-zoom-out {
            cursor: zoom-out;
        }
    `;

    if (loading) {
        return (
            <div className="lakm_commenter w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-center py-12 space-x-3">
                    <svg className="animate-spin h-4 w-4 text-blue-600 !size-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="status" aria-label="loading">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading comments...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lakm_commenter w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Error Loading Comments</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                    <button
                        onClick={fetchComments}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{highlightStyles}</style>
            <div className="lakm_commenter w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="relative border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50">
                    <div className="px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            Discussion
                                        </h2>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                                {comments.length}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {comments.length === 1 ? 'comment' : 'comments'}
                                            </span>
                                            {comments.filter(c => c.isPinned).length > 0 && (
                                                <span className="text-blue-600 dark:text-blue-400 text-sm">
                                                    ({comments.filter(c => c.isPinned).length} pinned)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>
                                </div>

                                {user && (
                                    <a
                                        href="#create-comment-form"
                                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                        Write comment
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="relative">
                    {comments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Comments Yet</h3>
                            <p className="text-slate-600 dark:text-slate-400">Be the first to share your thoughts about this game!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {comments.map(comment => {
                                const visibleReplies = getVisibleReplies(comment);
                                const showReplies = expandedReplies[comment._id];
                                const isOwner = isCommentOwner(comment);
                                const canEdit = canEditComment(comment);
                                const canDelete = canDeleteComment(comment);
                                const isAdminMod = isAdminOrMod();
                                const canBlock = canBlockUser(comment);

                                return (
                                    <div key={comment._id} id={`comment-${comment._id}`} className="relative group">
                                        {/* Timeline */}
                                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors duration-300"></div>
                                        <div className="absolute left-6 top-6 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 rounded-full transition-colors duration-300 z-10">
                                            <div className="absolute inset-1 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 rounded-full transition-colors duration-300"></div>
                                        </div>
                                        <div className="absolute left-8 top-7 w-6 h-0.5 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors duration-300"></div>

                                        <div className="relative pl-20 pr-6 lg:pr-8 py-6">
                                            {/* Comment Header */}
                                            <div className="flex space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={comment.userId?.avatar || DEFAULT_AVATAR}
                                                        alt={comment.userId?.username}
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-blue-400 dark:group-hover:ring-blue-500 transition-all duration-200"
                                                        onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center space-x-3 min-w-0">
                                                            <div className="flex items-center space-x-2 min-w-0">

                                                                <h4 className="font-semibold text-slate-900 dark:text-slate-100  truncate">
                                                                    {comment.userId?.username}
                                                                </h4>
                                                                {comment.userId?.role === 'ADMIN' && (
                                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                                                        ADMIN
                                                                    </span>
                                                                )}
                                                                {comment.userId?.role === 'MOD' && (
                                                                    <span className="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                                                                        MOD
                                                                    </span>
                                                                )}
                                                                {comment.userId?.role === 'PREMIUM' && (
                                                                    <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-500">
                                                                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                                                                            <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                                                                        </svg>
                                                                        <span class="sr-only">Icon description</span>
                                                                    </span>
                                                                )}
                                                                {comment.isPinned && (
                                                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                                                        </svg>
                                                                        Pinned
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                                                                <time className="hover:text-slate-700 dark:hover:text-slate-300 cursor-help transition-colors whitespace-nowrap">
                                                                    {formatDate(comment.createdAt)}
                                                                </time>
                                                            </div>
                                                        </div>

                                                        {/* Three-dot menu */}
                                                        {(canDelete || canBlock) && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => toggleMenu(comment._id, e)}
                                                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </button>

                                                                {showMenu === comment._id && (
                                                                    <div
                                                                        className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {canEdit && (
                                                                            <button
                                                                                onClick={() => handleStartEdit(comment)}
                                                                                className="w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Edit
                                                                            </button>
                                                                        )}

                                                                        {isAdminMod && (
                                                                            <button
                                                                                onClick={() => handlePinComment(comment._id)}
                                                                                disabled={pinningComment === comment._id}
                                                                                className={`w-full px-4 py-2 text-sm ${comment.isPinned ? 'text-yellow-600' : 'text-yellow-600'} hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 ${canEdit ? '' : 'rounded-t-lg'}`}
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

                                                                        {canBlock && (
                                                                            <button
                                                                                onClick={() => openBlockModal(comment)}
                                                                                className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                                </svg>
                                                                                Block User
                                                                            </button>
                                                                        )}

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
                                                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-lg flex items-center gap-2 disabled:opacity-50"
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

                                                    {/* Comment Content */}
                                                    {editingComment === comment._id ? (
                                                        <div className="mb-4">
                                                            <RichTextEditor
                                                                value={editContent}
                                                                onChange={setEditContent}
                                                                placeholder="Edit your comment..."
                                                                disabled={submittingEdit}
                                                                rows={3}
                                                                isAdminOrMod={isAdminMod}
                                                                maxLength={2000}
                                                            />
                                                            <div className="flex items-center justify-between mt-2">
                                                                <div className={`text-xs ${!isAdminMod && editContent.length > 2000 ? 'text-red-500' : 'text-slate-500'}`}>
                                                                    {editContent.length}
                                                                    {!isAdminMod && ` / 2000`}
                                                                    {isAdminMod && ' characters (no limit)'}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSubmitEdit(comment._id)}
                                                                        disabled={!editContent.trim() || submittingEdit || (!isAdminMod && editContent.length > 2000)}
                                                                        className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {submittingEdit ? 'Saving...' : 'Save'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-4">
                                                            <FormattedContent
                                                                content={comment.content}
                                                                userRole={comment.userId?.role}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Comment Actions */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                                            {user && (
                                                                <button
                                                                    onClick={() => handleStartReply(comment._id)}
                                                                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                                    </svg>
                                                                    Reply
                                                                </button>
                                                            )}

                                                            {comment.repliesCount > 0 && (
                                                                <button
                                                                    onClick={() => toggleReplies(comment._id)}
                                                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
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
                                                        <div className="mt-4 ml-14 relative">
                                                            {/* Timeline for reply form */}
                                                            <div className="absolute -left-7 top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-700 dark:to-transparent"></div>
                                                            <div className="absolute -left-7 top-4 w-4 h-px bg-slate-300 dark:bg-slate-600"></div>

                                                            <div className="bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                                <div className="p-4">
                                                                    <div className="flex space-x-3">
                                                                        <div className="flex-shrink-0">
                                                                            <img
                                                                                src={user.avatar || DEFAULT_AVATAR}
                                                                                alt="Your avatar"
                                                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600"
                                                                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <RichTextEditor
                                                                                value={replyContent}
                                                                                onChange={setReplyContent}
                                                                                placeholder="Write your reply..."
                                                                                disabled={submittingReply}
                                                                                rows={2}
                                                                                isAdminOrMod={isAdminMod}
                                                                                maxLength={2000}
                                                                            />
                                                                            <div className="flex items-center justify-between mt-2">
                                                                                <div className={`text-xs ${!isAdminMod && replyContent.length > 2000 ? 'text-red-500' : 'text-slate-500'}`}>
                                                                                    {replyContent.length}
                                                                                    {!isAdminMod && ` / 2000`}
                                                                                    {isAdminMod && ' characters (no limit)'}
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <button
                                                                                        onClick={handleCancelReply}
                                                                                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleSubmitReply(comment._id)}
                                                                                        disabled={!replyContent.trim() || submittingReply || (!isAdminMod && replyContent.length > 2000)}
                                                                                        className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    >
                                                                                        {submittingReply ? 'Posting...' : 'Post Reply'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Replies Section */}
                                                    {showReplies && comment.replies && comment.replies.length > 0 && (
                                                        <div className="mt-4 ml-14 relative">
                                                            {/* Main timeline for replies container */}
                                                            <div className="absolute -left-7 top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-700 dark:to-transparent"></div>
                                                            <div className="absolute -left-7 top-4 w-4 h-px bg-slate-300 dark:bg-slate-600"></div>

                                                            <div className="bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                                <div className="p-4">
                                                                    <div className="space-y-4">
                                                                        {visibleReplies.map(reply => {
                                                                            const isReplyOwner = isCommentOwner(reply);
                                                                            const canEditReply = canEditComment(reply);
                                                                            const canDeleteReply = canDeleteComment(reply);
                                                                            const canBlockReply = canBlockUser(reply);

                                                                            return (
                                                                                <div key={reply._id} className="relative py-4 transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                                                    {/* Individual reply timeline elements */}
                                                                                    <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-600"></div>
                                                                                    <div className="absolute -left-4 top-6 w-3 h-px bg-slate-300 dark:bg-slate-600"></div>
                                                                                    <div className="absolute -left-5 top-5 w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>

                                                                                    <div className="flex space-x-3">
                                                                                        <div className="flex-shrink-0">
                                                                                            <img
                                                                                                src={reply.userId?.avatar || DEFAULT_AVATAR}
                                                                                                alt={reply.userId?.username}
                                                                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-blue-400 dark:group-hover:ring-blue-500 transition-all duration-200"
                                                                                                onError={e => (e.target.src = DEFAULT_AVATAR)}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="flex items-start justify-between mb-2">
                                                                                                <div className="flex items-center space-x-3 min-w-0">
                                                                                                    <div className="flex items-center space-x-2 min-w-0">
                                                                                                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                                                                            {reply.userId?.username}
                                                                                                        </h5>
                                                                                                        {reply.userId?.role === 'ADMIN' && (
                                                                                                            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">ADMIN</span>
                                                                                                        )}
                                                                                                        {reply.userId?.role === 'MOD' && (
                                                                                                            <span class="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">MOD</span>
                                                                                                        )}
                                                                                                        {reply.userId?.role === 'PREMIUM' && (
                                                                                                            <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-500"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"></path><path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"></path></svg><span class="sr-only">Icon description</span></span>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                                                                                                        <time className="hover:text-slate-700 dark:hover:text-slate-300 cursor-help transition-colors whitespace-nowrap">
                                                                                                            {formatDate(reply.createdAt)}
                                                                                                        </time>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Three-dot menu for reply */}
                                                                                                {(canDeleteReply || canBlockReply) && (
                                                                                                    <div className="relative">
                                                                                                        <button
                                                                                                            onClick={(e) => toggleMenu(reply._id, e)}
                                                                                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                                                                                        >
                                                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                                                            </svg>
                                                                                                        </button>

                                                                                                        {showMenu === reply._id && (
                                                                                                            <div
                                                                                                                className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10"
                                                                                                                onClick={(e) => e.stopPropagation()}
                                                                                                            >
                                                                                                                {canEditReply && (
                                                                                                                    <button
                                                                                                                        onClick={() => handleStartEdit(reply)}
                                                                                                                        className="w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2"
                                                                                                                    >
                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                                                        </svg>
                                                                                                                        Edit
                                                                                                                    </button>
                                                                                                                )}

                                                                                                                {canBlockReply && (
                                                                                                                    <button
                                                                                                                        onClick={() => openBlockModal(reply)}
                                                                                                                        className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                                                                                    >
                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                                                                        </svg>
                                                                                                                        Block User
                                                                                                                    </button>
                                                                                                                )}

                                                                                                                <button
                                                                                                                    onClick={() => {
                                                                                                                        const message = isReplyOwner
                                                                                                                            ? 'Are you sure you want to delete your reply?'
                                                                                                                            : 'Are you sure you want to delete this reply as admin/mod?';
                                                                                                                        if (window.confirm(message)) {
                                                                                                                            if (isReplyOwner) {
                                                                                                                                handleDeleteComment(reply._id);
                                                                                                                            } else {
                                                                                                                                handleAdminDeleteComment(reply._id);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    disabled={deletingComment === reply._id}
                                                                                                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-lg flex items-center gap-2 disabled:opacity-50"
                                                                                                                >
                                                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                                                    </svg>
                                                                                                                    {deletingComment === reply._id ? 'Deleting...' : 'Delete'}
                                                                                                                    {isAdminMod && !isReplyOwner && ' (Admin)'}
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>

                                                                                            {/* Reply Content */}
                                                                                            {editingComment === reply._id ? (
                                                                                                <div className="mb-4">
                                                                                                    <RichTextEditor
                                                                                                        value={editContent}
                                                                                                        onChange={setEditContent}
                                                                                                        placeholder="Edit your reply..."
                                                                                                        disabled={submittingEdit}
                                                                                                        rows={2}
                                                                                                        isAdminOrMod={isAdminMod}
                                                                                                        maxLength={2000}
                                                                                                    />
                                                                                                    <div className="flex items-center justify-between mt-2">
                                                                                                        <div className={`text-xs ${!isAdminMod && editContent.length > 2000 ? 'text-red-500' : 'text-slate-500'}`}>
                                                                                                            {editContent.length}
                                                                                                            {!isAdminMod && ` / 2000`}
                                                                                                            {isAdminMod && ' characters (no limit)'}
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-2">
                                                                                                            <button
                                                                                                                onClick={handleCancelEdit}
                                                                                                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                                                                                                            >
                                                                                                                Cancel
                                                                                                            </button>
                                                                                                            <button
                                                                                                                onClick={() => handleSubmitEdit(reply._id)}
                                                                                                                disabled={!editContent.trim() || submittingEdit || (!isAdminMod && editContent.length > 2000)}
                                                                                                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                                            >
                                                                                                                {submittingEdit ? 'Saving...' : 'Save'}
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="mb-3">
                                                                                                    <FormattedContent
                                                                                                        content={reply.content}
                                                                                                        userRole={reply.userId?.role}
                                                                                                    />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>

                                                                    {/* Load More Replies Button */}
                                                                    {hasMoreReplies(comment) && (
                                                                        <div className="text-center mt-4">
                                                                            <button
                                                                                onClick={() => loadMoreReplies(comment._id)}
                                                                                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                                                                            >
                                                                                Load More Replies ({comment.replies.length - visibleReplies.length} more)
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Comment Input Form */}
                <div id="create-comment-form" className="border-t border-slate-200 dark:border-slate-700">
                    {user ? (
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Join the discussion</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Share your thoughts with rich text formatting
                                            {isAdminOrMod() && " - Unlimited characters for admin/mod"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmitComment}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Your comment <span className="text-red-500">*</span>
                                        </label>
                                        <RichTextEditor
                                            value={newComment}
                                            onChange={setNewComment}
                                            placeholder="Your message here.."
                                            disabled={submitting}
                                            rows={4}
                                            isAdminOrMod={isAdminOrMod()}
                                            maxLength={2000}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Ready to share your thoughts?
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || submitting || (!isAdminOrMod() && newComment.length > 2000)}
                                            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Posting...
                                                </>
                                            ) : (
                                                'Post Comment'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-600 dark:text-slate-400 mb-3">Join the conversation</p>
                                <a
                                    href="/login"
                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login to Comment
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Block User Modal */}
                {showBlockModal && (() => {
                    const comment = comments.find(c => c._id === showBlockModal) ||
                        comments.flatMap(c => c.replies || []).find(r => r._id === showBlockModal);
                    if (!comment) return null;

                    return (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Block User</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Are you sure you want to block <span className="font-semibold text-slate-900 dark:text-slate-100">{comment.userId?.username}</span> from commenting?
                                    This will prevent them from posting any comments on any games.
                                </p>

                                <div className="mb-4">
                                    <label className="block text-slate-700 dark:text-slate-300 text-sm mb-2">
                                        Reason (optional):
                                    </label>
                                    <textarea
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                        placeholder="Enter reason for blocking..."
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeBlockModal}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleBlockUser(comment.userId._id, comment.userId.username)}
                                        disabled={blockingUser === comment.userId._id}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {blockingUser === comment.userId._id ? 'Blocking...' : 'Block User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </>
    );
};

export default CommentBox;