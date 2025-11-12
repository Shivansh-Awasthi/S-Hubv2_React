import { Link } from 'react-router-dom';
import { FaCrown, FaCoffee, FaGamepad, FaLockOpen, FaShieldAlt, FaRupeeSign, FaDollarSign } from "react-icons/fa";

const Membership = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Premium Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center">
                            <FaCrown className="mr-2" />
                            PREMIUM MEMBERSHIP
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 mb-4">
                        Unlock Premium Access
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Become a member to access all exclusive games and premium features
                    </p>
                    <p className='text-red-400 max-w-2xl mx-auto text-sm mt-2'>Note: Only one time Payment</p>

                    {/* Heartwarming message section */}
                    <div className="mt-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        <p className="mb-4">
                            Hello everyone, the site <span className="font-semibold text-red-600">ToxicGames</span> is going through a big change.
                            I just want to take a moment to thank each and every one of you for the beautiful journey we’ve shared.
                            With all your support and enthusiasm, this site has thrived and grown far beyond what I ever imagined.
                        </p>
                        <p className="mb-4">
                            Unfortunately, I won’t be continuing to run the site due to several reasons.
                            However, for those who have <span className="font-semibold text-violet-400">memberships or purchased games</span>,
                            don’t worry — your access will remain <span className="font-semibold text-amber-400">locked in for another year </span>
                            as per our agreement.
                        </p>
                        <p className="mb-4">
                            The new host will now rely on ads to keep the site running, and while I’m no longer actively managing things,
                            I’m still in touch with many of our wonderful supporters. I’ll do my best to help whenever possible.
                        </p>
                        <p className="mt-6 text-pink-500 font-semibold">
                            Thank you for this beautiful journey. From now on, all games will be free for everyone to enjoy —
                            and our PREMIUM members will continue to receive <span className="underline">early weekly access </span>
                            to new releases.
                        </p>
                        <p className="mt-4 italic text-gray-400">With gratitude,
                            <br />— VenomX 💛
                        </p>
                    </div>
                </div>


                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: <FaGamepad className="text-amber-500" size={30} />,
                            title: "Full Game Access",
                            desc: "Unlock all premium games instantly"
                        },
                        {
                            icon: <FaLockOpen className="text-green-500" size={30} />,
                            title: "No Restrictions",
                            desc: "No download limits or locked content"
                        },
                        {
                            icon: <FaShieldAlt className="text-blue-500" size={30} />,
                            title: "Priority Support",
                            desc: "Dedicated support for members"
                        }
                    ].map((benefit, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
                        >
                            <div className="mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing Options */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-amber-500/30 p-8 mb-16">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Coffee Option */}
                        <div className="flex-1 bg-gradient-to-br from-[#2a1a0a] to-[#3e2a14] p-6 rounded-xl border border-amber-700/50">
                            <div className="flex items-center mb-4">
                                <FaCoffee className="text-amber-500 mr-3" size={24} />
                                <h3 className="text-xl font-bold text-white">Buy Me a Coffee</h3>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-2xl font-bold text-amber-400">
                                        <FaRupeeSign className="mr-1" />
                                        1299
                                    </div>
                                    <div className="text-gray-400">|</div>
                                    <div className="flex items-center text-2xl font-bold text-amber-400">
                                        <FaDollarSign className="mr-1" />
                                        20
                                    </div>
                                </div>
                                <div className="text-gray-400 mt-1">one-time payment</div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Unlock all available premium games",
                                    "Lifetime premium access",
                                    "Priority support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                        </div>
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://ko-fi.com/toxicgames"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
                            >
                                Get Coffee Access
                            </a>
                        </div>

                        {/* Premium Membership */}
                        <div className="flex-1 bg-gradient-to-br from-[#1a0a2a] to-[#241339] p-6 rounded-xl border border-purple-700/50 relative">
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                POPULAR
                            </div>
                            <div className="flex items-center mb-4">
                                <FaCrown className="text-purple-500 mr-3" size={24} />
                                <h3 className="text-xl font-bold text-white">Premium Membership</h3>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-2xl font-bold text-purple-400">
                                        <FaRupeeSign className="mr-1" />
                                        1299
                                    </div>
                                    <div className="text-gray-400">|</div>
                                    <div className="flex items-center text-2xl font-bold text-purple-400">
                                        <FaDollarSign className="mr-1" />
                                        20
                                    </div>
                                </div>
                                <div className="text-gray-400 mt-1">one-time payment</div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Unlock ALL premium games + Upcoming exclusives",
                                    "One Game Port Request",
                                    "Early access to new releases",
                                    "VIP support channel",
                                    "No ads experience"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                        </div>
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://ko-fi.com/toxicgames"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                                Become a Member
                            </a>
                        </div>
                    </div>
                </div>

                {/* FAQ Section - Fixed Telegram Link */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                            <h3 className="font-bold text-white mb-2">How do I get access after purchasing?</h3>
                            <p className="text-gray-400">
                                You'll receive an activation code via{" "}
                                <a
                                    // href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Telegram
                                </a>{" "}
                                that unlocks premium access instantly
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                            <h3 className="font-bold text-white mb-2">Can I upgrade from Coffee to Premium?</h3>
                            <p className="text-gray-400">
                                Yes, you can upgrade anytime by paying the difference
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                            <h3 className="font-bold text-white mb-2">How long does access last?</h3>
                            <p className="text-gray-400">
                                Forever, Premium access is lifetime with one-time payment
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Games
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Membership;