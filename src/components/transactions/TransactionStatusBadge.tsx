import React from 'react';
import { useTranslation } from 'react-i18next';

type TransactionStatus = 'completed' | 'pending' | 'failed';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {t(`transaction.status.${status}`, status)}
    </span>
  );
};

export default TransactionStatusBadge;