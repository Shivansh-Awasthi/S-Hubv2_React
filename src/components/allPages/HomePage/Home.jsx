import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuAppWindowMac } from "react-icons/lu";
import { FaAndroid } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa";
import { useAuth } from '../../../contexts/AuthContext.jsx';
import HomeSkeleton from '../../skeletons/HomeSkeleton';
import axios from 'axios';
import RandomGame from '../../sidePages/RandomGames/RandomGame';

const images = [
    'https://i.postimg.cc/YSVmm4NJ/god-of-war-ragnarok-game-art-wallpaper-2560x1600-7.jpg',
    'https://i.postimg.cc/9fymd8Xw/img-5817.avif',
    'https://img.playbook.com/fEFoQgs0r1pXKzOJcJIfIevmy08UHSLlInS1-Fcp8uc/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2RkZGUzOTQ1/LTQwNzMtNDMxNy05/N2QyLTk3OTJkNDFi/OTBlNQ',
    'https://img.playbook.com/X0CxPl24l4RbK0kdRTk7NAtbQVW_5S9PYB05cE4vFZk/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzM1MThlMDAx/LTNiYWQtNGQxZS1i/OWQ0LTY1MmM5MWQx/OTU4Yw'
];

const HomeClient = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // Data state for all sections
    const [macGames, setMacGames] = useState([]);
    const [macSoftwares, setMacSoftwares] = useState([]);
    const [pcGames, setPcGames] = useState([]);
    const [androidGames, setAndroidGames] = useState([]);
    const [ps2Games, setPs2Games] = useState([]);
    const [totalMacGames, setTotalMacGames] = useState(0);
    const [totalMacSoft, setTotalMacSoft] = useState(0);
    const [totalPcGames, setTotalPcGames] = useState(0);
    const [totalAndroidGames, setTotalAndroidGames] = useState(0);
    const [totalPs2Iso, setTotalPs2Iso] = useState(0);

    // For count visitors accessible/visible only for the admins
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useAuth(); // global auth

    // Fetch all data on mount
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [macGamesRes, macSoftRes, pcGamesRes, androidGamesRes, ps2GamesRes] = await Promise.all([
                    fetch(`${process.env.VITE_API_URL}/api/apps/category/mac?sortBy=oldest`, { headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN } }),
                    fetch(`${process.env.VITE_API_URL}/api/apps/category/smac`, { headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN } }),
                    fetch(`${process.env.VITE_API_URL}/api/apps/category/pc?page=1&limit=48`, { headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN } }),
                    fetch(`${process.env.VITE_API_URL}/api/apps/category/android`, { headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN } }),
                    fetch(`${process.env.VITE_API_URL}/api/apps/category/ps2`, { headers: { 'X-Auth-Token': process.env.VITE_API_TOKEN } })
                ]);
                const [macGamesData, macSoftData, pcGamesData, androidGamesData, ps2GamesData] = await Promise.all([
                    macGamesRes.json(),
                    macSoftRes.json(),
                    pcGamesRes.json(),
                    androidGamesRes.json(),
                    ps2GamesRes.json()
                ]);

                setMacGames(macGamesData.apps || []);
                setTotalMacGames(macGamesData.total || 0);
                setMacSoftwares(macSoftData.apps || []);
                setTotalMacSoft(macSoftData.total || 0);
                setPcGames(pcGamesData.apps || []);
                setTotalPcGames(pcGamesData.total || 0);
                setAndroidGames(androidGamesData.apps || []);
                setTotalAndroidGames(androidGamesData.total || 0);
                setPs2Games(ps2GamesData.apps || []);
                setTotalPs2Iso(ps2GamesData.total || 0);
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchAll();
    }, []);

    // React to global auth changes
    useEffect(() => {
        if (user && user.role === 'ADMIN') setIsAdmin(true);
        else setIsAdmin(false);
    }, [user]);

    const createSlug = (text = '') => {
        // First ensure we have a string
        const str = String(text || '');
        return str
            .toLowerCase() // Convert to lowercase
            .trim() // Remove whitespace from both ends
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars (except hyphens)
            .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+/, '') // Remove leading hyphens
            .replace(/-+$/, '') // Remove trailing hyphens
            || 'untitled'; // Fallback if empty
    };

    // Auto-advance slider every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const isLoading =
        macGames.length === 0 ||
        macSoftwares.length === 0 ||
        pcGames.length === 0 ||
        androidGames.length === 0 ||
        ps2Games.length === 0;

    if (isLoading) {
        return <HomeSkeleton />;
    }


    return (
        <div className="relative">
            {/* Background decorative elements */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-600 opacity-5 rounded-full blur-3xl -z-10"></div>
            <div className="fixed top-1/3 left-1/4 w-64 h-64 bg-purple-600 opacity-5 rounded-full blur-3xl -z-10"></div>

            {/* Decorative grid lines */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iIzJkMmQyZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] bg-center opacity-40 -z-10"></div>

            {/* Unified Modern Glassy Slider for all screens */}
            <div className="pb-6 lg:pb-8 w-full">
                <div className="relative w-full aspect-[2.4/1] rounded-lg overflow-hidden">
                    {/* Edge overlays for glassy effect */}
                    <div className="absolute inset-0 pointer-events-none z-12">
                        <div className="absolute top-0 inset-x-0">
                            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-950 via-gray-950/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0">
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
                        </div>
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent"></div>
                        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 via-gray-950/60 to-transparent"></div>
                    </div>

                    {/* Slides */}
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`transition-opacity duration-700 ease-in-out absolute inset-0 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                        >
                            <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105" alt={`Slide ${index + 1}`} />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/50 to-transparent"></div>

                            {/* Overlay content */}
                            {index === 3 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-10 w-full">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">SOFTWARE</h2>
                                    <p className="mb-4 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Download Free Softwares On Your Mac</p>
                                    <div className='w-fill'>
                                        <Link to="/category/mac/softwares">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Download Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {index === 0 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-10">
                                    <h2 className="text-lg font-base mb-4 sm:text-base md:text-lg">Exclusive Games</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">To get our Exclusive Mac games Messege on my <a href="https://t.me/n0t_ur_type" className='text-cyan-500' target='_blank' rel="noopener noreferrer">Telegram</a></p>
                                    <div className='w-fill'>
                                        <a href="https://t.me/n0t_ur_type" target='_blank' rel="noopener noreferrer">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Send message..
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            )}
                            {index === 2 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-10">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">Macbook Games</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Download Your Favourite Games for Free.</p>
                                    <div className='w-fill'>
                                        <Link to="/category/mac/games">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Download Now..
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {index === 1 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-10">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">Game Request</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Request your favourite games here.</p>
                                    <div className='w-fill'>
                                        <Link to="/request">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Request Now!
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Progress bar and nav buttons */}
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="absolute bottom-8 left-0 right-0 z-12 flex items-center justify-between">
                            {/* Progress bar */}
                            <div className="w-1/3">
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}></div>
                                </div>
                            </div>
                            {/* Nav buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300"
                                    aria-label="Previous slide"
                                    onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button
                                    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300"
                                    aria-label="Next slide"
                                    onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pagination Dots for all screens */}
                    <div className="absolute flex space-x-3 bottom-7 left-1/2 transform -translate-x-1/2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-6 shadow-lg'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mac Games Category */}
            <div className="container mx-auto p-2 mb-6">
                <div className="cover mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10 -translate-y-1/2"></div>
                    <h2 className="text-2xl font-bold relative">
                        <span className="text-white">
                            Mac Games{' '}
                            <span className="font-medium text-white">{totalMacGames}</span>
                        </span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    </h2>
                    <Link
                        to="/category/mac/games"
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Conditional rendering based on data existence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {Array.isArray(macGames) && macGames.length > 0 ? (
                        macGames.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                to={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                            >
                                {/* Ambient background elements - always visible */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                {/* Subtle overlay gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

                                <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                                    <img
                                        src={ele.coverImg}
                                        alt={ele.title}
                                        className="w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-in-out transform group-hover:scale-110"
                                    />
                                </figure>

                                {/* Game platform badge */}
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                    <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                        <LuAppWindowMac className="mr-1" />
                                        Mac
                                    </div>
                                </div>

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    {/* Glowing separator line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-white pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="text-xs font-normal text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {ele.size}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Mac Games...</div>
                    )}
                </div>
            </div>

            {/* Mac Softwares */}
            <div className='container mx-auto p-2 mb-6'>
                <div className="cover mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10 -translate-y-1/2"></div>
                    <h2 className="text-2xl font-bold relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Mac Softwares{' '}
                            <span className="font-medium text-blue-400">{totalMacSoft}</span>
                        </span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    </h2>
                    <Link
                        to="/category/mac/softwares"
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Conditional rendering for Mac Softwares */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(macSoftwares) && macSoftwares.length > 0 ? (
                        macSoftwares.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                to={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                            >
                                {/* Ambient background elements - always visible */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <div className="flex flex-col justify-center items-center h-36 bg-gradient-to-br from-[#1E1E1E] to-[#121212] pt-4 relative">
                                    {/* App icon with enhanced styling */}
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                        <img
                                            src={ele.thumbnail[0]}
                                            alt={ele.title}
                                            className="relative rounded-lg w-16 h-16 transition-transform duration-700 ease-in-out transform group-hover:scale-110 border border-purple-500/20 z-10"
                                        />
                                    </div>

                                    {/* Software platform badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                        <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                            <LuAppWindowMac className="mr-1" />
                                            Mac App
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    {/* Glowing separator line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-white text-center pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="text-xs font-normal text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {ele.size}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Mac Softwares...</div>
                    )}
                </div>
            </div>

            {/* PC Games */}
            <div className='container mx-auto p-2 mb-6'>
                <div className="cover mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10 -translate-y-1/2"></div>
                    <h2 className="text-2xl font-bold relative">
                        <span className="text-white">
                            PC Games{' '}
                            <span className="font-medium text-white">{totalPcGames}</span>
                        </span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    </h2>
                    <Link
                        to="/category/pc/games"
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {Array.isArray(pcGames) && pcGames.length > 0 ? (
                        pcGames.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                to={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                            >
                                {/* Ambient background elements - always visible */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                {/* Subtle overlay gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

                                <figure className="flex justify-center items-center rounded-t-xl overflow-hidden h-full">
                                    <img
                                        src={ele.coverImg}
                                        alt={ele.title}
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

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    {/* Glowing separator line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-white pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="text-xs font-normal text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {ele.size}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading PC Games...</div>
                    )}
                </div>
            </div>

            {/* Android Games */}
            <div className='container mx-auto p-2 mb-6'>
                <div className="cover mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10 -translate-y-1/2"></div>
                    <h2 className="text-2xl font-bold relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Android Games{' '}
                            <span className="font-medium text-blue-400">{totalAndroidGames}</span>
                        </span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    </h2>
                    <Link
                        to="/category/android/games"
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(androidGames) && androidGames.length > 0 ? (
                        androidGames.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                to={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                            >
                                {/* Ambient background elements - always visible */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <div className="flex flex-col justify-center items-center h-36 bg-gradient-to-br from-[#1E1E1E] to-[#121212] pt-4 relative">
                                    {/* App icon with enhanced styling */}
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                        <img
                                            src={ele.thumbnail[0]}
                                            alt={ele.title}
                                            className="relative rounded-lg w-16 h-16 transition-transform duration-700 ease-in-out transform group-hover:scale-110 border border-purple-500/20 z-10"
                                        />
                                    </div>

                                    {/* Android platform badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                        <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                            <FaAndroid className='mr-2' />
                                            Android
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    {/* Glowing separator line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white text-center pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group-hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="text-xs font-normal text-gray-400 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {ele.size}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Android Games...</div>
                    )}
                </div>
            </div>

            {/* PS2 Roms */}
            <div className='container mx-auto p-2 mb-6'>
                <div className="cover mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-10 blur-xl -z-10 -translate-y-1/2"></div>
                    <h2 className="text-2xl font-bold relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            PS2 Roms{' '}
                            <span className="font-medium text-blue-400">{totalPs2Iso}</span>
                        </span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    </h2>
                    <Link
                        to="/category/ps2/iso"
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(ps2Games) && ps2Games.length > 0 ? (
                        ps2Games.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                to={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="group flex flex-col rounded-xl h-52 overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl border border-purple-600/20 relative"
                            >
                                {/* Ambient background elements - always visible */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600 opacity-10 rounded-full blur-xl"></div>

                                <div className="flex flex-col justify-center items-center h-36 bg-gradient-to-br from-[#1E1E1E] to-[#121212] pt-4 relative">
                                    {/* App icon with enhanced styling */}
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                                        <img
                                            src={ele.thumbnail[0]}
                                            alt={ele.title}
                                            className="relative rounded-lg w-16 h-16 transition-transform duration-700 ease-in-out transform group-hover:scale-110 border border-purple-500/20 z-10"
                                        />
                                    </div>

                                    {/* PS2 platform badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-purple-600/20">
                                        <div className="text-[10px] font-medium text-blue-400 flex items-center">
                                            <FaPlaystation className='mr-1' />
                                            PS2
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col p-3 bg-gradient-to-br from-[#1E1E1E] to-[#121212] flex-grow relative">
                                    {/* Glowing separator line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>

                                    <div className="text-sm font-medium text-white text-center pb-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:from-blue-400 group_hover:to-purple-400 transition-colors duration-300">
                                        {ele.title}
                                    </div>
                                    <div className="text-xs font-normal text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-400">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        </svg>
                                        {ele.size}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading PS2 Roms...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeClient;