'use client';

import React from 'react';

/**
 * Enhanced pagination component with modern design
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Function to call when page changes
 * @param {boolean} props.isLoading - Whether the page is currently loading
 */
const EnhancedPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false
}) => {
    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    // Generate pagination numbers with ellipsis for large page counts
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if there are few
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Complex pagination with ellipsis
            if (currentPage <= 3) {
                // Near the start
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('ellipsis');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                pageNumbers.push(1);
                pageNumbers.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Middle
                pageNumbers.push(1);
                pageNumbers.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('ellipsis');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex justify-center mt-8">
            <nav aria-label="Page navigation" className="inline-flex items-center">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`relative px-4 py-2.5 rounded-l-md text-sm font-medium transition-all duration-200
            ${currentPage === 1 || isLoading
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:text-white hover:scale-105'
                        } border-r border-gray-600 focus:z-20 focus:outline-none transform transition-transform`}
                    disabled={currentPage === 1 || isLoading}
                    aria-label="Previous page"
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>

                {/* Page Numbers - Desktop */}
                <div className="hidden sm:flex">
                    {pageNumbers.map((pageNumber, index) => {
                        if (pageNumber === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-400 bg-[#2c2c2c] border-r border-gray-600"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200
                  ${currentPage === pageNumber
                                        ? 'z-10 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : isLoading
                                            ? 'bg-[#2c2c2c] text-gray-400 cursor-not-allowed'
                                            : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:scale-105'
                                    } border-r border-gray-600 focus:z-20 focus:outline-none transform transition-transform`}
                                disabled={isLoading || currentPage === pageNumber}
                                aria-label={`Go to page ${pageNumber}`}
                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Pagination - Just show current page */}
                <div className="flex sm:hidden">
                    <span className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium bg-blue-600 text-white border-r border-gray-600">
                        {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`relative px-4 py-2.5 rounded-r-md text-sm font-medium transition-all duration-200
            ${currentPage === totalPages || isLoading
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:text-white hover:scale-105'
                        } focus:z-20 focus:outline-none transform transition-transform`}
                    disabled={currentPage === totalPages || isLoading}
                    aria-label="Next page"
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </nav>
        </div>
    );
};

export default EnhancedPagination;
