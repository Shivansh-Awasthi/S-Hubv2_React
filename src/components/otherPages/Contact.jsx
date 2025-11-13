import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contacts = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const contactData = [
        {
            question: "Help with software installation",
            answer: `If you need assistance installing any app, simply join our <a class="text-cyan-400 hover:text-cyan-300 transition-colors font-medium" href="https://t.me/downloadmacgames" target="_blank" rel="noopener noreferrer">Telegram channel</a> and contact the Admins there.`,
            icon: (
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            )
        },
        {
            question: "Information for copyright holders (DMCA)",
            answer: `If you are the copyright holder of materials posted on our site and believe your rights have been violated, please send a detailed request to our Administration at <a class="text-blue-400 hover:text-blue-300 transition-colors font-medium" href="mailto:support@toxicgame.net">support@toxicgame.net</a> with comprehensive evidence of ownership.
        <br /><br />
        Your request will be reviewed within 5 business days. We are committed to resolving all disputes through pre-trial settlement procedures in accordance with applicable laws.`,
            icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            question: "Share the app",
            answer: `Users with working releases can share them on our <a class="text-cyan-400 hover:text-cyan-300 transition-colors font-medium" href="https://t.me/downloadmacgames" target="_blank" rel="noopener noreferrer">Telegram channel</a>.`,
            icon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )
        },
        {
            question: "Development and design",
            answer: `Developer: <a class="text-purple-400 hover:text-purple-300 transition-colors font-medium" href="https://t.me/downloadmacgames" target="_blank" rel="noopener noreferrer">#VenomX</a>
        <br /><br />
        Design: <a class="text-purple-400 hover:text-purple-300 transition-colors font-medium" href="https://t.me/downloadmacgames" target="_blank" rel="noopener noreferrer">#VenomX</a>`,
            icon: (
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            )
        }
    ];

    const toggleItem = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                        Contact ToxicGame
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Get support, report issues, or connect with our team
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                        <div className="flex items-start mb-8">
                            <div className="bg-cyan-900/30 p-3 rounded-xl border border-cyan-500/30 mr-4">
                                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-100 mb-2">Email Support</h3>
                                <a
                                    href="mailto:support@toxicgame.net"
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
                                >
                                    support@toxicgame.net
                                </a>
                                <p className="text-gray-400 mt-2">For general inquiries and support requests</p>
                            </div>
                        </div>

                        <div className="flex items-start mb-8">
                            <div className="bg-blue-900/30 p-3 rounded-xl border border-blue-500/30 mr-4">
                                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-100 mb-2">Telegram Support</h3>
                                <a
                                    href="https://t.me/downloadmacgames"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                                >
                                    t.me/downloadmacgames
                                </a>
                                <p className="text-gray-400 mt-2">For real-time assistance and community support</p>
                            </div>
                        </div>

                        <div className="flex items-start mb-8">
                            <div className="bg-purple-900/30 p-3 rounded-xl border border-purple-500/30 mr-4">
                                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-100 mb-2">Community</h3>
                                <a
                                    href="https://t.me/downloadmacgames"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors text-lg"
                                >
                                    Join our Telegram community
                                </a>
                                <p className="text-gray-400 mt-2">Connect with other gamers and share experiences</p>
                            </div>
                        </div>

                        {/* Advertisement Section */}
                        <div className="flex items-start">
                            <div className="bg-green-900/30 p-3 rounded-xl border border-green-500/30 mr-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-100 mb-2">Advertisement</h3>

                                <a
                                    href="https://t.me/downloadmacgames"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 transition-colors text-lg">
                                    support@toxicgame.net
                                </a>
                                <p className="text-gray-300 mt-3">
                                    Interested in advertising or collaborating with us?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Send us a message</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-400 mb-2" htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="Enter Your Name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2" htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="Tell us about your inquiry..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                    </div>

                    <div className="divide-y divide-gray-700">
                        {contactData.map((item, index) => (
                            <div
                                key={index}
                                className={`transition-colors ${activeIndex === index ? 'bg-gray-800/70' : 'hover:bg-gray-800/30'}`}
                            >
                                <button
                                    className="w-full flex items-center p-6 text-left"
                                    onClick={() => toggleItem(index)}
                                >
                                    <div className="mr-4">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-100">{item.question}</h3>
                                        <span className="text-gray-400 text-xl font-medium ml-4">
                                            {activeIndex === index ? '−' : '+'}
                                        </span>
                                    </div>
                                </button>

                                {activeIndex === index && (
                                    <div
                                        className="px-6 pb-6 ml-14 text-gray-300 leading-relaxed transition-all duration-500"
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
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

                <div className="mt-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} ToxicGame. All rights reserved.</p>
                    <p className="mt-2">
                        Made with <span className="text-red-500">❤</span> for the gaming community
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contacts;