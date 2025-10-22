import { useEffect, useState } from "react";

// Admin Dashboard for Game Requests
import AdminRequestTable from "./AdminRequestTable";
import AdminBulkActions from "./AdminBulkActions";
import AdminStatsModal from "./AdminStatsModal";

function AdminAction() {
    // You can add admin authentication/role check here (fetch user, check role)
    // For now, assume admin is authenticated and authorized
    return (
        <div className="min-h-screen py-12 px-2 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4 shadow-lg mb-4 animate-fadeIn">
                        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4h-2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" />
                        </svg>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-2 text-center drop-shadow-lg animate-fadeIn">Admin Game Request Dashboard</h1>
                    <p className="text-lg text-gray-600 max-w-2xl text-center mt-2 animate-fadeIn">Manage, moderate, and analyze all game requests from a single, powerful interface. Only visible to admins.</p>
                </div>
                <div className="space-y-8">
                    <AdminBulkActions />
                    <AdminRequestTable />
                    <AdminStatsModal />
                </div>
            </div>
        </div>
    );
}

export default AdminAction;