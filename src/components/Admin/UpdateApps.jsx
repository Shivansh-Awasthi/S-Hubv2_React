import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
// Remove jwtDecode import since we'll use API verification

const UpdateApps = () => {
    const navigate = useNavigate();
    const params = useParams();
    const appId = params.id;
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true); // Add loading state for admin check
    const [appData, setAppData] = useState(null);
    const [updating, setUpdating] = useState(false); // Loader for update button

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("");
    const [architecture, setArchitecture] = useState("Native");
    const [tags, setTags] = useState([]);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState("0");
    const [thumbnail, setThumbnail] = useState([""]); // Start with 1 empty input
    const [downloadLink, setDownloadLinks] = useState(["", "", "", "", "", ""]);
    const [size, setSize] = useState("");
    const [unit, setUnit] = useState('MB');
    const [category, setCategory] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [systemRequirements, setSystemRequirements] = useState({
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        additionalNotes: ""
    });
    const [gameMode, setGameMode] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [showTagSelector, setShowTagSelector] = useState(false);

    // For dynamic thumbnail input blocks (up to 20)
    const MAX_THUMBNAILS = 20;

    const apiUrl = import.meta.env.VITE_API_URL;
    const apiAuthToken = import.meta.env.VITE_API_TOKEN;

    // ✅ Get token once
    const token = localStorage.getItem('token');

    // Check admin status on mount - USING SERVER-SIDE VERIFICATION LIKE PaidGameAdminPage
    useEffect(() => {
        const checkAdmin = async () => {
            if (!token) {
                toast.error('Unauthorized access. Redirecting to home page...');
                setTimeout(() => navigate('/'), 2000);
                setCheckingAdmin(false);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/api/user/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': apiAuthToken,
                    },
                });
                const data = await res.json();
                if (data.success && (data.user.role === "ADMIN" || data.user.role === "MOD")) {
                    setIsAdmin(true);
                } else {
                    toast.error('Unauthorized access. Only admins or moderators can access this page.');
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (err) {
                console.error('Admin check failed:', err);
                toast.error('Authentication failed. Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setCheckingAdmin(false);
            }
        };

        checkAdmin();
    }, [navigate, token, apiUrl, apiAuthToken]);

    // Fetch app data by ID from route param
    useEffect(() => {
        if (isAdmin && appId) {
            const fetchApp = async () => {
                setLoading(true);
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'https://toxicgame.net';
                    const { data } = await axios.get(`${apiUrl}/api/apps/get/${appId}`,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${token}`,
                                'X-Auth-Token': import.meta.env.VITE_API_TOKEN,
                            }
                        }
                    );
                    const app = data.app;
                    setAppData(app);
                    setTitle(app.title || "");
                    setDescription(app.description || "");
                    setPlatform(app.platform || "");
                    setArchitecture(app.architecture || "Native");
                    setTags(app.tags || []);
                    setIsPaid(app.isPaid || false);
                    setPrice(app.price ? String(app.price) : "0");
                    setDownloadLinks(app.downloadLink || ["", "", "", "", "", ""]);
                    setSize(app.size ? app.size.split(' ')[0] : "");
                    setUnit(app.size && app.size.includes('GB') ? 'GB' : 'MB');
                    setCategory(app.category?.name || app.category || "");
                    setSystemRequirements(app.systemRequirements || {
                        os: "",
                        processor: "",
                        memory: "",
                        graphics: "",
                        storage: "",
                        additionalNotes: ""
                    });
                    setGameMode(app.gameMode || "");
                    setReleaseYear(app.releaseYear ? String(app.releaseYear) : "");
                    setCoverImg(app.coverImg || "");
                    // Dynamic thumbnail slots
                    let thumbArr = [];
                    if (typeof app.thumbnail === 'string') {
                        thumbArr = app.thumbnail.split(',').map(s => s.trim());
                    } else if (Array.isArray(app.thumbnail)) {
                        thumbArr = app.thumbnail;
                    }
                    // Always add one empty slot if not at max
                    if (thumbArr.length < MAX_THUMBNAILS) thumbArr.push("");
                    setThumbnail(thumbArr.slice(0, MAX_THUMBNAILS));
                } catch (err) {
                    toast.error('Failed to fetch app data.');
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            };
            fetchApp();
        }
    }, [isAdmin, appId, navigate, token]);

    // All other functions remain exactly the same - no changes below this line
    const handleDownloadLinkChange = (index, value) => {
        const newLinks = [...downloadLink];
        newLinks[index] = value;
        setDownloadLinks(newLinks);
    };

    const handleSystemRequirementChange = (field, value) => {
        setSystemRequirements(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleTag = (tag) => {
        setTags(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag);
            } else {
                if (prev.length >= 15) {
                    toast.error("Maximum 15 tags allowed!");
                    return prev;
                }
                return [...prev, tag];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Double check admin status before submitting
        if (!isAdmin) {
            toast.error('Unauthorized access. Only admins or moderators can update apps.');
            return;
        }

        setUpdating(true);

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in.');
            setUpdating(false);
            navigate('/');
            return;
        }

        try {
            // Fetch real-time user data
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            if (import.meta.env.VITE_API_TOKEN) {
                headers['X-Auth-Token'] = import.meta.env.VITE_API_TOKEN;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
                headers,
            });

            const userRole = res.data?.user?.role;

            if (!['ADMIN', 'MOD'].includes(userRole)) {
                toast.error('Unauthorized access. Only admins or moderators can update apps.');
                setTimeout(() => navigate('/'), 2000);
                setUpdating(false);
                return;
            }

            // Validate form data
            const filteredDownloadLink = downloadLink.filter(link => link.trim() !== "");
            if (filteredDownloadLink.length === 0) {
                toast.error("Please provide at least one download link!");
                setUpdating(false);
                return;
            }

            if (tags.length === 0) {
                toast.error("Please select at least one tag!");
                setUpdating(false);
                return;
            }

            const filteredThumbnails = thumbnail.filter(Boolean);
            const payload = {
                title,
                description,
                platform,
                architecture,
                tags,
                isPaid,
                price: String(price),
                size: `${size} ${unit}`,
                category,
                gameMode,
                releaseYear: String(releaseYear),
                systemRequirements,
                coverImg,
                thumbnail: filteredThumbnails,
                downloadLink: filteredDownloadLink,
            };

            await axios.put(`${import.meta.env.VITE_API_URL}/api/apps/edit/${appId}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'X-Auth-Token': import.meta.env.VITE_API_TOKEN,
                },
            });

            toast.success("🎉 App updated successfully!");
            setTimeout(() => {
                setUpdating(false);
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("❌ Error updating app! " + (error.response?.data?.message || error.message));
            setUpdating(false);
        }
    };

    // Handler for thumbnail input change
    const handleThumbnailChange = (idx, value) => {
        let newThumbs = [...thumbnail];
        newThumbs[idx] = value;
        // If last input is filled and not at max, add a new empty slot
        if (
            idx === newThumbs.length - 1 &&
            value.trim() !== "" &&
            newThumbs.length < MAX_THUMBNAILS
        ) {
            newThumbs.push("");
        }
        // Remove trailing empty slots (except one at end)
        while (
            newThumbs.length > 1 &&
            newThumbs[newThumbs.length - 1] === "" &&
            newThumbs[newThumbs.length - 2] === ""
        ) {
            newThumbs.pop();
        }
        setThumbnail(newThumbs.slice(0, MAX_THUMBNAILS));
    };

    // Predefined options (copied from createApps.jsx)
    const predefinedTags = [
        "2D", "3D", "Action", "Adventure", "Agriculture", "Anime", "Apps", "Arcade",
        "Artificial Intelligence", "Assassin", "Atmospheric", "Automation", "Blood",
        "Building", "Cartoon", "Casual", "Character Customization", "Cinematic", "Classic",
        "Co-Op", "Colony Sim", "Colorful", "Combat", "Comedy", "Comic Book", "Competitive",
        "Controller", "Crafting", "Crime", "Cute", "Cyberpunk", "Dark Humor", "Difficult",
        "Dragons", "Driving", "Early Access", "eSport", "Exploration", "Family Friendly",
        "Fantasy", "Farming Sim", "Fast-Paced", "Female Protagonist", "Fighting",
        "First-Person", "Fishing", "Flight", "FPS", "Funny", "Gore", "Great Soundtrack",
        "Hack and Slash", "History", "Horror", "Hunting", "Idler", "Illuminati",
        "Immersive Sim", "Indie", "LEGO", "Life Sim", "Loot", "Management", "Mature",
        "Memes", "Military", "Modern", "Multiplayer", "Mystery", "Nudity", "Open World",
        "Parkour", "Physics", "Pixel Graphics", "Post-apocalyptic", "Puzzle", "PvP",
        "Racing", "Realistic", "Relaxing", "Resource Management", "RPG", "Sandbox",
        "Sci-fi", "Science", "Science Fiction", "Sexual Content", "Shooters", "Simulation",
        "Singleplayer", "Sports", "Stealth Game", "Story Rich", "Strategy", "Superhero",
        "Surreal", "Survival", "Tactical", "Tanks", "Team-Based", "Third Person",
        "Third-Person-Shooter", "Thriller", "Tower Defense", "Trading", "Turn-Based",
        "Underwater", "Utilities", "Violent", "VR", "War", "Wargame", "Zombie"
    ];
    const categories = [
        { value: "pc", label: "PC Games" },
        { value: "spc", label: "PC Softwares" },
        { value: "mac", label: "Mac Games" },
        { value: "smac", label: "Mac Softwares" },
        { value: "android", label: "Android Games" },
        { value: "sandroid", label: "Android Softwares" },
        { value: "ppsspp", label: "PPSSPP Iso" },
        { value: "ps2", label: "PS2 Iso" },
        { value: "ps3", label: "PS3 Iso" },
        { value: "ps4", label: "Mac Exclusive Games" },
    ];
    const architectures = ["Native", "ARM", "Wineskin", "Port"];
    const gameModes = ["Singleplayer", "Multiplayer"];
    const platforms = ["PC", "Mac", "Android", "Playstation"];
    const downloadLinkLabelsAndPlaceholders = [
        { label: "Viking File (Mac) // VikingFile (PC)", placeholder: "Enter the VikingFile link" },
        { label: "OneDrive (Mac) // Buzzheavier (PC)", placeholder: "Enter the Buzzheavier link" },
        { label: "Torrent (Mac) // FuckingFast (PC)", placeholder: "Enter the Torrent link" },
        { label: "BuzzHeavier (Mac) // Bzzhr.co (PC)", placeholder: "Enter other download link" },
        { label: "MediaFire Link (Mac) // Buzzheavier (PC)", placeholder: "Enter Mediafire link" },
        { label: "Akira Box Link (Mac, PC)", placeholder: "Enter AkiraBox link" }
    ];

    // Show loading while checking admin status
    if (checkingAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Checking admin permissions...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="bottom-right" theme="dark" />
            <div className="max-w-5xl mx-auto">
                {isAdmin ? (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-8 bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl ring-1 ring-purple-500/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header Section */}
                        <div className="border-b border-purple-500/30 pb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Update Game/App
                                </h1>
                            </div>
                            <p className="text-gray-400">Edit your app details below</p>
                        </div>
                        {/* Main Form Content - styled like /update/page.jsx */}
                        <div className="space-y-8">
                            {/* Basic Info Block */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200">Basic Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Application Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter application name"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                    {/* Architecture */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Architecture</label>
                                        <select
                                            value={architecture}
                                            onChange={(e) => setArchitecture(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                        >
                                            {architectures.map((arch) => (
                                                <option key={arch} value={arch}>{arch}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Platform Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                                        <select
                                            value={platform}
                                            onChange={(e) => setPlatform(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                            required
                                        >
                                            <option value="">Select Platform</option>
                                            {platforms.map((plat) => (
                                                <option key={plat} value={plat}>{plat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Category Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 appearance-none"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Game Mode */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode</label>
                                        <select
                                            value={gameMode}
                                            onChange={e => setGameMode(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                            required
                                        >
                                            <option value="">Select Game Mode</option>
                                            {gameModes.map((mode) => (
                                                <option key={mode} value={mode}>{mode}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Release Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 2025"
                                            value={releaseYear}
                                            onChange={e => setReleaseYear(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                            min="1970"
                                            max="2100"
                                            required
                                        />
                                    </div>
                                    {/* Pricing Section */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Pricing</label>
                                        <div className="flex items-center space-x-3">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isPaid}
                                                    onChange={(e) => setIsPaid(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                                />
                                                <span className="text-gray-300">Paid Application</span>
                                            </label>
                                        </div>
                                        {isPaid && (
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="Price in USD"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {/* File Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">File Size</label>
                                        <div className="flex rounded-lg overflow-hidden border border-gray-600 focus-within:ring-2 focus-within:ring-purple-500">
                                            <input
                                                type="number"
                                                placeholder="Enter size"
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-gray-700/50 text-gray-300 focus:outline-none"
                                                min="0"
                                                step="0.1"
                                            />
                                            <select
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                                className="bg-gray-700/50 border-l border-gray-600 text-gray-300 px-4 py-3 focus:outline-none hover:bg-gray-600 transition-colors"
                                            >
                                                <option value="GB">GB</option>
                                                <option value="MB">MB</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Tags Block */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200">Tags & Description</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Tags Selector - Improved UI from createApps.jsx */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Tags ({tags.length}/15)
                                        </label>
                                        {/* Selected tags display */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-purple-700 rounded-full text-xs font-medium flex items-center"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleTag(tag)}
                                                        className="ml-2 text-gray-300 hover:text-white"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowTagSelector(!showTagSelector)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-left text-gray-300"
                                        >
                                            {tags.length > 0 ? `${tags.length} tags selected` : "Select tags..."}
                                        </button>
                                        {/* Tag selector dropdown with hover and click-to-select, styled like createApps.jsx */}
                                        {showTagSelector && (
                                            <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                <div className="p-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Search tags..."
                                                        className="w-full px-3 py-2 mb-2 bg-gray-700 text-gray-300 rounded"
                                                        onChange={(e) => {
                                                            const search = e.target.value.toLowerCase();
                                                            const tagList = document.getElementById('tagList');
                                                            Array.from(tagList.children).forEach(tag => {
                                                                const tagText = tag.textContent.toLowerCase();
                                                                tag.style.display = tagText.includes(search) ? 'block' : 'none';
                                                            });
                                                        }}
                                                    />
                                                    <div id="tagList" className="flex flex-wrap gap-2">
                                                        {predefinedTags.map(tag => (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                onClick={() => toggleTag(tag)}
                                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 ${tags.includes(tag)
                                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105'
                                                                    : tags.length >= 15
                                                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white hover:scale-105'
                                                                    }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Description Textarea */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <textarea
                                            rows="4"
                                            placeholder="Tell us about your game/app..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 placeholder-gray-500 resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* System Requirements Block */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200">System Requirements</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">OS</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Windows 10"
                                            value={systemRequirements.os}
                                            onChange={(e) => handleSystemRequirementChange('os', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Processor</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Intel i5"
                                            value={systemRequirements.processor}
                                            onChange={(e) => handleSystemRequirementChange('processor', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Memory</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 8GB"
                                            value={systemRequirements.memory}
                                            onChange={(e) => handleSystemRequirementChange('memory', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Graphics</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., NVIDIA GTX 1060"
                                            value={systemRequirements.graphics}
                                            onChange={(e) => handleSystemRequirementChange('graphics', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Storage</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 20GB"
                                            value={systemRequirements.storage}
                                            onChange={(e) => handleSystemRequirementChange('storage', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Additional Notes</label>
                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            value={systemRequirements.additionalNotes}
                                            onChange={(e) => handleSystemRequirementChange('additionalNotes', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Download Links Block */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200">Download Links</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {downloadLinkLabelsAndPlaceholders.map((item, index) => (
                                        <div key={index} className="relative">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                {item.label}
                                                <span className="ml-2 text-xs text-purple-400">
                                                    ({index < 3 ? 'Required' : 'Optional'})
                                                </span>
                                            </label>
                                            <div className="flex items-center">
                                                <span className="absolute left-3 text-gray-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={item.placeholder}
                                                    value={downloadLink[index] || ""}
                                                    onChange={(e) => handleDownloadLinkChange(index, e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300 placeholder-gray-500"
                                                    required={index < 3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Media Upload Block (now URL fields, styled like createApps.jsx) */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-pink-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Media & Assets
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cover Image URL (styled like upload block) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Cover Image URL
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Paste cover image URL here"
                                                        value={coverImg || ''}
                                                        onChange={e => setCoverImg(e.target.value)}
                                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                                    />
                                                    {coverImg && (
                                                        <img src={coverImg} alt="Cover Preview" className="mt-2 rounded-lg max-h-32" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Thumbnails URLs (dynamic input blocks) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Thumbnail URLs (up to 20, add more as you fill)
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <div className="flex flex-col items-center justify-center w-full h-auto border-2 border-dashed border-gray-600 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-4">
                                                <div className="flex flex-col gap-2 w-full">
                                                    {thumbnail.map((url, idx) => (
                                                        <input
                                                            key={idx}
                                                            type="text"
                                                            placeholder={`Thumbnail URL #${idx + 1}`}
                                                            value={url || ''}
                                                            onChange={e => handleThumbnailChange(idx, e.target.value)}
                                                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300"
                                                            maxLength={500}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mt-2 grid grid-cols-3 gap-2 w-full">
                                                    {thumbnail.filter(Boolean).map((url, idx) => (
                                                        <img key={idx} src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-auto rounded-md" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading || updating}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {updating ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating app...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        UPDATE APP
                                    </span>
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">
                            Access Denied
                        </h2>
                        <p className="text-gray-400">
                            You do not have permission to view this page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateApps;