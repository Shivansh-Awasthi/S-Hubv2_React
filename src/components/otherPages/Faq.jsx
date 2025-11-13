import React, { useState, useEffect } from 'react';

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Load Vimeo player script
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script when component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const faqData = [
        {
            question: "Is the program damaged? Is the file broken? Or other errors?",
            answer: `Enter the command in terminal: <span class="text-amber-400 font-mono">xattr -cr</span> then after it space and then drop the application to the terminal and press Enter.</br></br>
      
      Or you can disable gatekeeper globally by entering <span class="text-amber-400 font-mono">sudo spctl --master-disable</span> in terminal.</br></br>
      
      Below I've analyzed the most common <span class="text-red-400">FIX</span> in this video.`
        },
        {
            question: "How to download? Link not working? What is .torrent?",
            answer: `To download large files, it's recommended to use any download manager, for example, <span class="text-amber-400">FDM (Free Download Manager)</span>.</br></br>
      It's not recommended to use Safari browser to download from file sharing services. Use Google Chrome or FDM instead.</br></br>
      To download files via torrent (.torrent file) you need a Torrent client like Transmission or FDM.</br></br>
      Do not forget that providers can block access to some sites; <span class="text-amber-400">to bypass blocking it's recommended to use a VPN.</span>`
        },
        {
            question: "How to change the language?",
            answer: `Open System Preferences → General → Language & Region → Applications → "+".</br></br>
      Select the application and language. This method works for most applications.</br></br>
      The language in Adobe products is usually selected during installation.</br></br>
      The language in games is usually changed in the game settings.</br></br>
      There are exceptions - feel free to search for information online.`
        },
        {
            question: "How to delete applications?",
            answer: `There are many options. The easiest is to use special utilities for removing applications, like App Cleaner & Uninstaller.</br></br>
      To remove Adobe products, use the Creative Cloud Cleaner Tool.`
        },
        {
            question: "Are the games safe to download?",
            answer: `All games are thoroughly scanned before being uploaded. We use industry-standard antivirus software to ensure safety.</br></br>
      However, we recommend keeping your own antivirus software updated for additional protection.`
        },
        {
            question: "Can I request specific games?",
            answer: `Yes! We welcome game requests from our community. Visit our Discord server to submit your requests.</br></br>
      We prioritize requests based on popularity and feasibility.`
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Find answers to common questions about downloading, installing, and troubleshooting games from ToxicGame.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 ${activeIndex === index ? 'ring-2 ring-cyan-500/50' : 'hover:bg-gray-800/70'
                                }`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={activeIndex === index}
                            >
                                <h3 className="text-lg md:text-xl font-medium text-gray-100 pr-4">{item.question}</h3>
                                <div className="flex-shrink-0 ml-4">
                                    <svg
                                        className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div
                                    className="px-6 pb-6 text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                />

                                {index === 0 && (
                                    <div className="px-6 pb-6">
                                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                            <div className="relative w-full h-full">
                                                <iframe
                                                    src="https://player.vimeo.com/video/1046166571?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    title="Fix. The application is damaged and cannot be opened, you should move it to the bin."
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-1 mb-6 md:mb-0 md:pr-8">
                            <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
                            <p className="text-gray-400 mb-4">
                                Join our Discord community where our support team and other members can help you with any issues.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.47V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.045-.047zm.168 4.413c.803 0 1.456.724 1.456 1.623 0 .899-.653 1.622-1.456 1.622-.804 0-1.456-.723-1.456-1.622 0-.899.652-1.623 1.456-1.623zm-4.543 0c.804 0 1.456.724 1.456 1.623 0 .899-.652 1.622-1.456 1.622-.803 0-1.456-.723-1.456-1.622 0-.899.653-1.623 1.456-1.623z" />
                                </svg>
                                Join Discord (coming soon)
                            </a>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="inline-block p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;