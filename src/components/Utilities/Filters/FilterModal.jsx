import React, { useState, useMemo, useEffect } from "react";

// All genres, years, publishers, etc. as per your HTML (truncated for brevity, but you can expand as needed)
const GENRES = [
    { id: 42, name: "2D" },
    { id: 85, name: "3D" },
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 83, name: "Agriculture" },
    { id: 33, name: "Anime" },
    { id: 40, name: "Apps" },
    { id: 71, name: "Arcade" },
    { id: 115, name: "Artificial Intelligence" },
    { id: 129, name: "Assassin" },
    { id: 60, name: "Atmospheric" },
    { id: 109, name: "Automation" },
    { id: 133, name: "Blood" },
    { id: 24, name: "Building" },
    { id: 95, name: "Cartoon" },
    { id: 22, name: "Casual" },
    { id: 107, name: "Character Customization" },
    { id: 68, name: "Cinematic*" },
    { id: 106, name: "Classic" },
    { id: 49, name: "Co-Op" },
    { id: 108, name: "Colony Sim" },
    { id: 70, name: "Colorful" },
    { id: 86, name: "Combat" },
    { id: 78, name: "Comedy" },
    { id: 103, name: "Comic Book" },
    { id: 44, name: "Comptetitive" },
    { id: 105, name: "Controller" },
    { id: 72, name: "Crafting" },
    { id: 5, name: "Crime" },
    { id: 59, name: "Cute" },
    { id: 67, name: "Cyberpunk" },
    { id: 91, name: "Dark Humor" },
    { id: 51, name: "Difficult" },
    { id: 58, name: "Dragons" },
    { id: 126, name: "Driving" },
    { id: 118, name: "Early Access" },
    { id: 46, name: "eSport" },
    { id: 125, name: "Exploration" },
    { id: 102, name: "Family Friendly" },
    { id: 9, name: "Fantasy" },
    { id: 79, name: "Farming Sim" },
    { id: 124, name: "Fast-Paced" },
    { id: 135, name: "Female Protagonist" },
    { id: 36, name: "Fighting" },
    { id: 121, name: "First-Person" },
    { id: 84, name: "Fishing" },
    { id: 88, name: "Flight" },
    { id: 43, name: "FPS" },
    { id: 64, name: "Funny" },
    { id: 76, name: "Gore" },
    { id: 134, name: "Great Soundtrack" },
    { id: 73, name: "Hack and Slash" },
    { id: 10, name: "History" },
    { id: 11, name: "Horror" },
    { id: 57, name: "Hunting" },
    { id: 69, name: "Idler" },
    { id: 100, name: "Illuminati" },
    { id: 120, name: "Immersive Sim" },
    { id: 25, name: "Indie" },
    { id: 101, name: "LEGO" },
    { id: 81, name: "Life Sim" },
    { id: 66, name: "Loot" },
    { id: 113, name: "Management" },
    { id: 61, name: "Mature" },
    { id: 96, name: "Memes" },
    { id: 50, name: "Military" },
    { id: 89, name: "Modern" },
    { id: 32, name: "Multiplayer" },
    { id: 13, name: "Mystery" },
    { id: 77, name: "Nudity" },
    { id: 26, name: "Open World" },
    { id: 74, name: "Parkour" },
    { id: 122, name: "Physics" },
    { id: 80, name: "Pixel Graphics" },
    { id: 127, name: "Post-apocalyptic" },
    { id: 35, name: "Puzzle" },
    { id: 48, name: "PvP" },
    { id: 28, name: "Racing" },
    { id: 53, name: "Realistic" },
    { id: 82, name: "Relaxing" },
    { id: 112, name: "Resource Management" },
    { id: 23, name: "RPG" },
    { id: 65, name: "Sandbox" },
    { id: 34, name: "Sci-fi" },
    { id: 114, name: "Science" },
    { id: 15, name: "Science Fiction" },
    { id: 99, name: "Sexual Content" },
    { id: 31, name: "Shooters" },
    { id: 21, name: "Simulation" },
    { id: 93, name: "Singleplayer" },
    { id: 29, name: "Sports" },
    { id: 38, name: "Stealth Game" },
    { id: 97, name: "Story Rich" },
    { id: 27, name: "Strategy" },
    { id: 92, name: "Superhero" },
    { id: 117, name: "Surreal" },
    { id: 37, name: "Survival" },
    { id: 47, name: "Tactical" },
    { id: 87, name: "Tanks" },
    { id: 45, name: "Team-Based" },
    { id: 104, name: "Third Person" },
    { id: 54, name: "Third-Person-Shooter" },
    { id: 17, name: "Thriller" },
    { id: 56, name: "Tower Defense" },
    { id: 52, name: "Trading" },
    { id: 94, name: "Turn-Based" },
    { id: 111, name: "Underwater" },
    { id: 41, name: "Utilities" },
    { id: 75, name: "Violent" },
    { id: 20, name: "VR" },
    { id: 18, name: "War" },
    { id: 123, name: "Wargame" },
    { id: 119, name: "Zombie" },
];

const GAME_MODES = [
    { id: "any", label: "Any Mode" },
    { id: "single", label: "Single Player" },
    { id: "multi", label: "Multiplayer" },
];

const SIZE_RANGES = [
    { id: "", label: "All Sizes" },
    { id: "0-1", label: "0 - 1 GB" },
    { id: "1-5", label: "1 - 5 GB" },
    { id: "5-10", label: "5 - 10 GB" },
    { id: "10-20", label: "10 - 20 GB" },
    { id: "20-30", label: "20 - 30 GB" },
    { id: "30-40", label: "30 - 40 GB" },
    { id: "40-50", label: "40 - 50 GB" },
    { id: "50-60", label: "50 - 60 GB" },
    { id: "60-70", label: "60 - 70 GB" },
    { id: "70-80", label: "70 - 80 GB" },
    { id: "80-90", label: "80 - 90 GB" },
    { id: "90+", label: "90 GB & Above" },
];

const YEARS = [
    "",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
    "1998",
    "1997",
    "1995",
];

const POPULARITY = [
    { id: "all", label: "All Games" },
    { id: "popular", label: "Popularity" },
    { id: "relevance", label: "Relevance" },
    { id: "sizeAsc", label: "Size: Smallest First" },
    { id: "sizeDesc", label: "Size: Largest First" },
    { id: "oldest", label: "Oldest" },
    { id: "newest", label: "Newest" },
];

const FilterModal = ({ open, onClose, onApply, initialFilters }) => {
    const [genreSearch, setGenreSearch] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [filterModeAny, setFilterModeAny] = useState(true);
    const [selectedGameMode, setSelectedGameMode] = useState("any");
    const [selectedSizeRange, setSelectedSizeRange] = useState("");
    const [yearSearch, setYearSearch] = useState("");
    const [selectedReleaseYear, setSelectedReleaseYear] = useState("");
    const [selectedPopularity, setSelectedPopularity] = useState("all");

    // Filtered lists
    const filteredGenres = useMemo(
        () =>
            GENRES.filter((g) =>
                g.name.toLowerCase().includes(genreSearch.toLowerCase())
            ),
        [genreSearch]
    );
    const filteredYears = useMemo(
        () => YEARS.filter((y) => y === "" || y.includes(yearSearch)),
        [yearSearch]
    );

    // Color palette for badges
    const BADGE_COLORS = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-indigo-500",
        "bg-teal-500",
    ];

    // Active filters summary (with type info for removal)
    const activeFilters = [];
    selectedGenres.forEach((id) => {
        const genre = GENRES.find((g) => g.id === id);
        if (genre) activeFilters.push({ type: "genre", id, label: genre.name });
    });
    if (selectedGameMode !== "any")
        activeFilters.push({
            type: "gameMode",
            id: selectedGameMode,
            label: GAME_MODES.find((m) => m.id === selectedGameMode)?.label,
        });
    if (selectedSizeRange)
        activeFilters.push({
            type: "size",
            id: selectedSizeRange,
            label: SIZE_RANGES.find((s) => s.id === selectedSizeRange)?.label,
        });
    if (selectedReleaseYear)
        activeFilters.push({ type: "year", id: selectedReleaseYear, label: selectedReleaseYear });
    if (selectedPopularity !== "all")
        activeFilters.push({
            type: "popularity",
            id: selectedPopularity,
            label: POPULARITY.find((p) => p.id === selectedPopularity)?.label,
        });

    // Remove filter handler
    const handleRemoveFilter = (filter) => {
        if (filter.type === "genre") {
            setSelectedGenres((prev) => prev.filter((id) => id !== filter.id));
        } else if (filter.type === "gameMode") {
            setSelectedGameMode("any");
        } else if (filter.type === "size") {
            setSelectedSizeRange("");
        } else if (filter.type === "year") {
            setSelectedReleaseYear("");
        } else if (filter.type === "popularity") {
            setSelectedPopularity("all");
        }
    };

    const handleApply = () => {
        // Only return selected values
        onApply({
            genres: selectedGenres,
            filterModeAny,
            gameMode: selectedGameMode,
            size: selectedSizeRange,
            year: selectedReleaseYear,
            popularity: selectedPopularity,
        });
        onClose();
    };

    // Sync local state with initialFilters when modal opens
    useEffect(() => {
        if (open && initialFilters) {
            setSelectedGenres(initialFilters.genres || []);
            setSelectedGameMode(initialFilters.gameMode || "any");
            setSelectedSizeRange(initialFilters.size || "");
            setSelectedReleaseYear(initialFilters.year || "");
            setSelectedPopularity(initialFilters.popularity || "all");
            setFilterModeAny(
                initialFilters.filterModeAny !== undefined
                    ? initialFilters.filterModeAny
                    : true
            );
        }
    }, [open, initialFilters]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Game Filters
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin max-h-[80vh]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleApply();
                        }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                                {/* Genre Filter */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        Genres
                                    </h3>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={genreSearch}
                                            onChange={(e) => setGenreSearch(e.target.value)}
                                            placeholder="Search genres..."
                                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {filteredGenres.map((g) => (
                                                <div key={g.id} className="genre-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`genre${g.id}`}
                                                        className="hidden peer"
                                                        checked={selectedGenres.includes(g.id)}
                                                        onChange={(e) =>
                                                            setSelectedGenres((prev) =>
                                                                e.target.checked
                                                                    ? [...prev, g.id]
                                                                    : prev.filter((id) => id !== g.id)
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`genre${g.id}`}
                                                        className={`flex w-full px-3 py-2 text-sm rounded-lg cursor-pointer border transition-all duration-200
    ${selectedGenres.includes(g.id)
                                                                ? `${BADGE_COLORS[0]} text-white border-blue-500 shadow-md scale-105`
                                                                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                    >
                                                        <span className="truncate">{g.name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Filter Mode Toggle */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Relaxed Filtering: Match ANY selected genre
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFilterModeAny((v) => !v)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${filterModeAny
                                                ? "bg-primary"
                                                : "bg-gray-300 dark:bg-gray-600"
                                                } transition-colors duration-300`}
                                        >
                                            <span className="sr-only">Toggle filter mode</span>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${filterModeAny
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                    }`}
                                            ></span>
                                        </button>
                                    </div>
                                </div>

                                {/* Size Filter */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2 text-primary"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                                                />
                                            </svg>
                                            Game Size
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {SIZE_RANGES.map((s) => (
                                            <div key={s.id}>
                                                <input
                                                    type="radio"
                                                    id={`size${s.id}`}
                                                    name="size"
                                                    value={s.id}
                                                    className="hidden peer"
                                                    checked={selectedSizeRange === s.id}
                                                    onChange={() => setSelectedSizeRange(s.id)}
                                                />
                                                <label
                                                    htmlFor={`size${s.id}`}
                                                    className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg cursor-pointer border transition-all duration-200
    ${selectedSizeRange === s.id
                                                            ? `${BADGE_COLORS[1]} text-white border-purple-500 shadow-md scale-105`
                                                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <span>{s.label}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="space-y-8">
                                {/* Release Year Filter */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2 text-primary"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Release Year
                                        </h3>
                                    </div>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={yearSearch}
                                            onChange={(e) => setYearSearch(e.target.value)}
                                            placeholder="Search year..."
                                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                            {filteredYears.map((y) => (
                                                <div key={y} className="year-item">
                                                    <input
                                                        type="radio"
                                                        id={`year${y || "All"}`}
                                                        name="year"
                                                        value={y}
                                                        className="hidden peer"
                                                        checked={selectedReleaseYear === y}
                                                        onChange={() => setSelectedReleaseYear(y)}
                                                    />
                                                    <label
                                                        htmlFor={`year${y || "All"}`}
                                                        className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg cursor-pointer border transition-all duration-200
    ${selectedReleaseYear === y
                                                                ? `${BADGE_COLORS[2]} text-white border-pink-500 shadow-md scale-105`
                                                                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                    >
                                                        <span>{y === "" ? "All" : y}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Popular Sorting */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                        Sort by
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {POPULARITY.map((p) => (
                                            <div key={p.id}>
                                                <input
                                                    type="radio"
                                                    id={`download${p.id}`}
                                                    name="download"
                                                    value={p.id}
                                                    className="hidden peer"
                                                    checked={selectedPopularity === p.id}
                                                    onChange={() => setSelectedPopularity(p.id)}
                                                />
                                                <label
                                                    htmlFor={`download${p.id}`}
                                                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm cursor-pointer border transition-all duration-200
    ${selectedPopularity === p.id
                                                            ? `${BADGE_COLORS[3]} text-white border-green-500 shadow-md scale-105`
                                                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <span>{p.label}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Game Mode Filter */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                            />
                                        </svg>
                                        Game Mode
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {GAME_MODES.map((m) => (
                                            <div key={m.id}>
                                                <input
                                                    type="radio"
                                                    id={`mode${m.id}`}
                                                    name="mode"
                                                    value={m.id}
                                                    className="hidden peer"
                                                    checked={selectedGameMode === m.id}
                                                    onChange={() => setSelectedGameMode(m.id)}
                                                />
                                                <label
                                                    htmlFor={`mode${m.id}`}
                                                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm cursor-pointer border transition-all duration-200
    ${selectedGameMode === m.id
                                                            ? `${BADGE_COLORS[4]} text-white border-yellow-500 shadow-md scale-105`
                                                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <span>{m.label}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Current Filters Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Active Filters
                                </h4>
                                {activeFilters.length > 0 && (
                                    <button
                                        type="button"
                                        className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-all"
                                        onClick={() => {
                                            setSelectedGenres([]);
                                            setSelectedGameMode("any");
                                            setSelectedSizeRange("");
                                            setSelectedReleaseYear("");
                                            setSelectedPopularity("all");
                                        }}
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.length === 0 ? (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        No active filters
                                    </span>
                                ) : (
                                    activeFilters.map((f, i) => (
                                        <span
                                            key={f.type + f.id}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sm ${BADGE_COLORS[i % BADGE_COLORS.length]} animate-fade-in`}
                                        >
                                            {f.label}
                                            <button
                                                type="button"
                                                className="ml-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                                                aria-label={`Remove ${f.label}`}
                                                onClick={() => handleRemoveFilter(f)}
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l8 8M6 14L14 6" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 scale-100 hover:scale-102 active:scale-95"
                            >
                                <span>Apply Filters</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
