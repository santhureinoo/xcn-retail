import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package } from '../../types/package';

interface PackageDetailModalProps {
  pkg: Package;
  onClose: () => void;
  onPurchase: (pkg: Package) => void;
}

const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ pkg, onClose, onPurchase }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleOrderClick = () => {
    onClose();
    navigate(`/packages/${pkg.id}/order`);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {pkg.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            {/* Package Image */}
            <div className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
              <img 
                src={pkg.imageUrl} 
                alt={pkg.name}
                className="w-full h-full object-cover"
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
            </div>
            
            {/* Package Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('packages.description', 'Description')}
                </h3>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {pkg.description}
                </p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('packages.price', 'Price')}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
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
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('packages.type', 'Type')}
                  </h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-white">
                    {pkg.type === 'diamond' ? t('packages.diamondType', 'Diamonds') :
                     pkg.type === 'weekly' ? t('packages.weeklyType', 'Weekly Pass') :
                     pkg.type === 'monthly' ? t('packages.monthlyType', 'Monthly Pass') :
                     t('packages.specialType', 'Special Offer')}
                  </p>
                </div>
                
                {pkg.type === 'diamond' && pkg.amount && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('packages.amount', 'Amount')}
                    </h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {pkg.amount} {t('packages.diamonds', 'Diamonds')}
                    </p>
                  </div>
                )}
                
                {(pkg.type === 'weekly' || pkg.type === 'monthly') && pkg.duration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('packages.duration', 'Duration')}
                    </h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {pkg.duration} {t('packages.days', 'Days')}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Additional details can be added here */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('packages.benefits', 'Benefits')}
                </h3>
                <ul className="mt-1 text-base text-gray-900 dark:text-white list-disc pl-5 space-y-1">
                  <li>{t('packages.benefitInstant', 'Instant delivery')}</li>
                  <li>{t('packages.benefitSecure', 'Secure transaction')}</li>
                  <li>{t('packages.benefitSupport', '24/7 customer support')}</li>
                </ul>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleOrderClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {t('packages.order', 'Order Now')}
              </button>
              <button
                onClick={() => onPurchase(pkg)}
                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {t('packages.buyNow', 'Buy Now')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailModal;