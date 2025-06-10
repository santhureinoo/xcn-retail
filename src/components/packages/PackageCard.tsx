import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package } from '../../types/package';

interface PackageCardProps {
  pkg: Package;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

// This component doesn't handle the ref at all
const PackageCardContent: React.FC<PackageCardProps> = ({ 
  pkg, 
  forwardedRef 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/packages/order/${pkg.id}`);
  };

  return (
    <div 
      ref={forwardedRef}
      onClick={handleCardClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-105 cursor-pointer ${pkg.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
    >
      {/* Package Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <img 
          src={pkg.imageUrl} 
          alt={pkg.name}
          className="w-full h-full object-cover"
          // onError={(e) => {
          //   // Fallback image if the original fails to load
          //   (e.target as HTMLImageElement).src = '/images/packages/placeholder.jpg';
          // }}
        />
        
        {/* Featured badge */}
        {pkg.featured && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            {t('packages.featured', 'Featured')}
          </div>
        )}
        
        {/* Discount badge */}
        {pkg.discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            {t('packages.discount', '{{percent}}% OFF', { percent: pkg.discount })}
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 m-2 rounded">
          {pkg.type === 'diamond' ? t('packages.diamondType', 'Diamonds') :
           pkg.type === 'weekly' ? t('packages.weeklyType', 'Weekly Pass') :
           pkg.type === 'monthly' ? t('packages.monthlyType', 'Monthly Pass') :
           t('packages.specialType', 'Special Offer')}
        </div>
      </div>
      
      {/* Package Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {pkg.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 h-10 overflow-hidden">
          {pkg.description}
        </p>
        
        {/* Package details */}
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
              `${pkg.price.toFixed(2)}`
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
      </div>
    </div>
  );
};

// Memoize the content component
const MemoizedPackageCardContent = memo(PackageCardContent, (prevProps, nextProps) => {
  return prevProps.pkg.id === nextProps.pkg.id;
});

// The main component just adds the ref
const PackageCard: React.FC<PackageCardProps> = ({ 
  pkg, 
  forwardedRef 
}) => {
  return (
    <div>
      <MemoizedPackageCardContent 
        pkg={pkg} 
        forwardedRef={forwardedRef} 
      />
    </div>
  );
};

export default PackageCard;