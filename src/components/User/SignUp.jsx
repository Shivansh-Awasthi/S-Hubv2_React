import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    // Client-side registration function
    const registerUser = async (userData) => {
        const { username, email, password } = userData;

        // Basic validation
        if (!username || !email || !password) {
            return {
                success: false,
                message: 'All fields are required'
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }

        // Password validation (at least 8 characters)
        if (password.length < 8) {
            return {
                success: false,
                message: 'Password must be at least 8 characters long'
            };
        }

        try {
            const response = await axios.post(
                `${process.env.VITE_API_URL}/api/user/signup`,
                {
                    username,
                    email,
                    password
                },
                {
                    headers: {
                        'X-Auth-Token': process.env.VITE_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                message: 'User created successfully!'
            };
        } catch (error) {
            console.error('Registration error:', error);

            // Handle axios specific errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // If the error status is 409 (Conflict), it means user already exists
                if (error.response.status === 409) {
                    return {
                        success: false,
                        message: 'User already exists!'
                    };
                }

                return {
                    success: false,
                    message: error.response.data?.message || `Registration failed with status ${error.response.status}.`
                };
            } else if (error.request) {
                // The request was made but no response was received
                return {
                    success: false,
                    message: 'No response received from server. Please try again later.'
                };
            } else {
                // Something happened in setting up the request that triggered an Error
                return {
                    success: false,
                    message: `Error: ${error.message}`
                };
            }
        }
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Call the registration function
            const result = await registerUser({ username, email, password });

            if (result.success) {
                // Reset form fields
                setUsername('');
                setEmail('');
                setPassword('');

                // Show success toast
                toast.success(`${result.message} Redirecting to login...`, {
                    position: "top-right",
                    autoClose: 2000, // 2 seconds
                });

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                // Show error toast
                toast.error(result.message, {
                    position: "top-right",
                    autoClose: 3000, // 3 seconds
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 3000, // 3 seconds
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[8px] transition-all min-h-screen">
                <div className="w-full h-full mx-auto flex items-center justify-center">
                    <div className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full p-0">
                        {/* Top Border Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
                        {/* Logo */}
                        <div className="flex justify-center items-center pt-4 pb-1">
                            <img
                                src="https://i.postimg.cc/9fxCdJDc/image-removebg-preview.png"
                                alt="Site Logo"
                                className="h-36 w-auto object-contain drop-shadow-xl opacity-90"
                                style={{ filter: 'drop-shadow(0 2px 8px rgba(60,60,120,0.15))' }}
                            />
                        </div>
                        {/* Back Button */}
                        <button
                            type="button"
                            className="mt-5 absolute top-4 left-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white/70 dark:bg-gray-800/70 rounded-full px-3 py-2 shadow-md z-10 transition-all"
                            onClick={() => window.location.href = '/'}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium text-sm">Back</span>
                        </button>
                        <div className="p-8 sm:pt-1 pt-2">
                            <form
                                ref={formRef}
                                className="space-y-7"
                                onSubmit={handleFormSubmit}
                            >
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Sign Up</h3>
                                <div>
                                    <label htmlFor="username" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-sm"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={handleUsername}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-sm"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={handleEmail}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePassword}
                                        required
                                        minLength={8}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </button>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center mt-4">
                                    Already have an account? <a href="/login" className="text-blue-700 hover:underline dark:text-blue-400">Sign in</a>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Signup;