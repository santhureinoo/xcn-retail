import React from 'react';
import { useTranslation } from 'react-i18next';

interface OrderSuccessRateChartProps {
  data: {
    completed: number;
    failed: number;
    pending: number;
    partial: number;
  };
}

const OrderSuccessRateChart: React.FC<OrderSuccessRateChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const total = data.completed + data.failed + data.pending + data.partial || 1;

  const chartData = [
    { label: 'Completed', count: data.completed, color: 'bg-green-500', textColor: 'text-green-600', icon: '✅' },
    { label: 'Partial', count: data.partial, color: 'bg-orange-500', textColor: 'text-orange-600', icon: '⚠️' },
    { label: 'Pending', count: data.pending, color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: '⏳' },
    { label: 'Failed', count: data.failed, color: 'bg-red-500', textColor: 'text-red-600', icon: '❌' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {t('packageTransactions.successRate', 'Order Success Rate')}
      </h4>
      
      <div className="space-y-4">
        {chartData.map(({ label, count, color, textColor, icon }) => {
          const percentage = (count / total) * 100;
          
          return (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${textColor}`}>{count}</span>
                  <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Success Rate</span>
          <span className="text-lg font-bold text-green-600">
            {(((data.completed + data.partial) / total) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessRateChart;