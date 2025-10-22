import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx'; // added
import { LuAppWindowMac } from "react-icons/lu";
import CategorySkeleton from '../../skeletons/CategorySkeleton';
import EnhancedPagination from '../../Utilities/Pagination/EnhancedPagination';
import FilterBar from '../../Utilities/Filters/FilterBar';
import FilterModal from '../../Utilities/Filters/FilterModal';
import RandomGame from '../../sidePages/RandomGames/RandomGame';


// Slugify function (simplified version)
const slugify = (text = '') => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

export default function MacGames() {
    // Configuration
    const ITEMS_PER_PAGE = 48;

    // React Router hooks instead of Next.js hooks
    const location = useLocation();
    const navigate = useNavigate();

    // Parse search params manually
    const searchParams = new URLSearchParams(location.search);
    const pathname = location.pathname;

    // State
    const [data, setData] = useState([]);
    const [totalApps, setTotalApps] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPageTransitioning, setIsPageTransitioning] = useState(false);
    const [error, setError] = useState(null);
    // Use global auth state so UI updates automatically on login/logout
    const { user: userData } = useAuth();
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // Persistent filter state
    const [filters, setFilters] = useState({
        genres: [],
        filterModeAny: true,
        gameMode: 'any',
        size: '',
        year: '',
        popularity: 'all',
    });

    // Fetch data on mount and whenever filters/page changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const pageFromUrl = parseInt(params.get('page') || '1', 10);
                setCurrentPage(pageFromUrl);

                const res = await fetch(
                    `${process.env.VITE_API_URL}/api/apps/category/mac?${params.toString()}`,
                    {
                        headers: {
                            'X-Auth-Token': process.env.VITE_API_TOKEN,
                        },
                    }
                );
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                const data = await res.json();
                let games = [];
                let total = 0;
                if (data?.apps && Array.isArray(data.apps)) {
                    games = data.apps;
                    total = data.total || 0;
                } else if (data?.data && Array.isArray(data.data)) {
                    games = data.data;
                    total = data.total || 0;
                }
                setData(games);
                setTotalApps(total);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData([]);
                setTotalApps(0);
            } finally {
                setIsPageTransitioning(false);
            }
        };
        fetchData();
    }, [location.search]); // Changed dependency

    // Get loading context (if you have this in React)
    // const { showSkeleton } = useLoading();

    // Function to check if a game is new (within 2 days)
    const isGameNew = (createdAt) => {
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // 2 days ago
        const gameCreatedAt = new Date(createdAt);
        return gameCreatedAt >= twoDaysAgo;
    };

    // Helper: Map filter modal values to backend query params
    const mapFiltersToQuery = (filters) => {
        const params = new URLSearchParams(location.search);
        const GENRES = [
            { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
            // ... your genres array (same as original)
        ];
        const genreNames = filters.genres?.map(id => {
            const found = GENRES.find(g => g.id === id);
            return found ? found.name : null;
        }).filter(Boolean);
        if (genreNames && genreNames.length > 0) {
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
        params.set('page', '1');
        return params;
    };

    // Handle filter apply
    const handleApplyFilters = (filters) => {
        const params = mapFiltersToQuery(filters);
        navigate(`/category/mac/games?${params.toString()}`);
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
        navigate(`/category/mac/games?${params.toString()}`);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages || isPageTransitioning) {
            return; // Don't do anything if invalid page or already transitioning
        }
        setIsPageTransitioning(true);
        // showSkeleton('Mac'); // Uncomment if you have this context

        // Preserve all filters
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`${pathname}?${params.toString()}`);

        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(totalApps / ITEMS_PER_PAGE));

    // Safe slug generation
    const createSlug = (text = '') => {
        return slugify(text) || 'untitled';
    };

    // Helper to extract filters from URL
    const extractFiltersFromSearchParams = (params) => {
        let genres = [];
        const tags = params.get('tags');
        if (tags) {
            const GENRES = [
                { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
                // ... your genres array (same as original)
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

    // Game card component - removed prefetching since React Router doesn't have built-in prefetch
    const GameCard = ({ game = {} }) => {
        const isAdmin = userData?.role === 'ADMIN' || userData?.role === 'MOD' || userData?.role === 'PREMIUM';
        const purchasedGamesFromToken = userData?.purchasedGames || [];
        const isPurchased = purchasedGamesFromToken.includes(game._id);
        const isUnlocked = isAdmin || !game.isPaid || isPurchased;

        // Create download URL
        const downloadUrl = `/download/${createSlug(game.platform)}/${createSlug(game.title)}/${game._id}`;

        if (!isUnlocked) {
            // Locked game - render div with lock icon
            return (
                <div className="relative flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg border border-purple-600/20 opacity-90 cursor-not-allowed">
                    {/* Ambient background elements - always visible */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>
                    {/* Subtle overlay gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    {/* Lock overlay */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-20 bg-black/50">
                        <div className="bg-black/70 p-3 rounded-full border border-purple-600/30">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col rounded-xl h-full overflow-hidden">
                        <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                            <img
                                src={game.coverImg || '/default-game.png'}
                                alt={game.title || 'Game'}
                                className="w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-in-out transform hover:scale-110"
                                onError={(e) => {
                                    e.target.src = '/default-game.png';
                                    e.target.alt = 'Default game image';
                                }}
                            />
                        </figure>
                        {/* Game platform badge */}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                            <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                <LuAppWindowMac className="mr-1" />
                                Mac
                            </div>
                        </div>
                        {/* NEW badge for games within 2 days */}
                        {isGameNew(game.createdAt) && (
                            <div className="absolute top-2 right-2 z-20">
                                <div className="relative">
                                    {/* Glowing background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-75"></div>
                                    {/* Badge content */}
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
                        <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                            {/* Glowing separator line */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>
                            <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2 overflow-hidden whitespace-nowrap text-ellipsis">
                                {game.title || 'Untitled Game'}
                            </div>
                            <div className="text-xs font-normal text-gray-400 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                                {game.size || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else {
            // Unlocked game - render Link to download page
            return (
                <a
                    href={downloadUrl}
                    className="block"
                >
                    <div className="relative flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20">
                        {/* Ambient background elements - always visible */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>
                        {/* Subtle overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                        <div className="flex flex-col rounded-xl h-full overflow-hidden">
                            <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                                <img
                                    src={game.coverImg || '/default-game.png'}
                                    alt={game.title || 'Game'}
                                    className="w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-in-out transform group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = '/default-game.png';
                                        e.target.alt = 'Default game image';
                                    }}
                                />
                            </figure>
                            {/* Game platform badge */}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                    <LuAppWindowMac className="mr-1" />
                                    Mac
                                </div>
                            </div>
                            {/* NEW badge for games within 2 days */}
                            {isGameNew(game.createdAt) && (
                                <div className="absolute top-2 right-2 z-20">
                                    <div className="relative">
                                        {/* Glowing background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-75"></div>
                                        {/* Badge content */}
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
                            <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                {/* Glowing separator line */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>
                                <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                    {game.title || 'Untitled Game'}
                                </div>
                                <div className="text-xs font-normal text-gray-400 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    {game.size || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            );
        }
    };

    // Main render
    return (
        <div className="container mx-auto p-2 relative">
            <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={handleApplyFilters} initialFilters={filters} />

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>

            {/* Decorative grid lines */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iIzJkMmQyZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] bg-center opacity-40 -z-10"></div>

            {/* Header with enhanced styling */}
            <div className="cover mb-12 relative">
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Center: Heading (always centered) */}
                    <div className="w-full sm:w-auto flex justify-center">
                        <div className="relative inline-block text-center">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10"></div>
                            <h1 className="font-bold text-4xl mb-3 relative">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                    Mac Games{' '}
                                    <span className="font-medium text-blue-400">{totalApps}</span>
                                </span>
                                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                            </h1>
                        </div>
                    </div>
                    {/* Left: Filter and Clear buttons (desktop left, mobile centered below heading) */}
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

            {error ? (
                <p className="text-red-500 text-center py-12">{error}</p>
            ) : data.length === 0 ? (
                <CategorySkeleton itemCount={12} />
            ) : (
                <>
                    <div className="relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 transition-opacity duration-300 ease-in-out relative">
                            {/* Grid accent elements */}
                            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
                            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg"></div>
                            {data.map((game) => (
                                <GameCard
                                    key={game?._id || `game-${Math.random().toString(36).substring(2, 9)}`}
                                    game={game}
                                />
                            ))}
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-12 relative">
                            {/* Pagination decorative elements */}
                            <div className="absolute left-1/4 -top-8 w-24 h-24 bg-purple-600 opacity-5 rounded-full blur-2xl -z-10"></div>
                            <div className="absolute right-1/4 -top-8 w-24 h-24 bg-blue-600 opacity-5 rounded-full blur-2xl -z-10"></div>
                            <div className="relative z-10">
                                <EnhancedPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    isLoading={false}
                                />
                            </div>
                            {/* Decorative line */}
                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10"></div>
                        </div>
                    )}
                </>
            )}

            {/* Random game button - always visible at the bottom right */}
            <div className="fixed bottom-4 right-4 z-20">
                <RandomGame />
            </div>
        </div>
    );
}