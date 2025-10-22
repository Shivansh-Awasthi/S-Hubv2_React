import { useState } from "react";

// Bulk status update for selected requests
export default function AdminBulkActions() {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    // This would need to get selected IDs from context or parent in a real app
    const selected = [];

    async function handleBulkUpdate() {
        if (!status || selected.length === 0) return;
        setLoading(true);
        setMessage("");
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch(`${process.env.VITE_API_URL}/api/requests/admin/requests/bulk-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': process.env.VITE_API_TOKEN,
                    } : {}),
                },
                body: JSON.stringify({ ids: selected, status }),
            });
            if (res.ok) {
                setMessage("Bulk status update successful!");
            } else {
                setMessage("Bulk update failed.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 border border-blue-800">
            <span className="font-semibold text-blue-200 text-lg">Bulk Status Update:</span>
            <select value={status} onChange={e => setStatus(e.target.value)} className="border-2 border-blue-700 rounded-lg px-3 py-2 bg-[#1A2739] text-blue-100 font-semibold focus:ring-2 focus:ring-blue-400">
                <option value="">Select status</option>
                {['pending', 'processing', 'approved', 'rejected', 'deleted'].map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
            <button
                onClick={handleBulkUpdate}
                disabled={loading || !status || selected.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all disabled:opacity-50"
            >
                Update Selected
            </button>
            {message && <span className="ml-4 text-blue-400 font-semibold">{message}</span>}
        </div>
    );
}
