import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTransactionList } from '../hooks/useTransactionList';
import { PackageTransaction } from '../types/transaction';
import DataTable, { Column } from '../components/ui/data-table';
import TransactionStatusBadge from '../components/transactions/TransactionStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OrderSuccessRateChart from '../components/charts/OrderSuccessRateChart';
import ProcessingMetricsCard from '../components/charts/ProcessingMetricsCard';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
// import PopularPackagesChart from '../components/charts/PopularPackagesChart'; // HIDDEN
import { samplePackageAnalytics } from '../data/samplePackageAnalytics';

const PackageTransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { transactions, loading, error, hasMore, loadMore } = useTransactionList<PackageTransaction>({
    type: 'package',
    limit: 15
  });
  
  // Reference for the last element for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastTransactionElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);
  
  // Define table columns
  const columns: Column<PackageTransaction>[] = [
    {
      key: 'date',
      header: t('transaction.date', 'Date'),
      render: (transaction) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'package',
      header: t('transaction.package', 'Package'),
      render: (transaction) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {transaction.command}
          </span>
        </div>
      )
    },
    {
      key: 'price',
      header: t('transaction.price', 'Price'),
      render: (transaction) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          ${transaction.price.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      header: t('transaction.status', 'Status'),
      render: (transaction) => (
        <TransactionStatusBadge status={transaction.status} />
      )
    },
    {
      key: 'actions',
      header: t('common.actions', 'Actions'),
      render: (transaction) => (
        <Link
          to={`/transactions/${transaction.id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          {t('common.viewDetails', 'View Details')}
        </Link>
      )
    }
  ];

  const handleViewTransaction = (transaction: PackageTransaction) => {
    // Navigate to transaction details page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('packageTransactions.title', 'Package Transactions')}
          </h1>
          <div className="flex space-x-4">
            <Link 
              to="/transactions/currency" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('currencyTransactions.viewAll', 'View Currency Transactions')}
            </Link>
            <Link 
              to="/home" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('common.backToHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HIDDEN: Transaction summary cards */}
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          // Total Packages, Total Spent, Most Popular Package cards hidden
        </div>
        */}
        
        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <OrderSuccessRateChart data={samplePackageAnalytics.orderSuccessRate} />
          <ProcessingMetricsCard data={samplePackageAnalytics.processingMetrics} />
        </div>
        
        {/* Monthly Trend Chart - Full Width */}
        <div className="mb-8">
          <MonthlyTrendChart data={samplePackageAnalytics.monthlyTrend} />
        </div>
        
        {/* HIDDEN: Popular Packages Chart */}
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PopularPackagesChart data={samplePackageAnalytics.popularPackages} />
        </div>
        */}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Transactions table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {t('packageTransactions.recentTransactions', 'Recent Transactions')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {t('packageTransactions.description', 'Your recent package purchase history.')}
            </p>
          </div>
          
          <DataTable
            columns={columns}
            data={transactions}
            keyExtractor={(item) => item.id}
            isLoading={loading && transactions.length === 0}
            emptyMessage={t('packageTransactions.noTransactions', 'No package transactions found.')}
            onRowClick={handleViewTransaction}
          />
          
          {/* Infinite scroll observer element */}
          {hasMore && (
            <div 
              ref={lastTransactionElementRef} 
              className="py-4 flex justify-center"
            >
              {loading && (
                <LoadingSpinner size="small" />
              )}
            </div>
          )}
          
          {/* End of list message */}
          {!hasMore && transactions.length > 0 && (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('common.endOfList', 'End of list')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageTransactionsPage;