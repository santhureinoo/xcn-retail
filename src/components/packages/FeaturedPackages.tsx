import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Package } from '../../types/package';
import { PackageService } from '../../services/packageService';
import LoadingSpinner from '../ui/LoadingSpinner';

const FeaturedPackages: React.FC = () => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const featuredPackages = await PackageService.getFeaturedPackages();
        setPackages(featuredPackages.slice(0, 3)); // Show only top 3 featured packages
      } catch (error) {
        console.error('Failed to fetch featured packages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedPackages();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (packages.length === 0) {
    return null; // Don't show section if no featured packages
  }
  
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('home.featuredPackages.title', 'Featured Packages')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            {t('home.featuredPackages.subtitle', 'Check out our most popular game packages')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div 
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              {/* Package Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount badge */}
                {pkg.discount && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {t('packages.discount', '{{percent}}% OFF', { percent: pkg.discount })}
                  </div>
                )}
              </div>
              
              {/* Package Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {pkg.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 h-10 overflow-hidden">
                  {pkg.description}
                </p>
                
                {/* Package price */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {pkg.discount ? (
                      <>
                        <span className="line-through text-gray-500 dark:text-gray-400 text-sm mr-2">
                          ${pkg.price.toFixed(2)}
                        </span>
                        ${(pkg.price * (1 - pkg.discount / 100)).toFixed(2)}
                      </>
                    ) : (
                      `$${pkg.price.toFixed(2)}`
                    )}
                  </div>
                  
                  {/* Show amount for diamond packages */}
                  {pkg.type === 'diamond' && pkg.amount && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {pkg.amount} {t('packages.diamonds', 'Diamonds')}
                    </div>
                  )}
                  
                  {/* Show duration for pass packages */}
                  {(pkg.type === 'weekly' || pkg.type === 'monthly') && pkg.duration && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {pkg.duration} {t('packages.days', 'Days')}
                    </div>
                  )}
                </div>
                
                {/* View package button */}
                <Link
                  to={`/packages/${pkg.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('home.featuredPackages.viewPackage', 'View Package')}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* View all packages button */}
        <div className="mt-10 text-center">
          <Link
            to="/packages"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('home.featuredPackages.viewAll', 'View All Packages')}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPackages;
