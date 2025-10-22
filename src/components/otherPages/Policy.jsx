import { Link } from 'react-router-dom';

const Policy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Policy Content */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
                    <div className="prose prose-invert max-w-none">
                        <div className="space-y-8">
                            {/* Introduction */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Welcome to ToxicGames. We are committed to protecting your privacy and ensuring
                                    transparency about how we handle your information. This Privacy Policy explains
                                    what information we collect, how we use it, and your rights regarding your data.
                                </p>
                            </section>

                            {/* Information Collection */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">Personal Information</h3>
                                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                            <li>Email address (for account creation and communication)</li>
                                            <li>Username and profile information</li>
                                            <li>Payment information (processed securely through third-party providers)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">Usage Data</h3>
                                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                            <li>IP address and browser type</li>
                                            <li>Pages visited and time spent on site</li>
                                            <li>Download history and preferences</li>
                                            <li>Device information and operating system</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* How We Use Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Provide and maintain our gaming services</li>
                                    <li>Process transactions and deliver purchased content</li>
                                    <li>Improve user experience and site functionality</li>
                                    <li>Communicate important updates and security notices</li>
                                    <li>Prevent fraud and ensure platform security</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </section>

                            {/* Data Sharing */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    We do not sell your personal information to third parties. We may share your data with:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>
                                        <strong>Payment Processors:</strong> Secure payment providers like Ko-fi for transaction processing
                                    </li>
                                    <li>
                                        <strong>Service Providers:</strong> Trusted partners who help us operate our platform
                                    </li>
                                    <li>
                                        <strong>Legal Requirements:</strong> When required by law or to protect our rights
                                    </li>
                                </ul>
                            </section>

                            {/* Data Security */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We implement appropriate security measures to protect your personal information,
                                    including encryption, secure servers, and regular security assessments. However,
                                    no method of transmission over the internet is 100% secure, and we cannot guarantee
                                    absolute security.
                                </p>
                            </section>

                            {/* User Rights */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Access and review your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Export your data in a portable format</li>
                                </ul>
                            </section>

                            {/* Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    We use cookies and similar technologies to:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Remember your preferences and login status</li>
                                    <li>Analyze site traffic and usage patterns</li>
                                    <li>Improve our services and user experience</li>
                                </ul>
                                <p className="text-gray-300 leading-relaxed mt-4">
                                    You can control cookie settings through your browser preferences.
                                </p>
                            </section>

                            {/* Third-Party Links */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Our platform may contain links to external sites. We are not responsible for
                                    the privacy practices or content of these third-party websites. We encourage
                                    you to review their privacy policies before providing any personal information.
                                </p>
                            </section>

                            {/* Children's Privacy */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Our services are not directed to individuals under the age of 13. We do not
                                    knowingly collect personal information from children under 13. If you believe
                                    we have collected information from a child under 13, please contact us immediately.
                                </p>
                            </section>

                            {/* Policy Changes */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We may update this Privacy Policy from time to time. We will notify you of
                                    any significant changes by posting the new policy on this page and updating
                                    the "Last updated" date. Your continued use of our services after changes
                                    constitutes acceptance of the updated policy.
                                </p>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    If you have any questions about this Privacy Policy or our data practices,
                                    please contact us:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-2">
                                    <li>Email: privacy@toxicgames.com</li>
                                    <li>Telegram: <a href="https://t.me/n0t_ur_type" className="text-cyan-400 hover:text-cyan-300">@n0t_ur_type</a></li>
                                    <li>Discord: ToxicGames Community</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-2">Data Retention</h4>
                            <p className="text-gray-300 text-sm">
                                We retain your personal data only as long as necessary to provide our services
                                and comply with legal obligations. You can request data deletion at any time.
                            </p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-2">International Transfers</h4>
                            <p className="text-gray-300 text-sm">
                                Your data may be processed in countries other than your own. We ensure appropriate
                                safeguards are in place for international data transfers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="text-center space-y-4">
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                        <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                        <Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link>
                        <Link to="/contacts" className="hover:text-cyan-400 transition-colors">Contact</Link>
                        <Link to="/donate" className="hover:text-cyan-400 transition-colors">Donate</Link>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} ToxicGames. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Policy;