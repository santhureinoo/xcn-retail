import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from '../../types/package';

interface PackageInfoProps {
  packageData: Package;
}

const PackageInfo: React.FC<PackageInfoProps> = ({ packageData }) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden mr-4">
          <img 
            src={packageData.imageUrl} 
            alt={packageData.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {packageData.name}
          </h2>
          <div className="flex items-center mt-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white mr-3">
              {packageData.discount ? (
                <>
                  <span className="line-through text-gray-500 dark:text-gray-400 text-sm mr-2">
                    ${packageData.price.toFixed(2)}
                  </span>
                  ${(packageData.price * (1 - packageData.discount / 100)).toFixed(2)}
                </>
              ) : (
                `${packageData.price.toFixed(2)}`
              )}
            </span>
            
            {packageData.type === 'diamond' && packageData.amount && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                {packageData.amount} {t('packages.diamonds', 'Diamonds')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;