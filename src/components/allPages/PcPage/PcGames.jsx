import React, { useState, useEffect } from 'react';
import CategorySkeleton from '../../skeletons/CategorySkeleton';
import EnhancedPagination from '../../Utilities/Pagination/EnhancedPagination';
import RandomGame from '../../sidePages/RandomGames/RandomGame';
import FilterBar from '../../Utilities/Filters/FilterBar';
import FilterModal from '../../Utilities/Filters/FilterModal';

function PcGames() {
    // Function to get URL search params
    const getSearchParams = () => {
        if (typeof window === 'undefined') return new URLSearchParams();
        return new URLSearchParams(window.location.search);
    };

    const searchParams = getSearchParams();
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

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
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1); // Ensure at least 1 page

    // Fetch data on mount and whenever filters/page changes
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', currentPage);
                params.set('limit', itemsPerPage);
                if (searchParams.get('tags')) params.set('tags', searchParams.get('tags'));
                if (searchParams.get('gameMode')) params.set('gameMode', searchParams.get('gameMode'));
                if (searchParams.get('sizeLimit')) params.set('sizeLimit', searchParams.get('sizeLimit'));
                if (searchParams.get('releaseYear')) params.set('releaseYear', searchParams.get('releaseYear'));
                if (searchParams.get('sortBy')) params.set('sortBy', searchParams.get('sortBy'));

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
                // ensure loading flag cleared after fetch completes (success or failure)
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    // Update current page when URL changes
    useEffect(() => {
        const params = getSearchParams();
        const page = parseInt(params.get('page') || '1', 10);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [currentPage]);

    // Helper to extract filters from URL
    const extractFiltersFromSearchParams = (params) => {
        // Genres (tags)
        let genres = [];
        const tags = params.get('tags');
        if (tags) {
            // Map genre names back to IDs
            const GENRES = [
                { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
                { id: 83, name: "Agriculture" }, { id: 33, name: "Anime" }, { id: 40, name: "Apps" }, { id: 71, name: "Arcade" },
                { id: 115, name: "Artificial Intelligence" }, { id: 129, name: "Assassin" }, { id: 60, name: "Atmospheric" },
                { id: 109, name: "Automation" }, { id: 133, name: "Blood" }, { id: 24, name: "Building" }, { id: 95, name: "Cartoon" },
                { id: 22, name: "Casual" }, { id: 107, name: "Character Customization" }, { id: 68, name: "Cinematic*" },
                { id: 106, name: "Classic" }, { id: 49, name: "Co-Op" }, { id: 108, name: "Colony Sim" }, { id: 70, name: "Colorful" },
                { id: 86, name: "Combat" }, { id: 78, name: "Comedy" }, { id: 103, name: "Comic Book" }, { id: 44, name: "Comptetitive" },
                { id: 105, name: "Controller" }, { id: 72, name: "Crafting" }, { id: 5, name: "Crime" }, { id: 59, name: "Cute" },
                { id: 67, name: "Cyberpunk" }, { id: 91, name: "Dark Humor" }, { id: 51, name: "Difficult" }, { id: 58, name: "Dragons" },
                { id: 126, name: "Driving" }, { id: 118, name: "Early Access" }, { id: 46, name: "eSport" }, { id: 125, name: "Exploration" },
                { id: 102, name: "Family Friendly" }, { id: 9, name: "Fantasy" }, { id: 79, name: "Farming Sim" }, { id: 124, name: "Fast-Paced" },
                { id: 135, name: "Female Protagonist" }, { id: 36, name: "Fighting" }, { id: 121, name: "First-Person" }, { id: 84, name: "Fishing" },
                { id: 88, name: "Flight" }, { id: 43, name: "FPS" }, { id: 64, name: "Funny" }, { id: 76, name: "Gore" },
                { id: 134, name: "Great Soundtrack" }, { id: 73, name: "Hack and Slash" }, { id: 10, name: "History" }, { id: 11, name: "Horror" },
                { id: 57, name: "Hunting" }, { id: 69, name: "Idler" }, { id: 100, name: "Illuminati" }, { id: 120, name: "Immersive Sim" },
                { id: 25, name: "Indie" }, { id: 101, name: "LEGO" }, { id: 81, name: "Life Sim" }, { id: 66, name: "Loot" },
                { id: 113, name: "Management" }, { id: 61, name: "Mature" }, { id: 96, name: "Memes" }, { id: 50, name: "Military" },
                { id: 89, name: "Modern" }, { id: 32, name: "Multiplayer" }, { id: 13, name: "Mystery" }, { id: 77, name: "Nudity" },
                { id: 26, name: "Open World" }, { id: 74, name: "Parkour" }, { id: 122, name: "Physics" }, { id: 80, name: "Pixel Graphics" },
                { id: 127, name: "Post-apocalyptic" }, { id: 35, name: "Puzzle" }, { id: 48, name: "PvP" }, { id: 28, name: "Racing" },
                { id: 53, name: "Realistic" }, { id: 82, name: "Relaxing" }, { id: 112, name: "Resource Management" }, { id: 23, name: "RPG" },
                { id: 65, name: "Sandbox" }, { id: 34, name: "Sci-fi" }, { id: 114, name: "Science" }, { id: 15, name: "Science Fiction" },
                { id: 99, name: "Sexual Content" }, { id: 31, name: "Shooters" }, { id: 21, name: "Simulation" }, { id: 93, name: "Singleplayer" },
                { id: 29, name: "Sports" }, { id: 38, name: "Stealth Game" }, { id: 97, name: "Story Rich" }, { id: 27, name: "Strategy" },
                { id: 92, name: "Superhero" }, { id: 117, name: "Surreal" }, { id: 37, name: "Survival" }, { id: 47, name: "Tactical" },
                { id: 87, name: "Tanks" }, { id: 45, name: "Team-Based" }, { id: 104, name: "Third Person" }, { id: 54, name: "Third-Person-Shooter" },
                { id: 17, name: "Thriller" }, { id: 56, name: "Tower Defense" }, { id: 52, name: "Trading" }, { id: 94, name: "Turn-Based" },
                { id: 111, name: "Underwater" }, { id: 41, name: "Utilities" }, { id: 75, name: "Violent" }, { id: 20, name: "VR" },
                { id: 18, name: "War" }, { id: 123, name: "Wargame" }, { id: 119, name: "Zombie" }
            ];
            const tagNames = tags.split(',');
            genres = tagNames.map(name => {
                const found = GENRES.find(g => g.name === name);
                return found ? found.id : null;
            }).filter(Boolean);
        }
        // Game mode
        let gameMode = params.get('gameMode');
        if (gameMode === 'Singleplayer') gameMode = 'single';
        else if (gameMode === 'Multiplayer') gameMode = 'multi';
        else gameMode = 'any';
        // Size
        const size = params.get('sizeLimit') || '';
        // Year
        const year = params.get('releaseYear') || '';
        // Popularity
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
            filterModeAny: true, // You can persist this if you want
            gameMode,
            size,
            year,
            popularity,
        };
    };

    // Sync filters state with URL
    useEffect(() => {
        setFilters(extractFiltersFromSearchParams(searchParams));
        // eslint-disable-next-line
    }, []);

    const handlePageChange = (newPage) => {
        // Validate page range
        const validPage = Math.max(1, Math.min(newPage, totalPages));
        // Preserve all current filters and sortBy
        const params = new URLSearchParams(window.location.search);
        params.set('page', validPage);
        window.history.pushState({}, '', `?${params.toString()}`);
        setCurrentPage(validPage);
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
        const params = new URLSearchParams(window.location.search);
        // Genres: convert selected genre IDs to names, then comma-separated
        if (filters.genres && filters.genres.length > 0) {
            // Find genre names from GENRES (copy from FilterModal)
            const GENRES = [
                { id: 42, name: "2D" }, { id: 85, name: "3D" }, { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
                { id: 83, name: "Agriculture" }, { id: 33, name: "Anime" }, { id: 40, name: "Apps" }, { id: 71, name: "Arcade" },
                { id: 115, name: "Artificial Intelligence" }, { id: 129, name: "Assassin" }, { id: 60, name: "Atmospheric" },
                { id: 109, name: "Automation" }, { id: 133, name: "Blood" }, { id: 24, name: "Building" }, { id: 95, name: "Cartoon" },
                { id: 22, name: "Casual" }, { id: 107, name: "Character Customization" }, { id: 68, name: "Cinematic*" },
                { id: 106, name: "Classic" }, { id: 49, name: "Co-Op" }, { id: 108, name: "Colony Sim" }, { id: 70, name: "Colorful" },
                { id: 86, name: "Combat" }, { id: 78, name: "Comedy" }, { id: 103, name: "Comic Book" }, { id: 44, name: "Comptetitive" },
                { id: 105, name: "Controller" }, { id: 72, name: "Crafting" }, { id: 5, name: "Crime" }, { id: 59, name: "Cute" },
                { id: 67, name: "Cyberpunk" }, { id: 91, name: "Dark Humor" }, { id: 51, name: "Difficult" }, { id: 58, name: "Dragons" },
                { id: 126, name: "Driving" }, { id: 118, name: "Early Access" }, { id: 46, name: "eSport" }, { id: 125, name: "Exploration" },
                { id: 102, name: "Family Friendly" }, { id: 9, name: "Fantasy" }, { id: 79, name: "Farming Sim" }, { id: 124, name: "Fast-Paced" },
                { id: 135, name: "Female Protagonist" }, { id: 36, name: "Fighting" }, { id: 121, name: "First-Person" }, { id: 84, name: "Fishing" },
                { id: 88, name: "Flight" }, { id: 43, name: "FPS" }, { id: 64, name: "Funny" }, { id: 76, name: "Gore" },
                { id: 134, name: "Great Soundtrack" }, { id: 73, name: "Hack and Slash" }, { id: 10, name: "History" }, { id: 11, name: "Horror" },
                { id: 57, name: "Hunting" }, { id: 69, name: "Idler" }, { id: 100, name: "Illuminati" }, { id: 120, name: "Immersive Sim" },
                { id: 25, name: "Indie" }, { id: 101, name: "LEGO" }, { id: 81, name: "Life Sim" }, { id: 66, name: "Loot" },
                { id: 113, name: "Management" }, { id: 61, name: "Mature" }, { id: 96, name: "Memes" }, { id: 50, name: "Military" },
                { id: 89, name: "Modern" }, { id: 32, name: "Multiplayer" }, { id: 13, name: "Mystery" }, { id: 77, name: "Nudity" },
                { id: 26, name: "Open World" }, { id: 74, name: "Parkour" }, { id: 122, name: "Physics" }, { id: 80, name: "Pixel Graphics" },
                { id: 127, name: "Post-apocalyptic" }, { id: 35, name: "Puzzle" }, { id: 48, name: "PvP" }, { id: 28, name: "Racing" },
                { id: 53, name: "Realistic" }, { id: 82, name: "Relaxing" }, { id: 112, name: "Resource Management" }, { id: 23, name: "RPG" },
                { id: 65, name: "Sandbox" }, { id: 34, name: "Sci-fi" }, { id: 114, name: "Science" }, { id: 15, name: "Science Fiction" },
                { id: 99, name: "Sexual Content" }, { id: 31, name: "Shooters" }, { id: 21, name: "Simulation" }, { id: 93, name: "Singleplayer" },
                { id: 29, name: "Sports" }, { id: 38, name: "Stealth Game" }, { id: 97, name: "Story Rich" }, { id: 27, name: "Strategy" },
                { id: 92, name: "Superhero" }, { id: 117, name: "Surreal" }, { id: 37, name: "Survival" }, { id: 47, name: "Tactical" },
                { id: 87, name: "Tanks" }, { id: 45, name: "Team-Based" }, { id: 104, name: "Third Person" }, { id: 54, name: "Third-Person-Shooter" },
                { id: 17, name: "Thriller" }, { id: 56, name: "Tower Defense" }, { id: 52, name: "Trading" }, { id: 94, name: "Turn-Based" },
                { id: 111, name: "Underwater" }, { id: 41, name: "Utilities" }, { id: 75, name: "Violent" }, { id: 20, name: "VR" },
                { id: 18, name: "War" }, { id: 123, name: "Wargame" }, { id: 119, name: "Zombie" }
            ];
            const genreNames = filters.genres.map(id => {
                const found = GENRES.find(g => g.id === id);
                return found ? found.name : null;
            }).filter(Boolean);
            params.set('tags', genreNames.join(','));
        } else {
            params.delete('tags');
        }
        // Game mode
        if (filters.gameMode && filters.gameMode !== 'any') {
            params.set('gameMode', filters.gameMode === 'single' ? 'Singleplayer' : 'Multiplayer');
        } else {
            params.delete('gameMode');
        }
        // Size
        if (filters.size) {
            params.set('sizeLimit', filters.size);
        } else {
            params.delete('sizeLimit');
        }
        // Year
        if (filters.year) {
            params.set('releaseYear', filters.year);
        } else {
            params.delete('releaseYear');
        }
        // Popularity/sort
        if (filters.popularity && filters.popularity !== 'all') {
            let sortBy = 'newest'; // default fallback

            switch (filters.popularity) {
                case 'popular':
                    sortBy = 'popular';
                    break;
                case 'relevance':
                    sortBy = 'relevance';
                    break;
                case 'sizeAsc':
                    sortBy = 'sizeAsc';
                    break;
                case 'sizeDesc':
                    sortBy = 'sizeDesc';
                    break;
                case 'oldest':
                    sortBy = 'oldest';
                    break;
                case 'newest':
                    sortBy = 'newest';
                    break;
                default:
                    sortBy = 'newest'; // fallback safety
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
        // Always reset to page 1 on filter change
        params.set('page', '1');
        window.history.pushState({}, '', `?${params.toString()}`);
        setCurrentPage(1);
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
        const params = new URLSearchParams(window.location.search);
        ['tags', 'gameMode', 'sizeLimit', 'releaseYear', 'sortBy'].forEach(key => params.delete(key));
        params.set('page', '1');
        window.history.pushState({}, '', `?${params.toString()}`);
        setCurrentPage(1);
    };

    return (
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
                            className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                        >
                            {/* Ambient background elements */}
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                            {/* Subtle overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>

                            <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                                <img
                                    src={ele.coverImg}
                                    alt={ele.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                    }}
                                    className="w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-in-out transform group-hover:scale-110"
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
                            isLoading={false}
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
    );
}

export default PcGames;