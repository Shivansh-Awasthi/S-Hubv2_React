import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Donate = () => {
    const [fundingData, setFundingData] = useState({
        rdr2: 0,
        macbook: 15,
        monthly: 30,
        total: 0
    });

    const [goals] = useState({
        rdr2: 1500,
        macbook: 2000,
        monthly: 100
    });

    const [daysRemaining, setDaysRemaining] = useState(7);
    const [showThankYou, setShowThankYou] = useState(false);

    // Calculate percentages
    const rdr2Percentage = Math.min((fundingData.rdr2 / goals.rdr2) * 100, 100);
    const macbookPercentage = Math.min((fundingData.macbook / goals.macbook) * 100, 100);
    const monthlyPercentage = Math.min((fundingData.monthly / goals.monthly) * 100, 100);

    // Calculate daily amount needed
    const dailyNeeded = daysRemaining > 0
        ? ((goals.monthly - fundingData.monthly) / daysRemaining).toFixed(2)
        : 0;

    // Donation allocation data
    const allocationData = [
        { percentage: 60, label: "Storage Costs", color: "#4e54c8" },
        { percentage: 25, label: "Server Costs", color: "#00b09b" },
        { percentage: 15, label: "Miscellaneous", color: "#ff8000" }
    ];

    // Calculate conic gradient for pie chart
    const conicGradient = allocationData.reduce((acc, item, index) => {
        const start = index === 0 ? 0 :
            allocationData.slice(0, index).reduce((sum, i) => sum + i.percentage, 0);
        const end = start + item.percentage;
        return `${acc} ${item.color} ${start}% ${end}%,`;
    }, '').slice(0, -1);

    // Handle Ko-fi donation button click
    const handleKofiClick = () => {
        window.open('https://ko-fi.com/ToxicGame', '_blank');
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 5000);
    };

    // Circular progress component
    const CircularProgress = ({ percentage, title, current, goal, color, size = 200 }) => (
        <div className="flex flex-col items-center">
            <div className={`relative w-${size} h-${size}`}>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#2D3748"
                        strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-red-400">${current}</span>
                </div>
            </div>
            <div className="mt-3 text-center">
                <div className="text-sm text-blue-400 font-medium">{title}</div>
                <div className="text-sm text-gray-400">{Math.round(percentage)}% of ${goal}</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
            {/* Thank You Toast */}
            {showThankYou && (
                <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fadeIn">
                    Thank you for your donation!
                </div>
            )}

            {/* Become a Member Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 mb-12 text-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Become a Premium Member!</h2>
                    <p className="text-white/90 mb-4 max-w-2xl mx-auto">
                        Unlock exclusive benefits, early access to new releases, and ad-free experience
                    </p>
                    <Link
                        to="/membership"
                        className="inline-block bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Explore Membership Benefits
                    </Link>
                </div>
            </div>

            {/* Project Support Section */}
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Support the Project</h1>
                <div className="p-8 rounded-2xl border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] shadow-2xl">
                    <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        <img
                            className="w-full h-auto"
                            src="https://i.postimg.cc/MHdDkGr6/91127-horizon-zero-dawn-games-pc-games-xbox-games-ps-games-hd-4k.jpg"
                            alt="Project Banner"
                        />
                        <div className="absolute bottom-4 left-4 z-20">
                            <h2 className="text-xl font-bold text-white">For Public Release</h2>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-white">Raised: <span className="text-green-400">₹{fundingData.rdr2.toLocaleString()}</span></span>
                            <span className="font-medium text-white">Goal: <span className="text-blue-400">₹{goals.rdr2.toLocaleString()}</span></span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-5 p-0.5">
                            <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500 relative"
                                style={{ width: `${rdr2Percentage}%` }}
                            >
                                {rdr2Percentage > 10 && (
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                        {Math.round(rdr2Percentage)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-6">
                        We're working hard to bring you an amazing gaming experience.
                        Your support helps us make it even better!
                    </p>
                    <div className="animate-pulse text-indigo-400 font-medium">
                        You can request programs and games in the request section.
                    </div>
                </div>
            </section>

            {/* Donation Options Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Support Our Development
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ko-fi Section */}
                    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8 rounded-2xl shadow-xl border border-blue-500/30 transform transition-all duration-300 hover:shadow-blue-500/10">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                                Support via Ko-fi
                            </h3>
                            <p className="text-gray-300 mb-6">
                                Buy me a coffee and help support the development of this project. Every contribution helps!
                            </p>

                            <button
                                onClick={handleKofiClick}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg w-full max-w-md mx-auto flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
                                </svg>
                                Support on Ko-fi
                            </button>
                        </div>

                        {/* Funding Goals Section */}
                        <div className="mt-2">
                            <h4 className="text-3xl font-semibold text-center mb-6 text-blue-300">
                                Monthly Funding Progress
                            </h4>
                            <p className="text-gray-400 text-md text-center mb-8">
                                Support our ongoing battle against the industry. Every contribution gets us closer to our goal.
                            </p>

                            {/* Goals Container */}
                            <div className="flex flex-col items-center">
                                <div className="flex flex-wrap justify-center gap-14 mb-8">
                                    {/* Monthly Goal */}
                                    <CircularProgress
                                        percentage={monthlyPercentage}
                                        title="Monthly"
                                        current={fundingData.monthly}
                                        goal={goals.monthly}
                                        color="#6366F1"
                                        size={48}
                                    />

                                    {/* Macbook Goal */}
                                    <CircularProgress
                                        percentage={macbookPercentage}
                                        title="New Mac: M4"
                                        current={fundingData.macbook}
                                        goal={goals.macbook}
                                        color="#10B981"
                                        size={48}
                                    />
                                </div>

                                <div className="w-full max-w-md bg-blue-900/30 p-5 rounded-xl border border-blue-500/20">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-300">${fundingData.monthly}</div>
                                        <div className="text-base text-gray-300 mt-2">
                                            {Math.round(monthlyPercentage)}% of ${goals.monthly}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-2">
                                            {daysRemaining} days remaining
                                        </div>
                                        <div className="text-base text-blue-400 font-medium mt-2">
                                            ${dailyNeeded}/day needed to reach goal
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-base text-gray-500 text-center">
                                New Macbook: So we can test and add more AAA free games for you
                            </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap justify-center mt-6 gap-3">
                            <div className="text-xs bg-blue-900/30 px-3 py-1 rounded-full text-blue-300 border border-blue-500/20">
                                Quick & Easy
                            </div>
                            <div className="text-xs bg-blue-900/30 px-3 py-1 rounded-full text-blue-300 border border-blue-500/20">
                                Multiple Payment Options
                            </div>
                            <div className="text-xs bg-blue-900/30 px-3 py-1 rounded-full text-blue-300 border border-blue-500/20">
                                Leave a Message
                            </div>
                        </div>
                    </div>

                    {/* Donation Allocation Visualization */}
                    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8 rounded-2xl shadow-xl border border-indigo-500/30">
                        <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            How Your Donation Helps
                        </h3>

                        <div className="flex flex-col items-center justify-center">
                            {/* 2D Pie Chart */}
                            <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden shadow-lg"
                                style={{
                                    background: `conic-gradient(${conicGradient})`
                                }}
                            >
                                <div className="absolute inset-4 bg-[#0f0f1a] rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white"> Cost %</div>
                                        <div className="text-gray-300 text-sm">where your donation goes</div>
                                    </div>
                                </div>
                            </div>

                            {/* Allocation Details */}
                            <div className="w-full space-y-4">
                                {allocationData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50 hover:border-indigo-500"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-white flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                                {item.label}
                                            </h3>
                                            <span className="font-bold text-lg text-white px-3 py-1 rounded-full">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {item.label === "Storage Costs" && "Ensures we can host all game files and updates"}
                                            {item.label === "Server Costs" && "Keeps our servers running for smooth downloads"}
                                            {item.label === "Miscellaneous" && "Renewals, maintenance, and community support"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Methods Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Other Donation Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* UPI Card */}
                    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6 rounded-2xl shadow-xl border border-purple-500/20 text-center transform transition-all duration-300 hover:-translate-y-1">
                        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">UPI Payment</h3>
                        <p className="text-gray-300 mb-4">
                            PhonePe, Paytm, Google Pay, etc.
                        </p>

                        <div className="mt-4">
                            <div className="border border-purple-500/20 rounded-xl p-5 bg-black/30 backdrop-blur-sm">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-white border-4 border-purple-500/20 rounded-xl shadow-lg overflow-hidden">
                                        <img
                                            src="https://i.postimg.cc/zD71FFgv/Screenshot-2025-03-26-at-1-33-37-AM.png"
                                            alt="Telegram QR Code"
                                            className="w-40 h-40 object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="bg-black/50 p-3 rounded-lg text-sm font-mono text-center text-gray-300 border border-blue-500/20">
                                    <span className="text-blue-400 font-semibold">Telegram:</span> DM for UPI details
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Crypto Card */}
                    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6 rounded-2xl shadow-xl border border-indigo-500/20 text-center transform transition-all duration-300 hover:-translate-y-1">
                        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Crypto Donations</h3>
                        <p className="text-gray-300 mb-4">
                            Support us with cryptocurrency
                        </p>

                        <div className="mt-4">
                            <div className="border border-indigo-500/20 rounded-xl p-5 bg-black/30 backdrop-blur-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
                                        <h4 className="font-medium text-red-400 mb-2">USDT (TRC20)</h4>
                                        <div className="text-xs break-all font-mono text-gray-300">
                                            TFq2xVb7ibR7q5Mb1pkWiiCT34BmS3y2gi
                                        </div>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/20">
                                        <h4 className="font-medium text-yellow-400 mb-2">USDT (BSC)</h4>
                                        <div className="text-xs break-all font-mono text-gray-300">
                                            0x291dce3bd01fceec0665b9d6b9734946e335954b
                                        </div>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded-lg border border-orange-500/20">
                                        <h4 className="font-medium text-orange-400 mb-2">BTC</h4>
                                        <div className="text-xs break-all font-mono text-gray-300">
                                            1DLfx6a4CU7G9Abj9fedxpdY21srPPstbX
                                        </div>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/20">
                                        <h4 className="font-medium text-purple-400 mb-2">ETH</h4>
                                        <div className="text-xs break-all font-mono text-gray-300">
                                            0x291dce3bd01fceec0665b9d6b9734946e335954b
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Project completed...</h1>
                <div className="p-8 rounded-2xl border-2 border-dashed border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#2a0f0f] shadow-lg relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-600/20 rounded-full blur-xl"></div>

                    <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl border border-red-500/20">
                        <img
                            className="w-full h-auto"
                            src="https://i.postimg.cc/WzF6znR8/God-of-war-ragnarok-banner-black-background-2-817x320.jpg"
                            alt="God of War Ragnarok"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-3">Ragnarok is Finished.</h2>
                    </div>

                    <div className="animate-pulse text-red-400 font-medium p-3 bg-black/30 rounded-lg border border-red-500/20">
                        After the completion of above game, then the other games will be posted.
                    </div>

                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-full shadow-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-bold text-white"> Closed...</span>
                    </div>
                </div>
            </section>

            {/* Navigation Footer */}
            <div className="text-center mt-12">
                <Link
                    to="/"
                    className="inline-flex items-center text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Donate;