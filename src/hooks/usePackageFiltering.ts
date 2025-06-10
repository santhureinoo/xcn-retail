import { useState, useEffect, useCallback } from 'react';
import { Package, SortOption } from '../types/package';

interface UsePackageFilteringProps {
  packages: Package[];
  itemsPerPage: number;
}

interface UsePackageFilteringResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filteredPackages: Package[];
  visiblePackages: Package[];
  hasMore: boolean;
  loading: boolean;
  loadMorePackages: () => void;
  resetFilters: () => void;
  page: number;
}

export const usePackageFiltering = ({ 
  packages, 
  itemsPerPage 
}: UsePackageFilteringProps): UsePackageFilteringResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [visiblePackages, setVisiblePackages] = useState<Package[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter and sort packages
  useEffect(() => {
    let result = [...packages];
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(pkg => pkg.type === selectedType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pkg => 
        pkg.name.toLowerCase().includes(term) || 
        pkg.description.toLowerCase().includes(term)
      );
    }
    
    // Sort packages
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    setFilteredPackages(result);
    setPage(1);
    setVisiblePackages(result.slice(0, itemsPerPage));
    setHasMore(result.length > itemsPerPage);
  }, [packages, selectedType, searchTerm, sortOption, itemsPerPage]);
  
  // Memoize the loadMorePackages function
  const loadMorePackages = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      if (startIndex < filteredPackages.length) {
        setVisiblePackages(prev => [
          ...prev,
          ...filteredPackages.slice(startIndex, endIndex)
        ]);
        setPage(nextPage);
        setHasMore(endIndex < filteredPackages.length);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 500); // Simulate network delay
  }, [loading, page, filteredPackages, itemsPerPage]);
  
  // Memoize the resetFilters function
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('all');
    setSortOption('price-asc');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    filteredPackages,
    visiblePackages,
    hasMore,
    loading,
    loadMorePackages,
    resetFilters,
    page
  };
};