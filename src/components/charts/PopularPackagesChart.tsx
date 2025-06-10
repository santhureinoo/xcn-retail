import React from 'react';
import { useTranslation } from 'react-i18next';

interface PopularPackagesChartProps {
  data: Array<{
    packageCode: string;
    orderCount: number;
    revenue: number;
    successRate: number;
  }>;
}

const PopularPackagesChart: React.FC<PopularPackagesChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const maxOrders = Math.max(...data.map(d => d.orderCount));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {t('packageTransactions.popularPackages', 'Popular Packages')}
      </h4>
      
      <div className="space-y-4">
        {data.map((pkg, index) => {
          const widthPercentage = (pkg.orderCount / maxOrders) * 100;
          
          return (
            <div key={pkg.packageCode} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-lg font-mono">{pkg.packageCode}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pkg.orderCount} orders
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${pkg.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {pkg.successRate}% success
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-700 ease-out ${
                    index === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    index === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    index === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
              
              {/* Package details */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Avg. ${(pkg.revenue / pkg.orderCount).toFixed(2)} per order</span>
                <span>#{index + 1} most popular</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Top Package Highlight */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Top Performer</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {data[0]?.packageCode}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {data[0]?.orderCount} orders this month
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${data[0]?.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {data[0]?.successRate}% success rate
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {data.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Active Packages</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {(data.reduce((sum, pkg) => sum + pkg.successRate, 0) / data.length).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg Success Rate</div>
        </div>
      </div>
    </div>
  );
};

export default PopularPackagesChart;