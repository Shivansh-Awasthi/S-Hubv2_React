import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
	// ...component logic...
	const navigate = useNavigate();
	const [count, setCount] = useState(5);

	useEffect(() => {
		if (count <= 0) {
			navigate('/');
			return;
		}
		const t = setTimeout(() => setCount(c => c - 1), 1000);
		return () => clearTimeout(t);
	}, [count, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-transparent">
			<div className="w-full max-w-4xl mx-auto p-8 rounded-2xl backdrop-blur-md bg-black/40 border border-gray-800/50 shadow-2xl">
				<div className="flex flex-col lg:flex-row items-center gap-8">
					<div className="flex-1 text-center lg:text-left">
						<div className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
							404
						</div>
						<h1 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-100">
							Page not found
						</h1>
						<p className="mt-3 text-sm md:text-base text-gray-300 max-w-lg">
							The page you are looking for doesn't exist or has been moved.
							You will be redirected to the home page in <span className="font-medium text-white">{count}</span> seconds.
						</p>

						<div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
							<Link to="/" onClick={() => navigate('/')} className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow hover:scale-[1.02] transition-transform">
								Go home now
							</Link>
							<button
								onClick={() => navigate('/')}
								className="inline-flex items-center px-4 py-3 rounded-lg bg-white/5 text-gray-200 border border-gray-700 hover:bg-white/6 transition"
							>
								Or open homepage
							</button>
						</div>
					</div>

					<div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
						<div className="rounded-xl p-4 bg-gradient-to-br from-[#0b1220]/60 to-[#071022]/60 border border-gray-800/40 shadow-inner">
							<div className="text-sm text-gray-400 mb-2">Lost in space?</div>
							<div className="h-40 flex items-center justify-center rounded-md overflow-hidden">
								{/* decorative SVG / illustration */}
								<svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
									<rect x="0" y="0" width="180" height="140" rx="12" fill="url(#g)" />
									<g opacity="0.12" fill="white">
										<circle cx="140" cy="20" r="6" />
										<circle cx="20" cy="30" r="3" />
										<circle cx="60" cy="90" r="4" />
									</g>
									<path d="M30 110 C60 80 120 80 150 110" stroke="white" strokeOpacity="0.06" strokeWidth="8" strokeLinecap="round" />
									<g transform="translate(40,20)" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.9">
										<circle cx="40" cy="40" r="28" strokeLinecap="round" />
										<path d="M40 12 L46 34 L62 36" strokeLinecap="round" strokeLinejoin="round" />
									</g>
									<defs>
										<linearGradient id="g" x1="0" x2="1">
											<stop offset="0" stopColor="#0f172a" stopOpacity="0.6" />
											<stop offset="1" stopColor="#020617" stopOpacity="0.6" />
										</linearGradient>
									</defs>
								</svg>
							</div>
							<p className="text-xs text-gray-400 mt-3">Try searching or navigate using the menu.</p>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center text-xs text-gray-500">
					If you think this is an error, contact support.
				</div>
			</div>
		</div>
	);
}
