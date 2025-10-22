import React, { useState } from "react";
import Confetti from 'react-dom-confetti';

/**
 * RandomGameButton
 * @param {('mac'|'pc')} platform - Which platform to fetch a random game for
 * @param {function} onGameFetched - Optional callback with the fetched game
 */
const RandomGame = ({ platform = "mac", onGameFetched }) => {
    const [loading, setLoading] = useState(false);
    const [game, setGame] = useState(null);
    const [error, setError] = useState("");
    const [isExploding, setIsExploding] = useState(false);
    const [blessing, setBlessing] = useState("");
    const [showBlessing, setShowBlessing] = useState(false);
    // Animation state for image transition
    const [imageTransitioning, setImageTransitioning] = useState(false);
    const [pendingGame, setPendingGame] = useState(null); // Hold next game for animation
    // Add cooldown state for shuffle button
    const [shuffleCooldown, setShuffleCooldown] = useState(false);

    const blessingMessages = [
        "The gods have chosen this game for you!",
        "The fairies have blessed you with this pick!",
        "Destiny rolled the dice for you!",
        "A wizard conjured this game just for you!",
        "The stars aligned for this choice!",
        "A secret council picked this adventure!",
        "The universe wants you to play this!",
        "Fate placed this at your feet. Step lightly.",
        "The last warrior who ignored this… vanished.",
        "You can play this only, when you earned it!!"
    ];

    // Function to create slug for URLs
    const createSlug = (text = "") => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };

    const fetchRandomGame = async (preserveCard = false) => {
        setLoading(true);
        setError("");
        if (!preserveCard) setGame(null); // Only clear card if not preserving
        try {
            const res = await fetch(
                `${process.env.VITE_API_URL || ""}/api/random/${platform}`, {
                headers: {
                    'X-Auth-Token': process.env.VITE_API_TOKEN,
                }
            }
            );
            const data = await res.json();
            if (data.success && data.game) {
                setGame(data.game);
                if (onGameFetched) onGameFetched(data.game);
            } else {
                setError(data.message || "No game found.");
            }
        } catch (err) {
            setError("Failed to fetch game.");
        } finally {
            setLoading(false);
        }
    };

    const showRandomBlessing = () => {
        const msg = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];
        setBlessing(msg);
        setShowBlessing(true);
        setTimeout(() => setShowBlessing(false), 1200);
    };

    const handleDiceClick = async () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 700);
        await fetchRandomGame(false); // clear card on first roll
        showRandomBlessing();
    };

    const handleShuffleClick = async () => {
        if (shuffleCooldown) return; // Prevent rapid clicks
        setShuffleCooldown(true);
        setTimeout(() => setShuffleCooldown(false), 2000); // 2s cooldown
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 700);
        showRandomBlessing();
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.VITE_API_URL || ""}/api/random/${platform}`, {
                headers: {
                    'X-Auth-Token': process.env.VITE_API_TOKEN,
                },
            }
            );
            const data = await res.json();
            if (data.success && data.game) {
                setImageTransitioning(true); // Start fade out
                setPendingGame(data.game); // Hold next game
                setTimeout(() => {
                    setGame(data.game); // Swap to new game after fade out
                    setImageTransitioning(false); // Fade in
                    setPendingGame(null);
                    if (onGameFetched) onGameFetched(data.game);
                    setLoading(false);
                }, 400); // 0.4s fade out, then swap
            } else {
                setError(data.message || "No game found.");
                setImageTransitioning(false);
                setLoading(false);
            }
        } catch (err) {
            setError("Failed to fetch game.");
            setImageTransitioning(false);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
            {/* Confetti for dice/shuffle */}
            <div className="pointer-events-none absolute left-1/2 top-16 z-50" style={{ transform: 'translateX(-50%)' }}>
                <Confetti active={isExploding} />
            </div>
            {/* If a game is fetched, show the card instead of the button */}
            {game ? (
                <div className="relative lg:w-xl md:w-l rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-purple-600/20 shadow-lg overflow-hidden min-h-[180px] max-h-[210px]">
                    {/* Blessing message overlay */}
                    {showBlessing && (
                        <div className="absolute left-1/2 top-8 z-40 px-4 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm text-white text-sm font-medium shadow-lg shadow-black/70 animate-fadeInOut" style={{ transform: 'translateX(-50%)' }}>
                            {blessing}
                        </div>
                    )}
                    {/* Background image with fade animation */}
                    <div style={{ zIndex: 1, position: 'absolute', inset: 0 }}>
                        <img
                            src={imageTransitioning && pendingGame?.thumbnail?.[2] ? pendingGame.thumbnail[2] : game?.thumbnail?.[2]}
                            alt="background"
                            className={imageTransitioning ? "transition-opacity duration-400 opacity-0 w-full h-full object-cover object-center" : "transition-opacity duration-400 opacity-100 w-full h-full object-cover object-center"}
                        />
                    </div>
                    {/* Overlay for darkening */}
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    {/* Back button */}
                    <button onClick={() => setGame(null)} className="absolute top-4 left-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    {/* Loader overlay on card */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
                            <svg className="animate-spin h-10 w-10 text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </div>
                    )}
                    <div className="relative flex flex-col justify-end h-full z-20 px-4 py-4 mt-20 sm:px-6 sm:py-5">
                        {/* Game Title */}
                        <h3 className="mb-1 pr-2 text-xl leading-tight font-bold text-white sm:mb-2 sm:pr-4 sm:text-2xl overflow-hidden text-ellipsis whitespace-nowrap">{game.title}</h3>
                        {/* Info Row */}
                        <div className="flex items-center justify-between">
                            {/* Left Side - Info Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                                {/* Rating Badge (show _id as fallback) */}
                                <div className="flex items-center">
                                    <span className="rounded border border-white/5 bg-white/10 px-2 py-0.5 text-xs font-medium text-white sm:py-1">{game.rating || game.gameMode}</span>
                                </div>
                                {/* Year */}
                                <div className="flex items-center text-white/80">
                                    <svg className="mr-1 h-3.5 w-3.5 text-white/60 sm:mr-1.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-xs sm:text-sm">{game.year || game.releaseYear || '2025'}</span>
                                </div>
                                {/* Developer (hidden on mobile) */}
                                {game.developer && (
                                    <div className="hidden items-center text-white/80 sm:flex">
                                        <svg className="mr-1.5 h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        <span className="max-w-[150px] truncate text-sm">{game.developer}</span>
                                    </div>
                                )}
                                {/* Size (hidden on mobile) */}
                                {game.size && (
                                    <div className="hidden items-center text-white/80 sm:flex">
                                        <svg className="mr-1.5 h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                        <span className="text-sm">{game.size}</span>
                                    </div>
                                )}
                            </div>
                            {/* Right Side - Action Buttons */}
                            <div className="ml-2 flex flex-shrink-0 items-center gap-2 sm:ml-3 sm:gap-3">
                                {/* Shuffle Button */}
                                <button onClick={handleShuffleClick} disabled={loading || shuffleCooldown} className="group flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/15 focus:outline-none sm:h-9 sm:w-9">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform text-white transition-transform duration-500 group-hover:rotate-180 sm:h-4.5 sm:w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                                {/* View Details Button */}
                                <a href={`/download/${createSlug(game.platform)}/${createSlug(game.title)}/${game._id}`} className="group flex h-7 items-center gap-1 rounded-lg bg-blue-500 px-4 text-white shadow-lg shadow-black/30 transition-all duration-300 hover:bg-blue-600 hover:shadow-black/50 focus:outline-none sm:h-9 sm:gap-2 sm:px-6">
                                    <span className="text-xs font-medium sm:text-base flex items-center gap-1">View Details <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                                </a>
                            </div>
                        </div>
                        {/* Genres below badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {Array.isArray(game.genres) && game.genres.slice(0, 2).map((genre, idx) => (
                                <span key={genre + idx} className="rounded border border-white/5 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">{genre}</span>
                            ))}
                            {Array.isArray(game.genres) && game.genres.length > 2 && (
                                <span className="rounded border border-white/5 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">+{game.genres.length - 2}</span>
                            )}
                        </div>
                    </div>
                    {loading && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold bg-black/30 z-30">Loading...</span>
                    )}
                </div>
            ) : (
                // Show the button if no game is fetched
                <div className="relative w-full">
                    <button
                        onClick={handleDiceClick}
                        disabled={loading}
                        className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500 px-6 py-4 font-medium text-white shadow-lg transition-all duration-500 hover:scale-[1.01] hover:from-amber-500 hover:via-fuchsia-500 hover:to-indigo-500 hover:shadow-xl focus:ring-2 focus:ring-fuchsia-400/50 focus:ring-offset-2 focus:outline-none sm:px-8 sm:py-5 dark:focus:ring-offset-gray-900"
                    >
                        {/* Animated background sparkles */}
                        <span className="absolute top-0 left-1/4 h-3 w-3 animate-ping rounded-full bg-white opacity-60 blur-sm" style={{ animationDuration: '3s', animationDelay: '0.2s' }}></span>
                        <span className="absolute top-1/3 right-1/4 h-2 w-2 animate-ping rounded-full bg-white opacity-60 blur-sm" style={{ animationDuration: '2.5s', animationDelay: '0.7s' }}></span>
                        <span className="absolute bottom-1/4 left-1/3 h-2.5 w-2.5 animate-ping rounded-full bg-white opacity-60 blur-sm" style={{ animationDuration: '3.2s', animationDelay: '1.2s' }}></span>
                        {/* Colorful dice icon wrapper */}
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <div className="relative flex-shrink-0 transition-transform duration-700 group-hover:rotate-[360deg]">
                                <div className="absolute inset-0 rounded-xl bg-white/30 blur-md transition-all duration-300 group-hover:bg-white/40"></div>
                                <div className="relative animate-bounce rounded-xl bg-white/20 p-2 backdrop-blur-sm sm:p-2.5" style={{ animationDuration: '2s' }}>
                                    {/* Dice SVG */}
                                    <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 16.0931V7.90687C21 7.48604 20.776 7.09823 20.4 6.90687L13.4 3.05687C12.76 2.71687 12 3.17687 12 3.91687V20.0831C12 20.8231 12.76 21.2831 13.4 20.9431L20.4 17.0931C20.776 16.9017 21 16.5139 21 16.0931Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M12 3.91687C12 3.17687 11.24 2.71687 10.6 3.05687L3.6 6.90687C3.22399 7.09823 3 7.48604 3 7.90687V16.0931C3 16.5139 3.22399 16.9017 3.6 17.0931L10.6 20.9431C11.24 21.2831 12 20.8231 12 20.0831V3.91687Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M16.5 14C17.3284 14 18 13.3284 18 12.5C18 11.6716 17.3284 11 16.5 11C15.6716 11 15 11.6716 15 12.5C15 13.3284 15.6716 14 16.5 14Z" fill="currentColor"></path>
                                        <path d="M7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9Z" fill="currentColor"></path>
                                        <path d="M7.5 18C8.32843 18 9 17.3284 9 16.5C9 15.6716 8.32843 15 7.5 15C6.67157 15 6 15.6716 6 16.5C6 17.3284 6.67157 18 7.5 18Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-lg font-bold tracking-wide transition-all duration-500 group-hover:tracking-wider sm:text-xl">Roll the Dice!</span>
                                <span className="mt-1 text-xs text-white/80 opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">Discover your next gaming adventure</span>
                            </div>
                            <div className="relative hidden flex-shrink-0 sm:block">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 translate-x-0 transform text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </div>
                        </div>
                        {/* Magic confetti particles */}
                        <div className="pointer-events-none absolute inset-0 h-full w-full">
                            <div className="animate-float absolute top-1/4 left-[10%] h-1.5 w-1.5 rounded-full bg-blue-300 opacity-0 group-hover:opacity-100" style={{ animationDuration: '3s', animationDelay: '0.2s' }}></div>
                            <div className="animate-float absolute top-3/4 left-[80%] h-2 w-2 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100" style={{ animationDuration: '2.7s', animationDelay: '0.5s' }}></div>
                            <div className="animate-float absolute top-1/2 left-[75%] h-1 w-1 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-100" style={{ animationDuration: '2.5s', animationDelay: '0.7s' }}></div>
                            <div className="animate-float absolute top-2/3 left-[20%] h-1.5 w-1.5 rounded-full bg-green-300 opacity-0 group-hover:opacity-100" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}></div>
                        </div>
                        {loading && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold bg-black/30">Loading...</span>
                        )}
                    </button>
                </div>
            )}
            {/* Show error below */}
            {error && <div className="text-red-400 text-sm font-medium mt-2">{error}</div>}
        </div>
    );
};

export default RandomGame;