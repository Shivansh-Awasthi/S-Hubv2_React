import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CategorySkeleton from '../../skeletons/CategorySkeleton';
import EnhancedPagination from '../../Utilities/Pagination/EnhancedPagination';
import RandomGame from '../../sidePages/RandomGames/RandomGame';
import FilterBar from '../../Utilities/Filters/FilterBar';
import FilterModal from '../../Utilities/Filters/FilterModal';

function PcGames() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // Add user authentication state
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                setIsAuthenticated(true);
                setUser(JSON.parse(userData));
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();
        // Listen for auth changes
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    // Function to check if a game is new (within 2 days) with validation
    const isGameNew = (createdAt) => {
        if (!createdAt) return false;
        const now = new Date();
        const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
        const gameDate = new Date(createdAt);
        return !isNaN(gameDate) && gameDate >= twoDaysAgo;
    };

    // Client-side state
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [totalItems, setTotalItems] = useState(0);
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // Add persistent filter state
    const [filters, setFilters] = useState({
        genres: [],
        filterModeAny: true,
        gameMode: 'any',
        size: '',
        year: '',
        popularity: 'all',
    });

    // Track fetching state so we can show skeleton during page changes
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 48;
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);

    // Fetch data on mount and whenever filters/page changes
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const params = new URLSearchParams(location.search);

                // Ensure page and limit are set
                if (!params.get('page')) params.set('page', currentPage.toString());
                params.set('limit', itemsPerPage.toString());

                const res = await fetch(
                    `${process.env.VITE_API_URL}/api/apps/category/pc?${params.toString()}`,
                    {
                        headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN },
                    }
                );
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                const json = await res.json();
                setData(json.apps || []);
                setTotalItems(json.total || 0);
            } catch (err) {
                setError('Failed to load data: ' + err.message);
                setData([]);
                setTotalItems(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [location.search]);

    // Update current page when URL changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page') || '1', 10);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [location.search, currentPage]);

    // Helper to extract filters from URL
    const extractFiltersFromSearchParams = (params) => {
        // ... (keep your existing extractFiltersFromSearchParams function as is)
        let genres = [];
        const tags = params.get('tags');
        if (tags) {
            const GENRES = [
                { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
                // ... (keep all your existing genres)
            ];
            const tagNames = tags.split(',');
            genres = tagNames.map(name => {
                const found = GENRES.find(g => g.name === name);
                return found ? found.id : null;
            }).filter(Boolean);
        }

        let gameMode = params.get('gameMode');
        if (gameMode === 'Singleplayer') gameMode = 'single';
        else if (gameMode === 'Multiplayer') gameMode = 'multi';
        else gameMode = 'any';

        const size = params.get('sizeLimit') || '';
        const year = params.get('releaseYear') || '';

        let popularity = 'all';
        const sortBy = params.get('sortBy');
        if (sortBy) {
            switch (sortBy) {
                case 'popular': popularity = 'popular'; break;
                case 'relevance': popularity = 'relevance'; break;
                case 'sizeAsc': popularity = 'sizeAsc'; break;
                case 'sizeDesc': popularity = 'sizeDesc'; break;
                case 'oldest': popularity = 'oldest'; break;
                case 'newest': popularity = 'newest'; break;
                default: popularity = 'all';
            }
        }

        return {
            genres,
            filterModeAny: true,
            gameMode,
            size,
            year,
            popularity,
        };
    };

    // Sync filters state with URL
    useEffect(() => {
        setFilters(extractFiltersFromSearchParams(searchParams));
    }, [location.search]);

    const handlePageChange = (newPage) => {
        const validPage = Math.max(1, Math.min(newPage, totalPages));
        const params = new URLSearchParams(location.search);
        params.set('page', validPage);
        navigate(`?${params.toString()}`);
    };

    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    };

    // Helper: Map filter modal values to backend query params
    const mapFiltersToQuery = (filters) => {
        // ... (keep your existing mapFiltersToQuery function as is)
        const params = new URLSearchParams(location.search);

        if (filters.genres && filters.genres.length > 0) {
            const GENRES = [
                { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
                // ... (keep all your existing genres)
            ];
            const genreNames = filters.genres.map(id => {
                const found = GENRES.find(g => g.id === id);
                return found ? found.name : null;
            }).filter(Boolean);
            params.set('tags', genreNames.join(','));
        } else {
            params.delete('tags');
        }

        if (filters.gameMode && filters.gameMode !== 'any') {
            params.set('gameMode', filters.gameMode === 'single' ? 'Singleplayer' : 'Multiplayer');
        } else {
            params.delete('gameMode');
        }

        if (filters.size) {
            params.set('sizeLimit', filters.size);
        } else {
            params.delete('sizeLimit');
        }

        if (filters.year) {
            params.set('releaseYear', filters.year);
        } else {
            params.delete('releaseYear');
        }

        if (filters.popularity && filters.popularity !== 'all') {
            let sortBy = 'newest';
            switch (filters.popularity) {
                case 'popular': sortBy = 'popular'; break;
                case 'relevance': sortBy = 'relevance'; break;
                case 'sizeAsc': sortBy = 'sizeAsc'; break;
                case 'sizeDesc': sortBy = 'sizeDesc'; break;
                case 'oldest': sortBy = 'oldest'; break;
                case 'newest': sortBy = 'newest'; break;
                default: sortBy = 'newest';
            }
            params.set('sortBy', sortBy);
        } else {
            params.delete('sortBy');
        }

        return params;
    }

    // Handle filter apply
    const handleApplyFilters = (filters) => {
        const params = mapFiltersToQuery(filters);
        params.set('page', '1');
        setIsLoading(true);
        navigate(`?${params.toString()}`);
        setFilterModalOpen(false);
    };

    // Count active filters for badge
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.genres && filters.genres.length > 0) count++;
        if (filters.gameMode && filters.gameMode !== 'any') count++;
        if (filters.size) count++;
        if (filters.year) count++;
        if (filters.popularity && filters.popularity !== 'all') count++;
        return count;
    };

    // Check if any filter is active
    const isFilterActive = () => {
        const keys = ['tags', 'gameMode', 'sizeLimit', 'releaseYear', 'sortBy'];
        return keys.some(key => searchParams.get(key));
    };

    // Clear all filters
    const handleClearFilters = () => {
        const params = new URLSearchParams(location.search);
        ['tags', 'gameMode', 'sizeLimit', 'releaseYear', 'sortBy'].forEach(key => params.delete(key));
        params.set('page', '1');
        setIsLoading(true);
        navigate(`?${params.toString()}`);
    };

    // Handle game card click - redirect to appropriate route based on auth and game type
    const handleGameClick = (ele, e) => {
        // If copyrighted and not authenticated, redirect to login
        if (ele.copyrighted && !isAuthenticated) {
            e.preventDefault();
            return;
        }

        // If paid and authenticated, use paid protected route
        if (ele.isPaid && isAuthenticated) {
            e.preventDefault();
            navigate(`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}/protected`);
            return;
        }

        // For free games or unauthenticated users (except copyrighted), use normal route
        // Let the default link behavior handle it
    };

    return (
        <div>
            <title>Download Pre-Installed PC Games for Free | ToxicGames</title>
            <meta
                name="description"
                content="Explore and download all the best PC games for free from ToxicGames. Full games, Pre-Installed , and more for PC."
            />
            <link rel="canonical" href="https://toxicgames.in/category/pc/games" />

            <meta property="og:title" content={`Download PC Games Free | ToxicGames`} />
            <meta property="og:description" content={`Explore and download all the best PC games for free from ToxicGames. Full games, Pre-Installed, and more for PC.`} />
            <meta property="og:image" content="https://i.postimg.cc/KcVfdJrH/image-removebg-preview-removebg-preview.png" />
            <meta property="og:url" content={`https://toxicgames.in/category/pc/games`} />
            <meta property="og:type" content="website" />

            <div className="container mx-auto p-2 relative">
                {/* Heading and filter/clear buttons layout */}
                <div className="cover mb-12 relative">
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Centered heading */}
                        <div className="w-full sm:w-auto flex justify-center">
                            <div className="relative inline-block text-center">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10"></div>
                                <h1 className="font-bold text-4xl mb-3 relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        PC Games{' '}
                                        <span className="font-medium text-blue-400">{totalItems}</span>
                                    </span>
                                    <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                                </h1>
                            </div>
                        </div>
                        {/* Filter and clear buttons */}
                        <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                            <FilterBar onOpenFilters={() => setFilterModalOpen(true)} filtersActiveCount={getActiveFilterCount()} />
                            {isFilterActive() && (
                                <button
                                    onClick={handleClearFilters}
                                    className="group relative px-4 py-2 rounded-xl bg-white dark:bg-gray-900 text-red-500 border border-red-200/50 dark:border-red-700/50 hover:border-red-500/50 dark:hover:border-red-500/50 shadow-sm hover:shadow transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-xl bg-red-500/5 dark:bg-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-2 font-medium">
                                        Clear Filters
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Filter Modal */}
                <FilterModal
                    open={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    onApply={handleApplyFilters}
                    initialFilters={filters}
                />

                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>

                {/* Decorative grid lines */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iIzJkMmQyZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] bg-center opacity-40 -z-10"></div>

                {/* Content: Loading, Error, No Data, or Data Grid */}
                {isLoading ? (
                    <CategorySkeleton itemCount={12} />
                ) : error ? (
                    <p className="text-red-500 text-center py-12">{error}</p>
                ) : data.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No games found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 relative">
                        {/* Grid accent elements */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
                        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg"></div>
                        {data.map((ele) => (
                            <a
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                onClick={(e) => handleGameClick(ele, e)}
                                className={`group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border relative ${(ele.isPaid || ele.copyrighted) && !isAuthenticated
                                    ? 'border-red-500/30 cursor-not-allowed'
                                    : 'border-purple-600/20'
                                    }`}
                            >
                                {/* Ambient background elements */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                {/* Subtle overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>

                                {/* Lock overlay for paid/copyrighted games when not authenticated */}
                                {(ele.isPaid || ele.copyrighted) && !isAuthenticated && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl z-20 flex flex-col items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-red-400"
                                        >
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        <span className="text-white font-medium text-sm text-center px-2">
                                            {ele.copyrighted ? "Copyright Claim" : "Premium Game"}
                                        </span>
                                        <span className="text-gray-300 text-xs text-center px-4">
                                            {ele.copyrighted
                                                ? "Login to access copyrighted content"
                                                : "Login to access premium content"
                                            }
                                        </span>
                                    </div>
                                )}

                                <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                                    <img
                                        src={ele.coverImg}
                                        alt={ele.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-game.png';
                                        }}
                                        className={`w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-in-out transform ${(ele.isPaid || ele.copyrighted) && !isAuthenticated
                                            ? ''
                                            : 'group-hover:scale-110'
                                            }`}
                                    />
                                </figure>

                                {/* Game platform badge */}
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                    <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                            <rect width="14" height="8" x="5" y="2" rx="2" />
                                            <rect width="20" height="8" x="2" y="14" rx="2" />
                                            <path d="M6 18h2" />
                                            <path d="M12 18h6" />
                                        </svg>
                                        PC
                                    </div>
                                </div>

                                {/* NEW badge */}
                                {isGameNew(ele.createdAt) && (
                                    <div className="absolute top-2 right-2 z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-75"></div>
                                            <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-full border border-green-400/50 shadow-lg">
                                                <div className="flex items-center">
                                                    <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    NEW
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Copyright/Premium indicator badge (always visible) */}
                                {(ele.copyrighted || ele.isPaid) && (
                                    <div className={`absolute top-10 right-2 z-20 ${ele.copyrighted ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-purple-500/20 border-purple-500/50'
                                        } backdrop-blur-sm px-2 py-1 rounded-md border`}>
                                        <div className={`text-[8px] font-medium flex items-center ${ele.copyrighted ? 'text-yellow-400' : 'text-purple-400'
                                            }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                            {ele.copyrighted ? "Copyright" : "Premium"}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs font-normal text-gray-400 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            </svg>
                                            {ele.size}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Enhanced Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 relative">
                        <div className="absolute left-1/4 -top-8 w-24 h-24 bg-purple-600 opacity-5 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute right-1/4 -top-8 w-24 h-24 bg-blue-600 opacity-5 rounded-full blur-2xl -z-10"></div>

                        <div className="relative z-10">
                            <EnhancedPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </div>

                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10"></div>
                    </div>
                )}

                {/* Random game button */}
                <div className="fixed bottom-4 right-4 z-20">
                    <RandomGame platform='pc' />
                </div>
            </div>
        </div>
    );
}

export default PcGames;