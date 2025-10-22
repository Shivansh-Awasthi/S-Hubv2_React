import React from 'react';
import { Link } from 'react-router-dom';

const Dmca = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                        DMCA & Copyright
                    </h1>
                    <p className="text-lg text-gray-400">
                        Information for copyright holders
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
                    <div className="prose prose-invert max-w-none">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Digital Millennium Copyright Act (DMCA)</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                If you are the copyright holder of materials (texts, photographs or other objects of copyright)
                                posted on the Site and/or your rights are in any other way violated by the materials of the Site,
                                please send a corresponding request to the Site Administration.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-4">How to Submit a DMCA Notice</h3>
                            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                                <p className="text-gray-300 mb-4">
                                    Send your DMCA notice to our designated email address:
                                </p>
                                <div className="text-center">
                                    <a
                                        href="mailto:support@toxicgames.in"
                                        className="inline-flex items-center text-lg text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                    >
                                        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        support@toxicgames.in
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Required Information</h3>
                            <p className="text-gray-300 mb-4">
                                Please provide comprehensive evidence of ownership of the exclusive right to the
                                relevant materials (works) and/or other information and data on the essence of the violation of rights, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Identification of the copyrighted work claimed to have been infringed</li>
                                <li>Identification of the material that is claimed to be infringing</li>
                                <li>Your contact information (address, telephone number, and email address)</li>
                                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                                <li>A statement that the information in the notification is accurate</li>
                                <li>Your physical or electronic signature</li>
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Response Time</h3>
                            <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                                <p className="text-amber-200">
                                    Your request will be considered by the Site Administration within 7 (Seven) business days
                                    from the date of receipt of the request with comprehensive data and confirmation of the violation of your rights.
                                </p>
                            </div>
                        </div>

                        <div className="bg-green-900/20 border border-green-700/50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-green-400 mb-3">Pre-Trial Settlement</h3>
                            <p className="text-green-200">
                                In accordance with the current norms of the legislation of the Indian laws, the Site Administration
                                is ready to consider all disputed issues within the framework of the pre-trial settlement procedure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Counter Notification</h3>
                        <p className="text-gray-300 text-sm">
                            If you believe your content was wrongly removed, you may submit a counter-notification
                            with evidence that you have the rights to the content.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Repeat Infringers</h3>
                        <p className="text-gray-300 text-sm">
                            We maintain a policy of terminating repeat infringers' accounts in appropriate circumstances.
                        </p>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="text-center space-y-4">
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                        <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                        <Link to="/policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                        <Link to="/contacts" className="hover:text-cyan-400 transition-colors">Contact</Link>
                        <Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} ToxicGames. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dmca;