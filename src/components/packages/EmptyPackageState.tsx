import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyPackageStateProps {
  onResetFilters: () => void;
}

const EmptyPackageState: React.FC<EmptyPackageStateProps> = ({ onResetFilters }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
        {t('packages.noResults', 'No packages found')}
      </h3>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {t('packages.tryAdjustingFilters', 'Try adjusting your search or filter to find what you\'re looking for.')}
      </p>
      <button
        onClick={onResetFilters}
        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
      >
        {t('packages.resetFilters', 'Reset Filters')}
      </button>
    </div>
  );
};

export default EmptyPackageState;