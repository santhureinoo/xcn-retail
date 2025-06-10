import React from 'react';
import { useTranslation } from 'react-i18next';
import { SortOption } from '../../types/package';

interface PackageFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  totalResults: number;
}

const PackageFilters: React.FC<PackageFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortOption,
  onSortChange,
  totalResults
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('packages.search', 'Search Packages')}
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={t('packages.searchPlaceholder', 'Search by name...')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('packages.filterByType', 'Filter by Type')}
            </label>
            <select
              id="type"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <option value="all">{t('packages.allTypes', 'All Types')}</option>
              <option value="weekly">{t('packages.weeklyPass', 'Weekly Pass')}</option>
              <option value="monthly">{t('packages.monthlyPass', 'Monthly Pass')}</option>
              <option value="diamond">{t('packages.diamonds', 'Diamonds')}</option>
              <option value="special">{t('packages.special', 'Special Offers')}</option>
            </select>
          </div>
          
          {/* Sort Options */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('packages.sortBy', 'Sort By')}
            </label>
            <select
              id="sort"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
              <option value="price-asc">{t('packages.priceLowToHigh', 'Price: Low to High')}</option>
              <option value="price-desc">{t('packages.priceHighToLow', 'Price: High to Low')}</option>
              <option value="name-asc">{t('packages.nameAZ', 'Name: A to Z')}</option>
              <option value="name-desc">{t('packages.nameZA', 'Name: Z to A')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {t('packages.showingResults', 'Showing {{count}} packages', { count: totalResults })}
      </div>
    </>
  );
};

export default PackageFilters;