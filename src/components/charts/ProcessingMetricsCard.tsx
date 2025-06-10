import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProcessingMetricsCardProps {
  data: {
    averageProcessingTime: number;
    totalOrdersProcessed: number;
    successRate: number;
    failureReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
}

const ProcessingMetricsCard: React.FC<ProcessingMetricsCardProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {t('packageTransactions.processingMetrics', 'Processing Metrics')}
      </h4>
      
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.averageProcessingTime}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Processing</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.successRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.totalOrdersProcessed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Processed</div>
          </div>
        </div>
        
        {/* Failure Reasons */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Common Failure Reasons
          </h5>
          <div className="space-y-2">
            {data.failureReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{reason.reason}</span>
                <span className="font-medium text-gray-900 dark:text-white">{reason.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingMetricsCard;