import { useState, useEffect } from "react";
import { FaHeart, FaPlus, FaClock, FaCog, FaTimesCircle, FaSteam, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaGamepad, FaVoteYea, FaBolt } from 'react-icons/fa';

// PopupModal: Modern, reusable modal for error/info messages
function PopupModal({ open, message, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
            <div className="bg-[#232b39] border border-[#2e3748] rounded-2xl shadow-2xl max-w-md w-full p-8 pt-7 relative animate-fadeIn">
                {/* Top blue border */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-red-500 to-red-500" />
                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-[#7b8597] hover:text-blue-400 text-xl focus:outline-none">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col items-center">
                    <div className="bg-[#22335a] rounded-full p-4 mb-4">
                        <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">Error</div>
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

// NewAccountModal: Dedicated modal for new accounts (7-day restriction)
function NewAccountModal({ open, daysLeft, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
            <div className="bg-[#232b39] border border-[#2e3748] rounded-2xl shadow-2xl max-w-md w-full p-8 pt-7 relative animate-fadeIn">
                {/* Top blue border */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-500" />
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
                    <div className="text-2xl font-bold text-white mb-2">New Account Restriction</div>
                    <div className="text-base text-[#b2b9c9] mb-6 text-center">
                        Your account is too new to submit a game request.<br />
                        Accounts must be at least <span className="font-semibold text-blue-400">7 days old</span> to request or vote for games.<br />
                        {daysLeft > 0 && (
                            <span className="block mt-2 text-blue-300">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left until you can request.</span>
                        )}
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

function formatTimeLeft(dateString) {
    if (!dateString) return "";
    const now = new Date();
    const target = new Date(dateString);
    const diff = target - now;
    if (diff <= 0) return "Now";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} left`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
    return "Less than a minute left";
}

export default function GameRequestForm() {
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [steamLink, setSteamLink] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [requestLimit, setRequestLimit] = useState(1); // 1 per week
    const [nextRequestAvailable, setNextRequestAvailable] = useState(null);
    const [limitLoading, setLimitLoading] = useState(true);
    const [showDenuvoModal, setShowDenuvoModal] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [showNewAccountModal, setShowNewAccountModal] = useState(false);
    const [newAccountDaysLeft, setNewAccountDaysLeft] = useState(0);

    const stages = [
        {
            title: "Pending",
            icon: <FaClock className="text-2xl" />,
            color: "bg-blue-500",
            hoverColor: "hover:shadow-blue-500",
            points: ["Need 20 votes", "Within 7 days"]
        },
        {
            title: "Processing",
            icon: <FaCog className="text-2xl" />,
            color: "bg-yellow-500",
            hoverColor: "hover:shadow-yellow-500",
            points: ["Quality check", "~7days processing time"]
        },
        {
            title: "Approved",
            icon: <FaCheckCircle className="text-2xl" />,
            color: "bg-green-500",
            hoverColor: "hover:shadow-green-500",
            points: ["Ready for download", "Files verified"]
        },
        {
            title: "Rejected",
            icon: <FaTimesCircle className="text-2xl" />,
            color: "bg-red-500",
            hoverColor: "hover:shadow-red-500",
            points: ["Less than 20 votes", "Removed in 7 days"]
        }
    ];

    useEffect(() => {
        // Check if user has a request left this week
        async function fetchRequestLimit() {
            setLimitLoading(true);
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                if (!token) {
                    setRequestLimit(1);
                    setNextRequestAvailable(null);
                    setLimitLoading(false);
                    return;
                }
                // Try to submit a dummy request to get the 429 info (not ideal, but backend has no dedicated endpoint)
                // Instead, try to POST a dummy request and check for 429
                const dummyRes = await fetch(`${process.env.VITE_API_URL}/api/requests`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Auth-Token': process.env.VITE_API_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: "dummy", platform: "PC", steamLink: "https://store.steampowered.com/app/1/Dummy/" }),
                });
                if (dummyRes.status === 429) {
                    const dummyData = await dummyRes.json();
                    setRequestLimit(0);
                    setNextRequestAvailable(dummyData.nextRequestAvailable || null);
                } else {
                    setRequestLimit(1);
                    setNextRequestAvailable(null);
                }
            } catch (err) {
                setRequestLimit(1);
                setNextRequestAvailable(null);
            } finally {
                setLimitLoading(false);
            }
        }
        fetchRequestLimit();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validate Steam link
        if (steamLink && !/^https?:\/\/(store\.)?steampowered\.com\//.test(steamLink)) {
            setModalMessage("Invalid Steam link. Please provide a valid Steam store URL.");
            setModalOpen(true);
            setLoading(false);
            return;
        }

        // Validate platform selection
        if (!platform) {
            setModalMessage("Please select a platform (PC or Mac)");
            setModalOpen(true);
            setLoading(false);
            return;
        }

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch(`${process.env.VITE_API_URL}/api/requests`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Auth-Token': process.env.VITE_API_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, platform, steamLink }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setMessage("Request submitted successfully!");
                setTitle("");
                setPlatform("");
                setSteamLink("");
                setShowSuccessCard(true); // Show success card
                // After successful submit, update limit state
                setRequestLimit(0);
                if (data.createdAt) {
                    setNextRequestAvailable(new Date(new Date(data.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000));
                }
            } else if (res.status === 429) {
                setRequestLimit(0);
                setNextRequestAvailable(data.nextRequestAvailable || null);
                setModalMessage("Your request limit exceeded. You can request only a single game in a week.");
                setModalOpen(true);
            } else if (res.status === 403 && (data?.error?.toLowerCase?.().includes('account') || data?.message?.toLowerCase?.().includes('account'))) {
                // Show new account modal
                setNewAccountDaysLeft(data.daysLeft || 0);
                setShowNewAccountModal(true);
            } else {
                setModalMessage(data.error || data.message || "Failed to submit request.");
                setModalOpen(true);
            }
        } catch (err) {
            setModalMessage("An error occurred. Please try again.");
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                <div className="inline-flex items-center rounded-full px-5 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100/50 dark:border-gray-700/50 mb-8">
                    <div className="flex items-center">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-400 dark:text-green-400">Request System Live</span>
                    </div>
                </div>
            </div>
            <PopupModal open={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
            <NewAccountModal open={showNewAccountModal} daysLeft={newAccountDaysLeft} onClose={() => setShowNewAccountModal(false)} />
            <section className="bg-[#030712] pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-bold text-blue-500 mb-4">
                            Game Request
                        </h1>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Portal</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Submit your game requests and let the community decide what gets added to our library next.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1: Submit Game */}
                        <div className="bg-[#232b39]/80 border border-[#2e3748] rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 flex items-center justify-center">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-9.193 9.193a2.25 2.25 0 01-.797.53l-3.25 1.25a.5.5 0 01-.65-.65l1.25-3.25a2.25 2.25 0 01.53-.797l9.193-9.193z" />
                                    </svg>
                                </div>
                                <span className="text-blue-400 font-medium text-base">Step 1</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Submit Game</h2>
                                <p className="text-[#b2b9c9] text-base font-normal">Share the Steam link and details for the game you want added to our library.</p>
                            </div>
                        </div>
                        {/* Step 2: Get Votes */}
                        <div className="bg-[#232b39]/80 border border-[#2e3748] rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 flex items-center justify-center">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4a4 4 0 00-3-3.87M6 10a4 4 0 00-3 3.87" />
                                    </svg>
                                </div>
                                <span className="text-blue-400 font-medium text-base">Step 2</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Get Votes</h2>
                                <p className="text-[#b2b9c9] text-base font-normal">Gather community support. Your request needs 20 votes for priority processing.</p>
                            </div>
                        </div>
                        {/* Step 3: Fast Processing */}
                        <div className="bg-[#232b39]/80 border border-[#2e3748] rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 flex items-center justify-center">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-blue-400 font-medium text-base">Step 3</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Fast Processing</h2>
                                <p className="text-[#b2b9c9] text-base font-normal">Once approved, your request is processed within 24 hours.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="min-h-screen bg-[#030712] py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl md:text-6xl font-bold text-purple-500 mb-4">
                                Game Request
                            </h1>
                            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                                Fill in the details below to submit your request.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Form */}
                            <div className="lg:col-span-4 bg-[#101928]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#232c3a]">
                                {/* New Game Request Header Card (Top of Form) */}
                                {!showSuccessCard && (
                                    <div className="relative p-6 border-b border-gray-200/80 dark:border-gray-700/80 mb-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                {/* Icon Container with Glow */}
                                                <div className="relative shrink-0">
                                                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-20 animate-pulse"></div>
                                                    <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
                                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* Title & Description */}
                                                <div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                                                        Game Request
                                                    </h2>
                                                    <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                                                        Fill in the details below to submit your request
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Request Counter */}
                                            <div className="hidden md:flex flex-col items-end">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/50">
                                                    <span className={`text-xl font-bold ${requestLimit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{limitLoading ? '-' : requestLimit}</span>
                                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">requests left</span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Resets weekly
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Request Limit Card (Top of Form) */}
                                {!showSuccessCard && (
                                    <div className="p-6 border-b border-gray-200/80 dark:border-gray-700/80 mb-8">
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 p-4">
                                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                                Request Limits & Guidelines
                                                            </h4>
                                                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                                                {limitLoading ? (
                                                                    <span className="text-blue-600 font-bold">Checking limit...</span>
                                                                ) : requestLimit > 0 ? (
                                                                    <>You can submit <span className="font-bold text-blue-600 dark:text-blue-200">{requestLimit} request{requestLimit !== 1 ? 's' : ''}</span> this week.</>
                                                                ) : (
                                                                    <><span className="font-bold text-red-500">0 requests left</span> <span className="text-gray-400">(Resets weekly)</span></>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {(!limitLoading && requestLimit === 0 && nextRequestAvailable) && (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Next Request: {formatTimeLeft(nextRequestAvailable)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Form Starts Here */}
                                {showSuccessCard ? (
                                    <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700/30 p-8">
                                        <div className="flex flex-col items-center text-center space-y-6">
                                            {/* Success Icon */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Success Title */}
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                                                Request Submitted Successfully!
                                            </h2>
                                            {/* Success Message */}
                                            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                                Your game request has been submitted and is now pending community support. Share it with others to gather more support!
                                            </p>
                                            {/* Status Info */}
                                            <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-4 w-full max-w-md">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                                            Next Steps
                                                        </div>
                                                        <div className="text-sm text-emerald-700 dark:text-emerald-300">
                                                            Your request needs 20 community votes for priority processing
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Animated Stats Card */}
                                            <div className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/30 p-4 w-full max-w-md">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Processing Time</span>
                                                    </div>
                                                    <div className="border-l border-gray-200 dark:border-gray-700/50 pl-6">
                                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24h</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            After reaching threshold</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Button */}
                                            <button type="button" className="relative group" onClick={() => { setShowSuccessCard(false); setMessage(""); }}>
                                                <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-xl opacity-70 group-hover:opacity-100 blur-sm transition-all duration-300"></div>
                                                <div className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-xl flex items-center gap-2 text-sm font-medium text-white">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                    <span>Submit Another Request</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-7">
                                        {/* Game Title */}
                                        <div>
                                            <label htmlFor="gameTitle" className="block text-base font-semibold text-white mb-2 tracking-wide">
                                                Game Title
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enter the game title..."
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                    maxLength={191}
                                                    className="w-full px-4 py-3 rounded-lg bg-[#181f2a] text-white border border-[#232c3a] focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 outline-none placeholder:text-[#7b8597] text-base shadow-inner"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7b8597]">{title.length}/191</span>
                                            </div>
                                        </div>

                                        {/* Steam Store URL */}
                                        <div>
                                            <label htmlFor="steamUrl" className="block text-base font-semibold text-white mb-2 tracking-wide">
                                                Steam Store URL
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaSteam className="text-xl text-[#7b8597]" />
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="https://store.steampowered.com/app/..."
                                                    value={steamLink}
                                                    onChange={(e) => setSteamLink(e.target.value)}
                                                    className="w-full pl-10 px-4 py-3 rounded-lg bg-[#181f2a] text-white border border-[#232c3a] focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 outline-none placeholder:text-[#7b8597] text-base shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        {/* Platform Dropdown */}
                                        <div>
                                            <label htmlFor="platform" className="block text-base font-semibold text-white mb-2 tracking-wide">
                                                Platform
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaGamepad className="text-xl text-[#7b8597]" />
                                                </div>
                                                <select
                                                    value={platform}
                                                    onChange={(e) => setPlatform(e.target.value)}
                                                    required
                                                    className={`w-full pl-10 px-4 py-3 rounded-lg bg-[#181f2a] border border-[#232c3a] focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 outline-none appearance-none text-base shadow-inner ${!platform ? 'text-[#7b8597]' : 'text-white'}`}
                                                >
                                                    <option value="" disabled>Select a platform</option>
                                                    <option value="PC">PC</option>
                                                    <option value="Mac">Mac</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-[#7b8597]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Release Verification Checkbox */}
                                        <div className="flex items-start bg-transparent rounded-lg py-2">
                                            <input
                                                id="verification"
                                                type="checkbox"
                                                className="w-5 h-5 accent-blue-600 rounded border border-[#232c3a] mt-1 focus:ring-blue-500"
                                                required
                                            />
                                            <label htmlFor="verification" className="ml-3 text-[#b2b9c9] text-sm select-none">
                                                I verify that this game has been officially released and is patched by Scene groups or P2P community.
                                                <button type="button" onClick={() => setShowDenuvoModal(true)} className="text-blue-400 hover:underline ml-1 inline-flex items-center focus:outline-none">
                                                    What is Denuvo? <FaInfoCircle className="ml-1" />
                                                </button>
                                            </label>
                                        </div>

                                        {/* Important Notice */}
                                        <div className="p-4 rounded-xl bg-[#2a1a13]/80 border border-[#ffb86b] flex items-start gap-3">
                                            <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-yellow-200 mb-1">Important Notice</h3>
                                                <p className="text-sm text-yellow-100">
                                                    Games protected by Denuvo DRM cannot be published on our platform. Please verify the game's DRM status before submitting your request to avoid rejection.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Request Processing Info */}
                                        <div className="p-4 rounded-xl bg-[#1a2233]/80 border border-[#3b4a6b] flex items-start gap-3">
                                            <FaInfoCircle className="h-5 w-5 text-blue-400 mt-1" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-200 mb-1">Request Processing Information</h3>
                                                <p className="text-sm text-blue-100">
                                                    Requests require 20+ community votes for priority processing. Average processing time is 24 hours after reaching the threshold.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <FaPlus className="text-xl" />
                                            {loading ? "Submitting..." : "Submit Request"}
                                        </button>
                                        {message && <div className="text-center text-sm mt-2 text-green-400">{message}</div>}
                                    </form>
                                )}
                            </div>
                            {/* right card */}

                        </div>
                    </div>
                </div>
            </section>
            <div className="relative mb-15">
                {/* <!-- Section Header --> */}
                <div className="relative mb-12 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                        Request Lifecycle
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Understanding how your game request progresses through our system
                    </p>
                </div>

                {/* <!-- State Flow Timeline --> */}
                <div className="relative max-w-5xl mx-auto">
                    {/* <!-- Connection Line --> */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20">
                    </div>

                    {/* <!-- States Grid --> */}
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        {/* <!-- PENDING State --> */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500">
                            </div>
                            <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/30">
                                {/* <!-- State Icon --> */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* <!-- State Title --> */}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pending
                                </h3>

                                {/* <!-- Requirements --> */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Need 20 votes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Within 5 days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- PROCESSING State --> */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500">
                            </div>
                            <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/30">
                                {/* <!-- State Icon with Animation --> */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute"></div>
                                            <div className="w-3 h-3 bg-amber-500 rounded-full relative"></div>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Processing</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        <span>Quality check</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>~24h processing time</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Success Path --> */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-green-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500">
                            </div>
                            <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/30">
                                {/* <!-- Success Icon --> */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Approved
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        <span>Ready for download</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Files verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Rejected State --> */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/50 to-red-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500">
                            </div>
                            <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/30">
                                {/* <!-- Rejected Icon --> */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rejected
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Less than 20 votes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        <span>Removed in 3 days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Denuvo Info Modal */}
            {showDenuvoModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg mx-auto animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                What is Denuvo DRM?
                            </h4>
                            <button onClick={() => setShowDenuvoModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Content */}
                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                            <p className="text-base leading-relaxed">
                                Denuvo Anti-Tamper is a DRM technology that prevents games from being cracked. Games protected by Denuvo are extremely difficult to bypass.
                            </p>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">How to check:</p>
                                <ul className="list-disc list-inside space-y-1.5 ml-2">
                                    <li>Look at the Steam store page system requirements</li>
                                    <li>Check for "Denuvo Anti-Tamper" in DRM notices</li>
                                    <li>Search "Does [game name] use Denuvo?" online</li>
                                </ul>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">Safe to Request</span>
                                    </div>
                                    <p className="text-sm text-green-600 dark:text-green-300">
                                        Older games, indie titles, games without DRM
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-sm font-semibold text-red-700 dark:text-red-400">Avoid Requesting</span>
                                    </div>
                                    <p className="text-sm text-red-600 dark:text-red-300">
                                        New AAA games, EA titles, recent releases
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}