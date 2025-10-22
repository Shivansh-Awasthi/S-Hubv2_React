import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaDownload, FaExclamationTriangle, FaUsers, FaExternalLinkAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const STATUS_ORDER = ["pending", "processing", "approved", "rejected"];

const STATUS_META = {
    pending: {
        color: "blue",
        heading: "Pending Requests",
        headingGradient: "bg-gradient-to-r from-blue-400 to-blue-600",
        badge: "bg-blue-500 text-blue-100",
        glow: "shadow-[0_0_24px_0_rgba(59,130,246,0.4)]",
        border: "border-blue-600",
        textColor: "text-blue-400",
        tagColor: "bg-blue-900/30 text-blue-200",
        desc: "Support your favorite games and help them reach our library. Games with 20 or more community votes get priority processing.",
        success: { label: "Success Rate", value: "85%", color: "text-blue-400" },
    },
    processing: {
        color: "yellow",
        heading: "Processing Requests",
        headingGradient: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        badge: "bg-yellow-700 text-yellow-100",
        glow: "shadow-[0_0_24px_0_rgba(234,179,8,0.4)]",
        border: "border-yellow-500",
        textColor: "text-yellow-400",
        tagColor: "bg-yellow-900/30 text-yellow-200",
        desc: "Games that have reached the vote threshold and are being processed by our team.",
        success: { label: "Est. Time", value: "24h", color: "text-yellow-400" },
    },
    approved: {
        color: "green",
        heading: "Approved Requests",
        headingGradient: "bg-gradient-to-r from-green-400 to-green-600",
        badge: "bg-green-700 text-green-100",
        glow: "shadow-[0_0_24px_0_rgba(34,197,94,0.4)]",
        border: "border-green-600",
        textColor: "text-green-400",
        tagColor: "bg-green-900/30 text-green-200",
        desc: "Successfully processed games ready for download. Get them while they are fresh!",
        success: { label: "Success Rate", value: "97%", color: "text-green-400" },
    },
    rejected: {
        color: "red",
        heading: "Rejected Requests",
        headingGradient: "bg-gradient-to-r from-red-400 to-red-600",
        badge: "bg-red-700 text-red-100",
        glow: "shadow-[0_0_24px_0_rgba(239,68,68,0.4)]",
        border: "border-red-600",
        textColor: "text-red-400",
        tagColor: "bg-red-900/30 text-red-200",
        desc: "These requests did not meet our requirements or lacked sufficient community support. They will be automatically removed after 3 days.",
        success: { label: "Auto Removal", value: "7 Days", color: "text-red-400" },
    },
};

function CircularProgressBar({ value, max, color, size = 56, stroke = 6 }) {
    const progress = Math.min((value / max) * 100, 100);
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * (1 - progress / 100);

    // Map color names to actual hex values
    const colorMap = {
        blue: "#3b82f6",
        yellow: "#eab308",
        green: "#22c55e",
        red: "#ef4444"
    };

    const colorHex = colorMap[color] || "#3b82f6";
    const darkColorMap = {
        blue: "#60a5fa",
        yellow: "#facc15",
        green: "#4ade80",
        red: "#f87171"
    };
    const darkColorHex = darkColorMap[color] || "#60a5fa";

    return (
        <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    className="dark:hidden"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth={stroke}
                    className="hidden dark:block"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={colorHex}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                    className="dark:hidden"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={darkColorHex}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                    className="hidden dark:block"
                />
            </svg>
            <span className="absolute text-sm font-bold text-blue-600 dark:text-blue-400">{value}</span>
        </div>
    );
}

function PopupModal({ open, message, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
            <div className="bg-[#232b39] border border-[#2e3748] rounded-2xl shadow-2xl max-w-md w-full p-8 pt-7 relative animate-fadeIn">
                {/* Top blue border */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500" />
                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-[#7b8597] hover:text-blue-400 text-xl focus:outline-none">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col items-center">
                    <div className="bg-[#22335a] rounded-full p-4 mb-4">
                        <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">Daily Vote Used</div>
                    <div className="text-base text-[#b2b9c9] mb-6 text-center">{message}</div>
                    <div className="w-full mb-6">
                        <div className="flex items-center gap-2 bg-[#22335a]/60 border border-blue-700 rounded-xl px-4 py-3">
                            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                            <span className="text-blue-200 text-sm">Your vote helps determine which games get priority processing!</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[#313a4d] text-white rounded-xl font-semibold shadow hover:bg-[#3a4560] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all text-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function SuccessModal({ open, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[110] flex min-h-screen items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] transition-all">
            <div className="relative w-full max-w-sm animate-fadeIn">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-2xl dark:border-gray-700/50 dark:bg-gray-800">
                    {/* Status Bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    {/* Content */}
                    <div className="p-6">
                        {/* Header */}
                        <div className="mb-4 flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Success!</h3>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Support added successfully! Thank you for helping this request reach the processing threshold.</p>
                            </div>
                            {/* Close Button */}
                            <button onClick={onClose} className="shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility: format time ago
function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function RequestCard({ req, status, onVote, voting, isVoted }) {
    const meta = STATUS_META[status];
    const votesNeeded = Math.max(0, 20 - req.votes);
    const percent = Math.round((req.votes / 20) * 100);
    const timeAgo = req.timeAgo || "3 days ago";
    const platform = req.platform || "PC";

    // Get color classes for current status
    const colorClasses = {
        blue: {
            gradient: "from-blue-400 to-blue-600",
            hoverBorder: "from-blue-500/50 via-blue-500/50 to-blue-500/50",
            cardBg: "bg-blue-50/50 dark:bg-blue-900/20",
            buttonGradient: "from-blue-500 to-blue-600",
            text: "text-blue-700 dark:text-blue-300",
            darkText: "text-blue-600 dark:text-blue-400"
        },
        yellow: {
            gradient: "from-yellow-500 to-yellow-600",
            hoverBorder: "from-yellow-500/50 via-yellow-500/50 to-yellow-500/50",
            cardBg: "bg-yellow-50/50 dark:bg-yellow-900/20",
            buttonGradient: "from-yellow-500 to-yellow-600",
            text: "text-yellow-700 dark:text-yellow-300",
            darkText: "text-yellow-600 dark:text-yellow-400"
        },
        green: {
            gradient: "from-green-500 to-green-600",
            hoverBorder: "from-green-500/50 via-green-500/50 to-green-500/50",
            cardBg: "bg-green-50/50 dark:bg-green-900/20",
            buttonGradient: "from-green-500 to-green-600",
            text: "text-green-700 dark:text-green-300",
            darkText: "text-green-600 dark:text-green-400"
        },
        red: {
            gradient: "from-red-500 to-red-600",
            hoverBorder: "from-red-500/50 via-red-500/50 to-red-500/50",
            cardBg: "bg-red-50/50 dark:bg-red-900/20",
            buttonGradient: "from-red-500 to-red-600",
            text: "text-red-700 dark:text-red-300",
            darkText: "text-red-600 dark:text-red-400"
        }
    };

    const colors = colorClasses[meta.color] || colorClasses.blue;

    // Determine which timestamp to use for each status
    let timeAgoFormatted = "";
    if (status === "pending") {
        timeAgoFormatted = formatTimeAgo(req.createdAt);
    } else if (status === "processing" && req.processingAt) {
        timeAgoFormatted = formatTimeAgo(req.processingAt);
    } else if (status === "approved" && req.approvedAt) {
        timeAgoFormatted = formatTimeAgo(req.approvedAt);
    } else if (status === "rejected" && req.rejectedAt) {
        timeAgoFormatted = formatTimeAgo(req.rejectedAt);
    } else {
        // fallback to updatedAt if status-specific timestamp is missing
        timeAgoFormatted = formatTimeAgo(req.updatedAt);
    }

    return (
        <div className="group relative">
            {/* Gradient hover effect border */}
            <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${colors.hoverBorder} opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100`}></div>

            {/* Card Container */}
            <div className="relative h-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)]">
                {/* Top status bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-2xl bg-gradient-to-r ${colors.gradient}`}></div>

                <div className="space-y-4 p-4 pt-6">
                    {/* Header with Title & Status */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-500 dark:text-white dark:group-hover:text-blue-400">
                            {req.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${colors.text} backdrop-blur-sm`}>
                            {status === "pending" && `${req.votes}/20`}
                            {status === "processing" && `${req.votes} votes`}
                            {status === "approved" && "Approved"}
                            {status === "rejected" && "Rejected"}
                        </span>
                    </div>

                    {/* Platform Tag */}
                    <div className="flex justify-center -mt-1 mb-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gray-800/10 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 shadow`}>
                            {platform}
                        </div>
                    </div>

                    {/* Status-specific content */}
                    <div className={`flex items-center gap-3 rounded-xl p-3 pt-0 pb-0 ${colors.cardBg}`}>
                        {status === "pending" && (
                            <>
                                <CircularProgressBar
                                    value={req.votes}
                                    max={20}
                                    color={meta.color}
                                    size={48}
                                    stroke={6}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {votesNeeded === 0 ? "0 votes needed" : `${votesNeeded} votes needed`}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {percent}% complete
                                    </div>
                                </div>
                            </>
                        )}

                        {status === "processing" && (
                            <>
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-900/30">
                                    <FaExclamationTriangle className="text-yellow-400 text-2xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        Status Update
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Quality check in progress
                                    </div>
                                    <div className="text-xs font-bold mt-1 text-yellow-500 dark:text-yellow-400">
                                        {req.votes} votes
                                    </div>
                                </div>
                            </>
                        )}

                        {status === "approved" && (
                            <>
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-900/30">
                                    <FaDownload className="text-green-400 text-2xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        Ready for Download
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Files verified and tested
                                    </div>
                                </div>
                            </>
                        )}

                        {status === "rejected" && (
                            <>
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-900/30">
                                    <FaExclamationTriangle className="text-red-400 text-2xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {req.votes} of 20 votes received
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {req.votes < 20
                                            ? "Insufficient community support"
                                            : "We were unable to process this game "}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* View on Steam */}
                    {req.steamLink && (
                        <a
                            href={req.steamLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center gap-2 rounded-lg bg-gray-100/80 px-3 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-200/80 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50"
                        >
                            <FaExternalLinkAlt className="text-base" />
                            <span className="truncate">View on Steam</span>
                        </a>
                    )}

                    {/* Vote Button */}
                    {status === "pending" && (
                        <button
                            onClick={() => onVote(req._id)}
                            disabled={voting || isVoted}
                            className="group/btn relative w-full"
                        >
                            <div className={`absolute -inset-px rounded-xl bg-gradient-to-r ${colors.hoverBorder} opacity-70 blur-sm transition-opacity duration-300 group-hover/btn:opacity-100`}></div>
                            <div className={`relative flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${colors.buttonGradient} text-sm font-medium text-white shadow-lg ${voting || isVoted ? "opacity-80" : ""}`}>
                                {isVoted ? (
                                    <>
                                        <FaCheck className="mr-1" />
                                        <span className="truncate">Supported</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="truncate">Support Request</span>
                                    </>
                                )}
                            </div>
                        </button>
                    )}

                    {/* Time Info */}
                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {status === "pending" && `Requested ${timeAgoFormatted}`}
                        {status === "processing" && `Started processing ${timeAgoFormatted}`}
                        {status === "approved" && `Approved ${timeAgoFormatted}`}
                        {status === "rejected" && `Rejected ${timeAgoFormatted}`}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NewAccountVoteCard({ daysLeft }) {
    return (
        <div className="group relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-20 blur-lg"></div>
            <div className="relative h-full rounded-2xl border-2 border-blue-400 bg-white/80 dark:bg-blue-900/40 backdrop-blur-xl flex flex-col items-center justify-center p-8 shadow-lg">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800">
                        <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300 text-center">New Account</div>
                    <div className="text-base text-blue-600 dark:text-blue-200 text-center max-w-xs">
                        Your account is too new to vote on requests.<br />
                        You can vote after <span className="font-semibold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>.
                    </div>
                </div>
            </div>
        </div>
    );
}

function NewAccountModal({ open, daysLeft, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
            <div className="bg-[#232b39] border border-[#2e3748] rounded-2xl shadow-2xl max-w-md w-full p-8 pt-7 relative animate-fadeIn flex flex-col items-center">
                {/* Top blue border */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500" />
                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-[#7b8597] hover:text-blue-400 text-xl focus:outline-none">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800">
                        <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 text-center">New Account</div>
                    <div className="text-base text-blue-600 dark:text-blue-200 text-center max-w-xs">
                        Your account is too new to vote on requests.<br />
                        You can vote after <span className="font-semibold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>.
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-8 py-3 bg-[#313a4d] text-white rounded-xl font-semibold shadow hover:bg-[#3a4560] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all text-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default function GameRequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votingId, setVotingId] = useState(null);
    const [voted, setVoted] = useState({});
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [cardsToShow, setCardsToShow] = useState(12);
    const [userId, setUserId] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [pendingVotedId, setPendingVotedId] = useState(null); // Track which card is waiting for success modal
    const [accountTooNew, setAccountTooNew] = useState(false);
    const [daysLeft, setDaysLeft] = useState(7);
    const [newAccountModalOpen, setNewAccountModalOpen] = useState(false);

    // Fetch current user ID from token or API
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                if (!token) return;
                // Try to decode token first
                try {
                    const decoded = jwtDecode(token);
                    if (decoded && (decoded._id || decoded.id)) {
                        setUserId(decoded._id || decoded.id);
                        return;
                    }
                } catch (err) { }
                // Fallback: fetch from API
                try {
                    const res = await fetch(`${process.env.VITE_API_URL}/api/user/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-Auth-Token': process.env.VITE_API_TOKEN,
                            'Content-Type': 'application/json'
                        },
                    });
                    const data = await res.json();
                    if (data && data.user && (data.user._id || data.user.id)) {
                        setUserId(data.user._id || data.user.id);
                    } else {
                        console.warn("User data structure unexpected:", data);
                    }

                } catch (err) { }
            } catch (err) { }
        };
        fetchUserId();
    }, []);


    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError("");
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                const res = await fetch(`${process.env.VITE_API_URL}/api/requests`, {
                    headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN, },
                });
                const data = await res.json();
                if (res.ok) {
                    // Add platforms to the requests (in real app, this would come from backend)
                    const requestsWithPlatforms = data.map(req => ({
                        ...req,
                        platform: req.platform || ["PC", "Mac", "Android", "iOS"][Math.floor(Math.random() * 4)]
                    }));
                    setRequests(requestsWithPlatforms.filter((r) => STATUS_ORDER.includes(r.status)));
                } else {
                    setError(data.error || data.message || "Failed to load requests.");
                }
            } catch (err) {
                setError("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleVote = async (id) => {
        setVotingId(id);
        setError("");
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch(`${process.env.VITE_API_URL}/api/requests/${id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, 'X-Auth-Token': process.env.VITE_API_TOKEN, } : {}),
                },
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setRequests((prev) =>
                    prev.map((r) => (r._id === id ? { ...r, votes: r.votes + 1 } : r))
                );
                setPendingVotedId(id); // Show success modal for this card
                setSuccessModalOpen(true);
                // Don't setVoted yet; wait for modal close
            } else if (res.status === 403 && data.error && data.error.toLowerCase().includes('7 days old')) {
                setDaysLeft(data.daysLeft || 7);
                setNewAccountModalOpen(true);
            } else if (res.status === 429) {
                setModalMessage("Your daily vote is used. Try again tomorrow.");
                setModalOpen(true);
            } else {
                setModalMessage(data.error || data.message || "Failed to vote.");
                setModalOpen(true);
            }
        } catch (err) {
            setModalMessage("An error occurred. Please try again.");
            setModalOpen(true);
        } finally {
            setVotingId(null);
        }
    };

    const grouped = STATUS_ORDER.reduce((acc, status) => {
        acc[status] = requests.filter((r) => r.status === status);
        return acc;
    }, {});


    return (
        <div className="max-w-7xl mx-auto py-10 px-2 md:px-6 bg-[#f8fafc] dark:bg-[#10131a] min-h-screen">
            {/* Show new user card if account is too new */}
            {accountTooNew && (
                <div className="mb-10">
                    <NewAccountVoteCard daysLeft={daysLeft} />
                </div>
            )}
            <NewAccountModal open={newAccountModalOpen} daysLeft={daysLeft} onClose={() => setNewAccountModalOpen(false)} />
            <SuccessModal open={successModalOpen} onClose={() => {
                setSuccessModalOpen(false);
                if (pendingVotedId) {
                    setVoted((prev) => ({ ...prev, [pendingVotedId]: true }));
                    setPendingVotedId(null);
                }
            }} />
            <PopupModal open={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
            {STATUS_ORDER.map((status) => {
                const meta = STATUS_META[status];
                const cards = grouped[status] || [];
                if (!cards.length) return null;
                const showLoadMore = cards.length > cardsToShow;
                return (
                    <section key={status} className="mb-16">
                        {/* Section Heading */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                            <div>
                                <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent ${meta.headingGradient} drop-shadow-lg`}>
                                    {meta.heading}
                                    <span className={`ml-3 px-4 py-1 rounded-full font-bold text-lg ${meta.badge}`}>{cards.length}</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mt-1">{meta.desc}</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white dark:bg-[#181e29] rounded-xl px-6 py-3 border border-gray-200 dark:border-[#232b3a] shadow-sm">
                                <span className={`flex items-center gap-2 font-semibold ${meta.success.color}`}>
                                    {meta.success.label === "Success Rate" ? <FaCheck /> : <FaExclamationTriangle />}
                                    {meta.success.label}
                                </span>
                                <span className={`text-3xl font-extrabold ml-2 ${meta.success.color}`}>{meta.success.value}</span>
                                {meta.success.label === "Est. Time" && <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Last 30 days</span>}
                            </div>
                        </div>
                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cards.slice(0, cardsToShow).map((req) => (
                                <RequestCard
                                    key={req._id}
                                    req={req}
                                    status={status}
                                    onVote={handleVote}
                                    voting={votingId === req._id}
                                    isVoted={!!voted[req._id] || (userId && req.voters && req.voters.some(v => v.user === userId || v.user?._id === userId)) || req.status !== "pending"}
                                />
                            ))}
                        </div>
                        {/* Load More Button */}
                        {showLoadMore && (
                            <div className="flex justify-center mt-10">
                                <button
                                    className={`px-8 py-3 rounded-2xl bg-white dark:bg-[#181e29] border border-gray-300 dark:border-[#232b3a] ${meta.textColor} font-bold text-lg flex items-center gap-2 shadow hover:shadow-lg hover:bg-opacity-80 transition-all`}
                                    onClick={() => setCardsToShow(cardsToShow + 12)}
                                >
                                    Load More {meta.heading.split(" ")[0]}
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}