import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GiscusComments from './GiscusComments';
import GameAnnouncement from './GameAnnouncement';
import DownloadSection from './DownloadSection';
import DescriptionTabs from './DescriptionTabs';
import LoadingSkeleton from './LoadingSkeleton';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import CommentBox from '../../CommentBox/CommentBox';

const SingleApp = () => {
    // Get parameters from React Router instead of Next.js props
    const { id, platform, title } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(null); // Start with null (loading)
    const [userData, setUserData] = useState(null);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [scrollToCommentId, setScrollToCommentId] = useState(null);
    const [commentScrolled, setCommentScrolled] = useState(false);


    const slugify = (text = '') => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

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

    // Fetch app data client-side - CHANGED: Try public route first, then protected
    useEffect(() => {
        const fetchAppData = async () => {
            setError(null);
            setData(null);
            try {
                const token = localStorage.getItem('token');
                const xAuthToken = import.meta.env.VITE_API_TOKEN;
                const headers = xAuthToken ? { 'X-Auth-Token': xAuthToken } : {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // Try protected route first
                let res;
                try {
                    res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/apps/get/${id}/protected`,
                        { headers }
                    );
                    if (res.data?.app) {
                        setData(res.data.app);
                        return;
                    }
                } catch (err) {
                    // Fallback to public route if protected fails
                    try {
                        res = await axios.get(
                            `${import.meta.env.VITE_API_URL}/api/apps/get/${id}`,
                            { headers }
                        );
                        if (res.data?.app) {
                            setData(res.data.app);
                            return;
                        }
                        setError(res.data?.message || 'App not found');
                    } catch (err2) {
                        setError(err2.response?.data?.message || 'Failed to fetch app data');
                    }
                }
            } catch (err) {
                setError('Failed to fetch app data');
            }
        };
        if (id) fetchAppData();
    }, [id]);

    useEffect(() => {
        if (data?.title && data?.platform) {
            document.title = `Download ${data.title} for ${data.platform} Free | ToxicGames`;
        } else {
            document.title = "ToxicGames – Download Free Games";
        }
    }, [data]);

    // NEW: Fetch copyrighted data for logged in users
    useEffect(() => {
        const fetchCopyrightedData = async () => {
            if (data?.copyrighted && userData) {
                try {
                    const token = localStorage.getItem('token');
                    const xAuthToken = import.meta.env.VITE_API_TOKEN;
                    const headers = xAuthToken ? { 'X-Auth-Token': xAuthToken } : {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/apps/get/${id}/copyrighted`,
                        { headers }
                    );
                    if (res.data?.app) {
                        setData(res.data.app);
                    }
                } catch (err) {
                    console.error("Failed to fetch copyrighted data:", err);
                    // Keep the existing data if copyrighted fetch fails
                }
            }
        };

        if (data?.copyrighted && userData) {
            fetchCopyrightedData();
        }
    }, [data?.copyrighted, userData, id]);

    // Robust user data fetching with API + JWT fallback
    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const xAuthToken = import.meta.env.VITE_API_TOKEN;

            if (!token) {
                setUserData(null);
                return null;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                ...(xAuthToken && { 'X-Auth-Token': xAuthToken })
            };

            let userData;
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/user/me`,
                    { headers }
                );
                userData = res.data?.user || null;
            } catch (backendError) {
                // Fallback to JWT decode if backend fails
                try {
                    const decoded = jwtDecode(token);
                    userData = {
                        username: decoded.username || decoded.name || "User",
                        email: decoded.email || "",
                        avatar: decoded.avatar || "https://ui-avatars.com/api/?name=U&background=random",
                        purchasedGames: decoded.purchasedGames || [],
                        createdAt: decoded.iat ? new Date(decoded.iat * 1000) : undefined,
                        role: decoded.role || 'USER',
                        isAdmin: decoded.role === 'ADMIN',
                        isMod: decoded.role === 'MOD',
                        isPremium: decoded.role === 'PREMIUM',
                    };
                } catch (decodeError) {
                    console.error("Failed to decode token:", decodeError);
                    userData = null;
                }
            }

            return userData;
        } catch (error) {
            console.error("User fetch error:", error);
            return null;
        }
    }, []);

    // Main function to load user data and check access
    const loadUserDataAndCheckAccess = useCallback(async () => {
        setIsCheckingAccess(true);
        try {
            const user = await fetchUserData();
            // Ensure isAdmin is always a boolean
            if (user) {
                user.isAdmin = user.role === 'ADMIN';
                user.isMod = user.role === 'MOD';
                user.isPremium = user.role === 'PREMIUM';
            }
            setUserData(user);

            if (user) {
                const { isAdmin, isMod, isPremium } = user;
                const hasPurchased = user.purchasedGames?.map(String).includes(String(id));
                const shouldHaveAccess = isAdmin || isMod || isPremium || !data?.isPaid || hasPurchased;

                setHasAccess(shouldHaveAccess);
            } else {
                // No user = guest
                setHasAccess(!data?.isPaid);
            }
        } catch (error) {
            console.error("Access check error:", error);
            setHasAccess(false);
        } finally {
            setIsCheckingAccess(false);
        }
    }, [data, fetchUserData, id]);

    // Initial load and event listeners
    useEffect(() => {
        loadUserDataAndCheckAccess();

        const handleAuthChange = () => loadUserDataAndCheckAccess();
        const handlePurchaseEvent = () => loadUserDataAndCheckAccess();

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('purchase-completed', handlePurchaseEvent);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('purchase-completed', handlePurchaseEvent);
        };
    }, [loadUserDataAndCheckAccess]);

    // Slide handling functions
    const nextSlide = () => {
        if (data?.thumbnail && data.thumbnail.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % (data.thumbnail.length - 1));
        }
    };

    const prevSlide = () => {
        if (data?.thumbnail && data.thumbnail.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + (data.thumbnail.length - 1)) % (data.thumbnail.length - 1));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    };

    // Function to handle body scroll locking
    const lockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
        }
    };

    const unlockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    };

    const handleDownloadClick = () => {
        setShowModal(true);
        lockScroll();
    };

    const closeModal = () => {
        setShowModal(false);
        unlockScroll();
    };

    // Clean up scroll lock when component unmounts
    useEffect(() => {
        return () => {
            unlockScroll();
        };
    }, []);

    // Show skeleton while loading data (before data is set or error is set)
    if (data === null && !error) {
        return <LoadingSkeleton />;
    }

    // If there's an error, show an error message
    if (error) {
        return (
            <div className="flex justify-center items-center h-[40rem]">
                <h1 className="text-2xl text-red-500">{error}</h1>
            </div>
        );
    }

    // If the app is paid and the user doesn't have access
    if (!hasAccess && data) {
        return (
            <div className="fixed inset-0 flex justify-center items-center z-[2000]" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }}>
                <div className="text-center p-8 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl border border-purple-600/20 max-w-md shadow-2xl" style={{ zIndex: 2001 }}>
                    <div className="mb-6">
                        <div className="bg-red-500/20 p-4 rounded-full inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Access Restricted</h1>
                    <p className="text-gray-300 mb-6">
                        You need to purchase the game in order to play it.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/membership')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        >
                            Buy Membership
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-300"
                        >
                            Go to Home Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // NEW: Show copyrighted lock for non-logged in users
    if (data?.copyrighted && !userData) {
        return (
            <div className="fixed inset-0 flex justify-center items-center z-[2000]" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }}>
                <div className="text-center p-8 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl border border-yellow-600/20 max-w-md shadow-2xl" style={{ zIndex: 2001 }}>
                    <div className="mb-6">
                        <div className="bg-yellow-500/20 p-4 rounded-full inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-yellow-400 mb-4">Game Not Available</h1>
                    <p className="text-gray-300 mb-6">
                        This game is currently unavailable for download due to <span className='text-red-600 font-bold'>copyright restrictions</span>. Our team has disabled access to this game.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        >
                            Go to HomePage
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-300"
                        >
                            Sign up Here
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div>
            <title>Download {data?.title} for {data?.platform} Free | ToxicGames</title>
            <meta
                name="description"
                content={`Download ${data?.title} for ${data?.platform} for free. ${data?.description ? data.description.substring(0, 160) : `Get ${data?.title} and enjoy this ${data?.platform} game at ToxicGames.`}`}
            />
            <meta
                name="keywords"
                content={`${data?.title}, ${data?.platform} games, free download, ToxicGames, ${data?.category?.name || ''}, ${data?.architecture || ''}`}
            />
            <link rel="canonical" href={`https://toxicgame.net/download/${data?.platform?.toLowerCase()}/${slugify(data?.title)}/${data?._id}`} />

            {/* Open Graph / Social Media */}
            <meta property="og:title" content={`Download ${data?.title} for ${data?.platform} Free | ToxicGames`} />
            <meta
                property="og:description"
                content={`Download ${data?.title} for ${data?.platform} for free. ${data?.description ? data.description.substring(0, 160) : `Available now at ToxicGames.`}`}
            />
            <meta property="og:image" content={data?.coverImg || data?.thumbnail?.[1] || data?.thumbnail?.[0] || "https://i.postimg.cc/KcVfdJrH/image-removebg-preview-removebg-preview.png"} />
            <meta property="og:url" content={`https://toxicgame.net/download/${data?.platform?.toLowerCase()}/${slugify(data?.title)}/${data?._id}`} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="ToxicGames" />


            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="ToxicGames" />

            {/* Structured Data / Schema.org */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": data?.title,
                    "operatingSystem": data?.platform,
                    "applicationCategory": "GameApplication",
                    "downloadUrl": data?.downloadLink?.[0] || "",
                    "fileSize": data?.size,
                    "datePublished": data?.createdAt,
                    "dateModified": data?.updatedAt,
                    "author": {
                        "@type": "Organization",
                        "name": "ToxicGames"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                })}
            </script>


            <div style={{ position: 'relative' }}>
                {/* Admin Edit Floating Button */}
                {(userData?.isAdmin || userData?.isMod) && (
                    <button
                        className="absolute top-8 right-8 z-[100] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-full shadow-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 pointer-events-auto"
                        style={{
                            boxShadow: '0 4px 24px 0 rgba(80, 0, 200, 0.18)',
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            zIndex: 100
                        }}
                        onClick={() => navigate(`/admin/apps/update/${data._id}`)}
                        title="Edit this app"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l1 1" />
                        </svg>
                        Edit
                    </button>
                )}
                <div className='flex flex-wrap flex-col xl:flex-row px-2 justify-center xl:items-start items-center'>
                    {/* Left Content */}
                    <div className="flex-1">
                        {/* Card */}
                        <div className="flex pb-3 flex-grow flex-col rounded-lg ">
                            <div className="flex items-center gap-4 text-slate-800 gap-3 sm:gap-5 bg-gradient-to-r from-[#1E1E1E] to-[#121212] p-4 rounded-xl border border-purple-600/20 ">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                    <img
                                        src={data?.thumbnail?.[0] || "https://via.placeholder.com/58"}
                                        alt={data?.title || "App"}
                                        className="relative h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] rounded-lg object-cover object-center border border-purple-500/20"
                                    />
                                </div>
                                <div className="flex w-full flex-col overflow-hidden">
                                    <div className="w-full flex items-center justify-between overflow-hidden">
                                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-base sm:text-xl md:text-xl lg:text-2xl font-bold truncate whitespace-nowrap overflow-hidden max-w-[80%]">
                                            {data?.title || ""}
                                        </h1>
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-gray-300 uppercase font-medium mt-0.5 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                            <path d="M12 18h.01" />
                                        </svg>
                                        {data?.platform || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Slider Logic */}
                        {data?.thumbnail?.length > 1 && (
                            <div id="default-carousel" className="flex relative w-full max-w-full mt-6">
                                <div className="relative bg-gradient-to-br from-[#1E1E1E] to-[#121212] w-full h-[13rem] sm:h-[19rem] md:h-[20rem] lg:h-[26rem] overflow-hidden rounded-xl border border-purple-600/20 shadow-lg">
                                    {/* Ambient background elements */}
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                    {data?.thumbnail?.slice(1).map((image, index) => (
                                        <div key={index} className={`transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} h-full`}>
                                            <img
                                                src={image}
                                                className="block w-full h-full object-cover rounded-lg"
                                                alt={`Slide ${index + 2}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Slider indicators */}
                                <div className="absolute flex -translate-x-1/2 bottom-4 left-1/2 space-x-2 overflow-hidden max-w-full justify-center">
                                    {data?.thumbnail?.slice(1).map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125'
                                                : 'bg-gray-600 hover:bg-gray-500'
                                                }`}
                                            aria-current={index === currentIndex}
                                            aria-label={`Slide ${index + 2}`}
                                            onClick={() => setCurrentIndex(index)}
                                        />
                                    ))}
                                </div>

                                {/* Slider controls */}
                                <button
                                    type="button"
                                    className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 cursor-pointer transition-all duration-300 focus:outline-none"
                                    onClick={prevSlide}
                                    aria-label="Previous slide"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-white"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 cursor-pointer transition-all duration-300 focus:outline-none"
                                    onClick={nextSlide}
                                    aria-label="Next slide"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-white"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Card */}
                    <div className="w-full max-w-[24rem] mx-auto xl:ml-6 px-7 py-7 bg-gradient-to-br from-[#23233a] via-[#181828] to-[#12121a] rounded-2xl shadow-2xl mt-6 xl:mt-[8.1rem] border border-purple-600/30 relative overflow-hidden flex flex-col justify-between xl:h-[26rem] lg:h-[26rem] min-h-[26rem] transition-all duration-300">
                        {/* Enhanced ambient background elements */}
                        <div className="absolute -top-12 -left-12 w-44 h-44 bg-purple-600 opacity-20 rounded-full blur-2xl animate-pulse-slow"></div>
                        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-blue-600 opacity-20 rounded-full blur-2xl animate-pulse-slow"></div>

                        {/* Content wrapper with improved scrolling */}
                        <div className="relative z-10 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
                            <div className="grid grid-cols-1 gap-5">
                                {/* Platform */}
                                <div>
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                            <path d="M12 18h.01" />
                                        </svg>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform</h2>
                                    </div>
                                    <p className="text-sm text-gray-100 ml-6 font-medium">{data?.platform || ""}</p>
                                </div>

                                {/* Tested */}
                                <div>
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                                            <path d="m15 9-6 6" />
                                            <path d="m9 9 6 6" />
                                        </svg>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tested</h2>
                                    </div>
                                    <p className="text-sm text-gray-100 ml-6 font-medium">
                                        {data?.platform === "Mac" && "Mac Air M1"}
                                        {data?.platform === "PC" && "PC"}
                                        {data?.platform === "Android" && "Android device"}
                                        {data?.platform === "Playstation" && "PC (Emulator)"}
                                        {!data?.platform && "Not specified"}
                                    </p>
                                </div>

                                {/* Size */}
                                <div>
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Size</h2>
                                    </div>
                                    <p className="text-sm text-gray-100 ml-6 font-medium">{data?.size || ""}</p>
                                </div>

                                {/* Updated at */}
                                <div>
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Updated at</h2>
                                    </div>
                                    <p className="text-sm text-gray-100 ml-6 font-medium">{data?.updatedAt ? formatDate(data.updatedAt) : ""}</p>
                                </div>

                                {/* Architecture */}
                                <div>
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                            <path d="M12 18h.01" />
                                        </svg>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Architecture</h2>
                                    </div>
                                    <p className="text-sm text-gray-100 ml-6 font-medium">{data?.architecture && String(data.architecture).trim() !== '' ? data.architecture : (data?.platform === 'Mac' ? 'Port' : data?.platform === 'PC' ? 'Native' : '')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 pb-1 mt-2 relative z-10">
                            <button
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 w-full text-center pb-1 rounded-xl text-base font-bold uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                onClick={() => {
                                    // Open the ad link in a new tab
                                    window.open(
                                        "https://qbootarr.cfd/?hash=<?php echo substr(md5(microtime()),0,rand(10,30));?>&z=117",
                                        "_blank",
                                        "noopener,noreferrer"
                                    );

                                    // Then trigger your existing logic
                                    handleDownloadClick();
                                }}
                            >
                                <div className="flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Free Download ({data?.size || ""})
                                </div>
                            </button>
                        </div>

                    </div>
                </div>

                {/* Description/Installation Section */}
                <DescriptionTabs data={data} />

                {/* Modal for Download Instructions */}
                {showModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center backdrop-blur-md overflow-hidden"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 2000,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }}
                        onClick={(e) => {
                            // Close modal when clicking outside of modal content
                            if (e.target === e.currentTarget) {
                                closeModal();
                            }
                        }}
                    >
                        <div
                            className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] px-6 sm:px-12 lg:px-24 py-6 sm:py-8 rounded-xl w-full max-w-4xl mx-auto text-center my-auto max-h-[90vh] overflow-y-auto border border-purple-600/20 shadow-2xl"
                            style={{ position: 'relative', zIndex: 2001 }}
                        >
                            {/* Close Icon */}
                            <div
                                className="absolute top-4 right-4 cursor-pointer bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all duration-300"
                                onClick={closeModal}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3">Installation Instructions</h3>

                            {/* For MAC games*/}
                            {data.category?.name === 'mac' && (
                                <div>
                                    <div className="bg-[#0F0F0F] p-6 rounded-xl border border-purple-500/20 shadow-lg mb-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 mr-2">
                                                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                                                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                                                <path d="M12 2v2"></path>
                                                <path d="M12 22v-2"></path>
                                                <path d="m17 20.66-1-1.73"></path>
                                                <path d="M11 10.27 7 3.34"></path>
                                                <path d="m20.66 17-1.73-1"></path>
                                                <path d="m3.34 7 1.73 1"></path>
                                                <path d="M14 12h8"></path>
                                                <path d="M2 12h2"></path>
                                                <path d="m20.66 7-1.73 1"></path>
                                                <path d="m3.34 17 1.73-1"></path>
                                                <path d="m17 3.34-1 1.73"></path>
                                                <path d="m7 20.66 1-1.73"></path>
                                            </svg>
                                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">MAC INSTALLATION</h2>
                                        </div>
                                        <div className="space-y-3 text-left">
                                            <p className="text-sm sm:text-base text-gray-200">1. Run the downloaded image and drag the application to the Applications folder shortcut.</p>
                                            <p className="text-sm sm:text-base text-gray-200">2. Once copying is complete, the application can be launched via Launchpad.</p>
                                            <div className="bg-black/30 p-4 rounded-lg mt-4 border-l-2 border-yellow-500">
                                                <p className='text-white text-sm'>If the application shows <span className='text-yellow-400 font-medium'>"The app is damaged and can't be opened. You should move it to the bin"</span> then visit our <a className='text-blue-400 hover:text-blue-300 transition-colors font-medium' href="https://toxicgame.net/faq">FAQ </a>page and refer that video.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Check if announcement is not empty and has enough data */}
                                    {data?.announcement && <GameAnnouncement announcements={data.announcement} />}

                                    <div className='flex flex-wrap justify-center items-center mt-6 p-3 bg-blue-900/10 rounded-lg border border-blue-800/20'>
                                        <span className="text-gray-300 text-sm mr-2">Need help?</span>
                                        <a
                                            href="https://vimeo.com/1030290869?share=copy"
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className='flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                            </svg>
                                            Watch Installation Video
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* For Software MAC */}
                            {data.category?.name === 'smac' && (
                                <div>
                                    <div>
                                        <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Software MAC</h2>
                                        <p className="mt-1 text-sm sm:text-base text-blue-500">Follow the instructions to mount the image, then drag the application to the Applications folder.</p>
                                        <p className="text-sm sm:text-base text-white">This version may require additional configurations for certain users.</p>
                                    </div>

                                    {/* Check if announcement is not empty */}
                                    {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                                </div>
                            )}

                            {/* For PC */}
                            {data.category?.name === 'pc' && (
                                <div>
                                    <div>
                                        <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">PC</h2>
                                        <p className="mt-1 text-sm sm:text-bas text-white">Game is pre-installed / portable, therefore you do not need to install the game.</p>
                                        <p className='text-green-500 text-base'>Just extract the <span className='text-yellow-500'>rar / zip file</span> and lauch the game directly from it's  <span className='text-yellow-500'>exe</span>.</p>
                                    </div>

                                    {/* Check if announcement is not empty */}
                                    {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                                </div>
                            )}

                            {/* For Software PC */}
                            {data.category?.name === 'spc' && (
                                <>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Software PC</h2>
                                    <p className="mt-1 text-sm sm:text-base">Run the installer and follow the setup process. It might need additional configurations for software compatibility.</p>
                                    <p className="text-sm sm:text-base">After installation, the software will be ready to use.</p>
                                </>
                            )}

                            {/* For Android */}
                            {data.category?.name === 'android' && (
                                <div>
                                    <div>
                                        <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Android</h2>
                                        <p className="mt-1 text-sm sm:text-base text-green-600">Install the APK directly on your Android device.</p>
                                        <p className="text-sm sm:text-base text-white">Ensure that you have enabled installation from unknown sources in your device settings.</p>
                                    </div>

                                    {/* Check if announcement is not empty */}
                                    {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                                </div>
                            )}

                            {/* For Android Softwares */}
                            {data.category?.name === 'sandroid' && (
                                <>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Android</h2>
                                    <p className="mt-1 text-sm sm:text-base text-yellow-600">Install the APK directly on your Android device.</p>
                                    <p className="text-sm sm:text-base text-white">Ensure that you have enabled installation from unknown sources in your device settings.</p>
                                </>
                            )}

                            {/* For PlayStation (ps2, ps3, ps4, ppsspp) */}
                            {['Playstation'].includes(data.platform) && (
                                <div>
                                    <div>
                                        <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">PlayStation</h2>
                                        <p className="mt-1 text-sm sm:text-base text-white">For PlayStation, follow the platform-specific instructions to install or load the game on your console.</p>
                                        <p className="text-sm sm:text-base text-yellow-300">To run these on PC, download the appropriate versions of Emulators <a className='text-blue-600 hover:underline' href='https://www.ppsspp.org/download/' target='_blank' rel="noopener noreferrer">PPSSPP</a>, <a className='text-blue-600 hover:underline' href='https://pcsx2.net/' target='_blank' rel="noopener noreferrer">PCSX2</a>, or <a className='text-blue-600 hover:underline' href='https://rpcs3.net/download' target='_blank' rel="noopener noreferrer">RPCS3</a>, and enjoy your gameplay!</p>
                                    </div>
                                    {/* Check if announcement is not empty */}
                                    {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                                </div>
                            )}

                            <DownloadSection
                                platform={data?.platform || ""}
                                downloadLinks={data?.downloadLink || []}
                            />

                            {/* Troubleshooting Section */}
                            <p className="mt-4 text-gray-200 text-sm sm:text-base">Doesn't download? Broken file? Doesn't work? Gives an error? How to update?</p>
                            <p className="text-sm text-gray-200 sm:text-base">We have collected all the answers on our <a href="https://t.me/downloadmacgames" target='_blank' rel="noopener noreferrer" className='text-cyan-600 text-base hover:underline'>Telegram Group</a>.</p>
                        </div>
                    </div>
                )}

                {/* Background image that adapts to different screen sizes */}
                <div
                    className="fixed top-0 bottom-0 right-0 left-0"
                    style={{
                        background: data?.thumbnail?.[2]
                            ? `linear-gradient(to top right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%), url('${data.thumbnail[2]}')`
                            : 'linear-gradient(to top right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        opacity: 0.4,
                        zIndex: -10,
                        pointerEvents: 'none',
                        height: '100vh',
                        maxHeight: '100vh',
                    }}
                >
                </div>

                {/* Comment box */}
                <div className='mt-8 mb-4'>
                    <CommentBox
                        scrollToCommentId={scrollToCommentId}
                        onCommentScrolled={handleCommentScrolled}
                    />
                </div>

            </div>
        </div>
    );
};

export default SingleApp;