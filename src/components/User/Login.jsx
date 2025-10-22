import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // optional: used only for logging, can remove if unused
import { useAuth, triggerAuthChange } from '../../contexts/AuthContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    // Login function
    const loginUser = async (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch(
                `${process.env.VITE_API_URL}/api/user/signin`,
                {
                    method: 'POST',
                    headers: {
                        'X-Auth-Token': process.env.VITE_API_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Login failed with status ${response.status}`);
            }

            const data = await response.json();

            // Extract user data from response
            const token = data.token;
            const name = data.user.username;
            const role = data.user.role;
            const purchasedGames = data.user.purchasedGames || [];
            const userId = data.user.userId;

            return {
                success: true,
                message: `Welcome back, ${name}!`,
                userData: {
                    token,
                    name,
                    role,
                    userId,
                    purchasedGames
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    // Handle form submission
    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const result = await loginUser(formData);

            if (result.success) {
                // Store token (AuthProvider reads token from localStorage)
                if (result.userData.token) {
                    localStorage.setItem('token', result.userData.token);
                }

                // Optionally store minimal info (not required — AuthProvider will fetch full user)
                if (result.userData.userId) {
                    localStorage.setItem('userId', result.userData.userId);
                }

                // Notify global auth to refresh (AuthProvider listens for this event)
                // prefer triggerAuthChange() helper for clarity
                try { triggerAuthChange(); } catch (e) { /* fallback */ window.dispatchEvent(new Event('auth-change')); }

                // Reset form fields
                setEmail('');
                setPassword('');

                // Show success toast
                toast.success(`${result.message} Redirecting to home...`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                // Clear submitting and redirect
                setIsSubmitting(false);
                setTimeout(() => navigate('/'), 2000);
            } else {
                // Show error toast
                toast.error(result.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 3000,
            });
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFormSubmit(formData);
    };

    return (
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
                        className="mt-10 absolute top-4 left-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white/70 dark:bg-gray-800/70 rounded-full px-3 py-2 shadow-md z-10 transition-all"
                        onClick={() => navigate('/')}
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
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                                Sign in to your account
                            </h3>

                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-sm"
                                    placeholder="email@company.com"
                                    value={email}
                                    onChange={handleEmail}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
                                    Your password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handlePassword}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Signing In...' : 'Login to your account'}
                            </button>

                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center mt-4">
                                Not registered?{' '}
                                <Link to="/signup" className="text-blue-700 hover:underline dark:text-blue-400">
                                    Create account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;