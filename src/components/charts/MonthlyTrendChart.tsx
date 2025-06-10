import React from 'react';
import { useTranslation } from 'react-i18next';

interface MonthlyTrendChartProps {
  data: Array<{
    month: string;
    amount: number;
    orderCount: number;
  }>;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {t('packageTransactions.monthlyTrend', 'Monthly Spending Trend')}
      </h4>
      
      <div className="h-64 flex items-end justify-between space-x-2 mb-4">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          
          return (
            <div key={item.month} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex items-end justify-center relative">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer relative group"
                  style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.amount} ({item.orderCount} orders)
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                  
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                    ${item.amount}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            ${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, item) => sum + item.orderCount, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;