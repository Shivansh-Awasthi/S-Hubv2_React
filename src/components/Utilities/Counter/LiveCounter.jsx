import React, { useState, useEffect } from 'react';
import { db, ref, set, get } from './firebase';
const STORAGE_KEY = 'visitorRecords';

// Utility functions
const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const isYesterday = (timestamp) => {
    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};

const isWithinPastWeek = (timestamp) => {
    const date = new Date(timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
};

const isWithinPastYear = (timestamp) => {
    const date = new Date(timestamp);
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    return date >= yearAgo;
};

// Firebase interaction functions
const generateUserId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }
    return userId;
};

// Fetch visitor records from Firebase
const fetchVisitorRecords = async () => {
    const visitorRef = ref(db, 'visitorRecords');
    try {
        const snapshot = await get(visitorRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return {}; // Return empty object if no data exists
        }
    } catch (error) {
        console.error("Error fetching visitor records: ", error);
        return {};
    }
};

// Add visitor record to Firebase
const addVisitorRecord = async (userId) => {
    const visitorRef = ref(db, 'visitorRecords/' + userId);
    const timestamp = Date.now();

    try {
        // Check if the user already has a visit today
        const snapshot = await get(visitorRef);
        if (snapshot.exists()) {
            const visits = snapshot.val().visits || [];
            visits.push(timestamp);  // Add a new visit timestamp
            await set(visitorRef, { visits });  // Update Firebase
        } else {
            // First visit of the day, create new record
            await set(visitorRef, { visits: [timestamp] });
        }
    } catch (error) {
        console.error("Error adding visitor record: ", error);
    }
};

// StatCard component
const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-[#1b1a1c] p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-purple-500">{title}</h3>
                <div className="w-5 h-5 text-blue-500">{icon}</div>
            </div>
            <p className="text-2xl font-bold text-green-600">{value}</p>
        </div>
    );
};

export const LiveCounter = () => {
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        yesterday: 0,
        pastWeek: 0,
        pastYear: 0,
        todayVisits: 0, // Added field to track today's total visits (including refreshes)
    });

    useEffect(() => {
        const userId = getUserId();

        const fetchData = async () => {
            const records = await fetchVisitorRecords();
            const userVisits = records[userId] ? records[userId].visits || [] : [];

            // Add visitor record for today if not already present
            const hasVisitedToday = userVisits.some(timestamp => isToday(timestamp));
            if (!hasVisitedToday) {
                await addVisitorRecord(userId);
            }

            // Calculate unique visitors for different timeframes
            const uniqueVisitors = new Set(Object.keys(records));
            const todayVisitors = new Set();
            const yesterdayVisitors = new Set();
            const weekVisitors = new Set();
            const yearVisitors = new Set();
            let todayTotalVisits = 0;

            Object.keys(records).forEach(id => {
                const userRecord = records[id];
                const visits = userRecord.visits || [];
                visits.forEach(record => {
                    if (isToday(record)) {
                        todayVisitors.add(id);
                        todayTotalVisits += 1;  // Count each visit (refresh increases count)
                    }
                    if (isYesterday(record)) yesterdayVisitors.add(id);
                    if (isWithinPastWeek(record)) weekVisitors.add(id);
                    if (isWithinPastYear(record)) yearVisitors.add(id);
                });
            });

            setStats({
                total: uniqueVisitors.size,
                today: todayVisitors.size,
                yesterday: yesterdayVisitors.size,
                pastWeek: weekVisitors.size,
                pastYear: yearVisitors.size,
                todayVisits: todayTotalVisits,  // Set today's total visit count
            });
        };

        fetchData();
    }, []);

    return (
        <div className="bg-[#2E2E2E] p-8">
            <div className="mx-auto w-full">
                <div className="flex items-center justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <circle cx="9" cy="7" r="4" />
                    </svg>
                    <h1 className="text-3xl font-bold text-blue-600">Visitor Statistics</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    <StatCard
                        title="Today's Visitors"
                        value={stats.today}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Yesterday's Visitors"
                        value={stats.yesterday}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M3 10h18" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Past Week"
                        value={stats.pastWeek}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M3 10h18" />
                                <path d="M8 14h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 18h.01" />
                                <path d="M12 18h.01" />
                                <path d="M16 18h.01" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="This Year"
                        value={stats.pastYear}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M16 2v4" />
                                <path d="M3 10h18" />
                                <path d="M8 2v4" />
                                <path d="M17 14h-6" />
                                <path d="M13 18H7" />
                                <path d="M7 14h.01" />
                                <path d="M17 18h.01" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Visitors"
                        value={stats.total}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <circle cx="9" cy="7" r="4" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Visits (Daily)"
                        value={stats.todayVisits}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveCounter;
