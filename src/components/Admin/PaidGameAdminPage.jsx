import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const apiAuthToken = import.meta.env.VITE_API_TOKEN;

const PaidGameAdminPage = () => {
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [ps4Games, setPs4Games] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // ✅ Get token once
    const token = localStorage.getItem("token");

    // Check admin status on mount
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? {
                            Authorization: `Bearer ${token}`,
                            'X-Auth-Token': apiAuthToken,
                        } : {}),
                    },
                });
                const data = await res.json();
                if (!data.success || data.user.role !== "ADMIN") {
                    navigate("/");
                }
            } catch (e) {
                console.error("Admin check failed:", e);
                navigate("/");
            }
        };

        checkAdmin();
        fetchRecentUsers();
        fetchPs4PaidGames();
    }, []);

    const fetchRecentUsers = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${apiUrl}/api/user/recent`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': apiAuthToken,
                    } : {}),
                },
            });
            const data = await res.json();
            setUsers(data.users || []);
        } catch (e) {
            setMessage("Failed to fetch users");
        }
        setLoading(false);
    };

    const searchUserByEmail = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${apiUrl}/api/user/by-email?email=${encodeURIComponent(email)}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': apiAuthToken,
                    } : {}),
                },
            });
            const data = await res.json();
            if (data.user) {
                setUsers([data.user]);
            } else {
                setUsers([]);
                setMessage("No user found");
            }
        } catch (e) {
            setMessage("Failed to search user");
        }
        setLoading(false);
    };

    const fetchPs4PaidGames = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${apiUrl}/api/apps/category/ps4`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': apiAuthToken,
                    } : {}),
                },
            });
            const data = await res.json();
            const paidGames = (data.apps || data.games || []).filter(game => game.isPaid);
            setPs4Games(paidGames);
        } catch (e) {
            setMessage("Failed to fetch games");
        }
        setLoading(false);
    };

    const addGameToUser = async () => {
        if (!selectedUser || !selectedGame) return;
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${apiUrl}/api/user/add-purchased-game`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': apiAuthToken,
                    } : {}),
                },
                body: JSON.stringify({
                    userId: selectedUser._id,
                    gameId: selectedGame,
                }),
            });
            const data = await res.json();
            setMessage(data.message || "Game added.");
        } catch (e) {
            setMessage("Failed to add game.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight drop-shadow-sm">Admin: Add Paid PS4 Game to User</h1>
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <input
                    type="email"
                    placeholder="Search user by email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border-2 border-blue-200 focus:border-blue-500 transition p-3 rounded-lg w-full sm:w-2/3 shadow-sm focus:outline-none"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={searchUserByEmail} className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-60">Search</button>
                    <button onClick={fetchRecentUsers} className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition">Recent 10</button>
                </div>
            </div>
            <div className="mb-6">
                <h2 className="font-bold mb-3 text-lg text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Users:
                </h2>
                {users.length === 0 && <div className="text-gray-400 italic text-center">No users found.</div>}
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user._id} className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition shadow-sm hover:shadow-md ${selectedUser && selectedUser._id === user._id ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'}`} onClick={() => setSelectedUser(user)}>
                            <div>
                                <span className="font-semibold text-gray-800">{user.username}</span> <span className="text-gray-500">({user.email})</span>
                            </div>
                            {selectedUser && selectedUser._id === user._id && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <h2 className="font-bold mb-3 text-lg text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Paid PS4 Games:
                </h2>
                <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)} className="border-2 border-green-200 focus:border-green-500 transition p-3 rounded-lg w-full shadow-sm focus:outline-none bg-gray-50">
                    <option value="">Select a game</option>
                    {ps4Games.map(game => (
                        <option key={game._id} value={game._id}>{game.title}</option>
                    ))}
                </select>
            </div>
            <button
                className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                disabled={!selectedUser || !selectedGame || loading}
                onClick={addGameToUser}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Game...
                    </span>
                ) : 'Add Game to User'}
            </button>
            {message && <div className="mt-6 text-center text-lg font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-3 px-4 shadow-sm">{message}</div>}
        </div>
    );
};

export default PaidGameAdminPage;