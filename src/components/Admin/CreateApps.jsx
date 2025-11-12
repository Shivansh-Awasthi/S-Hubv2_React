import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Remove jwtDecode import since we'll use API verification

const CreateApps = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("");
    const [architecture, setArchitecture] = useState("Native");
    const [tags, setTags] = useState([]);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState(0);
    const [thumbnail, setThumbnail] = useState([]);
    const [downloadLink, setDownloadLinks] = useState(["no", "no", "no", "no", "no", "no"]);
    const [size, setSize] = useState("");
    const [unit, setUnit] = useState('MB');
    const [category, setCategory] = useState("");
    const [coverImg, setCoverImg] = useState(null);
    const [systemRequirements, setSystemRequirements] = useState({
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        additionalNotes: ""
    });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true); // Add loading state for admin check
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [gameMode, setGameMode] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const fileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

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
                if (data.success && data.user.role === "ADMIN") {
                    setIsAdmin(true);
                } else {
                    toast.error('Unauthorized access. Only admins can access this page.');
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

    // All other functions remain exactly the same - no changes below this line
    const handleThumbnail = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + thumbnail.length > 20) {
            toast.error("You can only upload up to 20 images/videos.");
            e.target.value = "";
            return;
        }
        setThumbnail((prevFiles) => [...prevFiles, ...files]);
    };

    const handleCoverImg = (e) => {
        setCoverImg(e.target.files[0]);
    };

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
                // Enforce 15 tag limit
                if (prev.length >= 15) {
                    toast.error("Maximum 15 tags allowed!");
                    return prev;
                }
                return [...prev, tag];
            }
        });
    };

    // Converts multiple blank lines to the correct number of \n for backend
    function convertLineBreaksToN(descriptionText) {
        // Replace all \r\n or \r with \n for consistency
        let normalized = descriptionText.replace(/\r\n?/g, '\n');
        // Replace every sequence of 2 or more newlines with the same number of \n
        // This will turn 2 newlines into \n\n, 3 into \n\n\n, etc.
        return normalized.replace(/\n{2,}/g, (match) => '\\n'.repeat(match.length));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Double check admin status before submitting (server will also verify)
        if (!isAdmin) {
            toast.error('Unauthorized access. Only admins can create apps.');
            return;
        }

        setLoading(true);

        const filteredDownloadLink = downloadLink.filter(link => link.trim() !== "");

        if (filteredDownloadLink.length === 0) {
            toast.error("Please provide at least one download link!");
            setLoading(false);
            return;
        }

        if (tags.length === 0) {
            toast.error("Please select at least one tag!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        // Convert description line breaks before sending
        formData.append('description', convertLineBreaksToN(description));
        formData.append('platform', platform);
        formData.append('architecture', architecture);
        formData.append('tags', tags.join(','));
        formData.append('isPaid', isPaid);
        formData.append('price', price);
        formData.append('size', `${size} ${unit}`);
        formData.append('category', category);
        formData.append('gameMode', gameMode);
        formData.append('releaseYear', releaseYear);

        // Format system requirements as backend expects
        formData.append('systemRequirements', JSON.stringify({
            os: systemRequirements.os,
            processor: systemRequirements.processor,
            memory: systemRequirements.memory,
            graphics: systemRequirements.graphics,
            storage: systemRequirements.storage,
            additionalNotes: systemRequirements.additionalNotes
        }));

        // Append files
        if (coverImg) formData.append('coverImg', coverImg);
        thumbnail.forEach(file => formData.append('thumbnail', file));

        // Append download links correctly
        filteredDownloadLink.forEach(link => {
            formData.append('downloadLink[]', link);
        });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://toxicgame.net';

            await axios.post(`${apiUrl}/api/apps/admin/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'X-Auth-Token': import.meta.env.VITE_API_TOKEN,
                },
            });

            toast.success("🎉 App created successfully!");

            // Hard refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("❌ Error creating app! " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

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

    const architectures = [
        "Native", "ARM", "Wineskin", "Port"
    ];

    const downloadLinkLabelsAndPlaceholders = [
        { label: "Viking File (Mac) // VikingFile (PC)", placeholder: "Enter the VikingFile link" },
        { label: "Data Vaults (Mac) // Buzzheavier (PC)", placeholder: "Enter the Buzzheavier link" },
        { label: "Torrent (Mac) // FuckingFast (PC)", placeholder: "Enter the Torrent link" },
        { label: "BuzzHeavier (Mac) // Data Vaults (PC)", placeholder: "Enter other download link" },
        { label: "MediaFire Link (Mac) // Buzzheavier (PC)", placeholder: "Enter Mediafire link" },
        { label: "Akira Box Link (Mac, PC)", placeholder: "Enter AkiraBox link" }
    ];

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const triggerThumbnailInput = () => {
        thumbnailInputRef.current.click();
    };

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
                                    Create New Game/App
                                </h1>
                            </div>
                            <p className="text-gray-400">Build something amazing for our community</p>
                        </div>

                        {/* Main Form Content - ALL REMAINS EXACTLY THE SAME */}
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Application Title
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Architecture
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Platform
                                        </label>
                                        <select
                                            value={platform}
                                            onChange={(e) => setPlatform(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                            required
                                        >
                                            <option value="">Select Platform</option>
                                            <option value="PC">PC</option>
                                            <option value="Mac">Mac</option>
                                            <option value="Android">Android</option>
                                            <option value="Playstation">Playstation</option>
                                        </select>
                                    </div>

                                    {/* Category Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                            Category
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2" />
                                            </svg>
                                            Game Mode
                                        </label>
                                        <select
                                            value={gameMode}
                                            onChange={e => setGameMode(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                            required
                                        >
                                            <option value="">Select Game Mode</option>
                                            <option value="Singleplayer">Single Player</option>
                                            <option value="Multiplayer">Multiplayer</option>
                                        </select>
                                    </div>

                                    {/* Release Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                            </svg>
                                            Release Year
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Pricing
                                        </label>
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                            File Size
                                        </label>
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
                                    {/* Tags Selector - Reverted to previous version */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Tags ({tags.length}/15) {/* Added tag count */}
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

                                        {/* Tag selector dropdown */}
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
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${tags.includes(tag)
                                                                    ? 'bg-purple-600 text-white'
                                                                    : tags.length >= 15
                                                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            Description
                                        </label>
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
                                    {downloadLink.map((link, index) => (
                                        <div key={index} className="relative">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                {downloadLinkLabelsAndPlaceholders[index]?.label || `Link ${index + 1}`}
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
                                                    placeholder={downloadLinkLabelsAndPlaceholders[index]?.placeholder}
                                                    value={link}
                                                    onChange={(e) => handleDownloadLinkChange(index, e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300 placeholder-gray-500"
                                                    required={index < 3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Media Upload Block */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-1 bg-pink-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-gray-200">Media & Assets</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cover Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Cover Image
                                        </label>
                                        <div
                                            className="flex items-center justify-center w-full cursor-pointer"
                                            onClick={triggerFileInput}
                                        >
                                            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:border-purple-500 transition-all duration-300 group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {coverImg ? (
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="text-sm text-gray-300">{coverImg.name}</p>
                                                            <p className="text-xs text-gray-400 mt-1">Click to change</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <svg className="w-12 h-12 mb-4 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                            </svg>
                                                            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                                                <span className="font-semibold">Drag & drop</span> or click to upload
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">Required • JPG, PNG (Max 5MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverImg}
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnail Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Thumbnails
                                        </label>
                                        <div
                                            className="flex items-center justify-center w-full cursor-pointer"
                                            onClick={triggerThumbnailInput}
                                        >
                                            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:border-purple-500 transition-all duration-300 group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {thumbnail.length > 0 ? (
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="text-sm text-gray-300">{thumbnail.length} files selected</p>
                                                            <p className="text-xs text-gray-400 mt-1">Click to add more</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <svg className="w-12 h-12 mb-4 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                            </svg>
                                                            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                                                <span className="font-semibold">Drag & drop</span> or click to upload
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">Required • Up to 20 files</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*"
                                                    onChange={handleThumbnail}
                                                    className="hidden"
                                                    ref={thumbnailInputRef}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {thumbnail.length > 0 && (
                                            <p className="mt-2 text-sm text-gray-400 text-center">
                                                {thumbnail.length} file{thumbnail.length !== 1 ? 's' : ''} ready for upload
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating your masterpiece...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        LAUNCH YOUR CREATION
                                    </span>
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl ring-1 ring-purple-500/30">
                        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
                        <p className="text-gray-400 text-center mb-6">You do not have permission to access this page. Only administrators can create new applications.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-purple-500/20"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateApps;