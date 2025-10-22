import React from "react";

const FilterBar = ({ onOpenFilters, filtersActiveCount = 0, view, onViewChange }) => {
    return (
        <div className="flex items-center gap-3 md:ms-0 ms-auto">
            {/* Filter Button */}
            <button
                type="button"
                onClick={onOpenFilters}
                className="group relative px-4 py-2 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow transition-all duration-300"
            >
                {/* Button Highlight */}
                <div className="absolute inset-0 rounded-xl bg-primary/5 dark:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0113 13v5a1 1 0 01-.553.894l-4 2A1 1 0 017 20v-7a1 1 0 01.293-.707l6.414-6.414A1 1 0 0115 6V4H4a1 1 0 00-1 1v2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                        Filters
                    </span>
                    {filtersActiveCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-primary rounded-full">
                            {filtersActiveCount}
                        </span>
                    )}
                </div>
            </button>


        </div>
    );
};

export default FilterBar;
