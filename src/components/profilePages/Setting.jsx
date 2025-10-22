import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// SettingsForm Component
const SettingsForm = ({ user, onSubmit }) => {
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [oldPassword, setOldPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await onSubmit({ avatarUrl, username, email, oldPassword });
            setSuccess("Profile updated successfully! Please log in again.");
            setTimeout(() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }, 1000);
        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your account preferences</p>
                </div>

                {/* Settings Card */}
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                    {/* Gradient Border Top */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

                    <div className="p-8">
                        {/* Avatar Section */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <div className="relative">
                                    <img
                                        src={avatarUrl || "/default-avatar.png"}
                                        alt="Avatar Preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                            <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-yellow-400 text-sm font-medium">
                                    🔄 You'll need to re-login to see changes
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar URL Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="avatarUrl">
                                    <div className="flex items-center gap-2">
                                        <span>🖼️ Avatar URL</span>
                                    </div>
                                </label>
                                <input
                                    id="avatarUrl"
                                    type="url"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={avatarUrl}
                                    onChange={e => setAvatarUrl(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
                                    <div className="flex items-center gap-2">
                                        <span>👤 Username</span>
                                    </div>
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                                    <div className="flex items-center gap-2">
                                        <span>📧 Email Address</span>
                                    </div>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <span>⚠️</span>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </div>
                            )}
                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <span>✅</span>
                                        <p className="text-sm">{success}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>💾 Save Changes</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-700/50">
                            <div className="text-center text-gray-400 text-sm">
                                <p>Need help? Contact support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

// Main SettingsPage Component
const Setting = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const token = localStorage.getItem("token");
                const xAuthToken = import.meta.env.VITE_API_TOKEN;
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                const headers = { Authorization: `Bearer ${token}` };
                if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;
                let data;
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, { headers, credentials: "include" });
                    data = await res.json();

                    if (data && data.user) setUser(data.user);
                    else throw new Error();
                } catch (err) {
                    try {
                        const decoded = jwtDecode(token);
                        setUser({
                            username: decoded.username || decoded.name || "User",
                            email: decoded.email || "",
                            avatar: decoded.avatar || "https://ui-avatars.com/api/?name=U&background=random",
                        });
                    } catch {
                        setUser(null);
                    }
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleSubmit = async ({ avatarUrl, username, email, oldPassword }) => {
        const token = localStorage.getItem("token");
        const xAuthToken = import.meta.env.VITE_API_TOKEN;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (xAuthToken) headers["X-Auth-Token"] = xAuthToken;

        if (avatarUrl && avatarUrl !== user.avatar) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-avatar`, {
                method: "PATCH",
                headers,
                credentials: "include",
                body: JSON.stringify({ avatarUrl })
            });
        }
        if ((username && username !== user.username) || (email && email !== user.email)) {
            const body = {};
            if (username && username !== user.username) body.username = username;
            if (email && email !== user.email) body.email = email;
            await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-profile`, {
                method: "PATCH",
                headers,
                credentials: "include",
                body: JSON.stringify(body)
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return <SettingsForm user={user} onSubmit={handleSubmit} />;
};

export default Setting;