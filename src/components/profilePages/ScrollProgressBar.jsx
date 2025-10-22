import { useState, useEffect } from 'react';

const ScrollProgressBar = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            // Calculate how far the user has scrolled down the page
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollTop / docHeight * 100;
            setScrollProgress(scrollPercent);
        };

        // Add scroll event listener
        window.addEventListener('scroll', updateScrollProgress);

        // Initial calculation
        updateScrollProgress();

        // Clean up event listener
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-50">
            <div
                className="h-full bg-gradient-to-r from-cyan-500 to-pink-700 transition-all duration-150 ease-out shadow-md shadow-blue-500/20"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
};

export default ScrollProgressBar;