import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTransactionList } from '../hooks/useTransactionList';
import { CurrencyTransaction } from '../types/transaction';
import DataTable, { Column } from '../components/ui/data-table';
import TransactionStatusBadge from '../components/transactions/TransactionStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CurrencyTransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'currency' | 'smile'>('currency');
  
  const { transactions, loading, error, hasMore, loadMore } = useTransactionList<CurrencyTransaction>({
    type: activeTab,
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
  const columns: Column<CurrencyTransaction>[] = [
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
      key: 'transactionId',
      header: t('transaction.id', 'Transaction ID'),
      render: (transaction) => (
        <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
          {transaction.id.substring(0, 8)}...
        </span>
      )
    },
    {
      key: 'amount',
      header: activeTab === 'smile'
        ? t('transaction.smileAmount', 'Smile Coins')
        : t('transaction.xcoinAmount', 'xCoin Amount'),
      render: (transaction) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {transaction.amount} {transaction.currency}
          </span>
        </div>
      )
    },
    {
      key: 'description',
      header: activeTab === 'smile'
        ? t('transaction.smileDescription', 'Smile Transaction')
        : t('transaction.xcoinDescription', 'xCoin Transaction'),
      render: (transaction) => (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {transaction.command}
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
          to={`/transaction-details/${transaction.id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          {t('common.viewDetails', 'View Details')}
        </Link>
      )
    }
  ];

  // Handle view transaction details
  const handleViewTransaction = (transaction: CurrencyTransaction) => {
    // Navigate to transaction details page
    // This is handled by the Link in the actions column, but could be used for row clicks
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'smile'
              ? t('currencyTransactions.smileTitle', 'Smile Coin Transactions')
              : t('currencyTransactions.xcoinTitle', 'xCoin Transactions')}
          </h1>
          <div className="flex space-x-4">
            <Link 
              to="/transactions/packages" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('packageTransactions.viewAll', 'View Package Transactions')}
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
      
      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('currency')}
              className={`${
                activeTab === 'currency'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-40'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t('currencyTransactions.xcoinTab', 'xCoin Transactions')}
            </button>
            <button
              onClick={() => setActiveTab('smile')}
              className={`${
                activeTab === 'smile'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t('currencyTransactions.smileTab', 'Smile Coin Transactions')}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Transaction summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Diamonds */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {activeTab === 'smile' ? t('currencyTransactions.totalSmile', 'Total Smile Coins') : t('currencyTransactions.totalXCoin', 'Total xCoin')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.reduce((sum, tx) => sum + (tx.status === 'completed' ? tx.amount : 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Total Spent */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('currencyTransactions.totalSpent', 'Total Spent')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${transactions.reduce((sum, tx) => sum + (tx.status === 'completed' ? tx.price : 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Transaction Count */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('currencyTransactions.totalTransactions', 'Total Transactions')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.filter(tx => tx.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
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
              {activeTab === 'smile'
                ? t('currencyTransactions.recentSmileTransactions', 'Recent Smile Coin Transactions')
                : t('currencyTransactions.recentXcoinTransactions', 'Recent xCoin Transactions')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'smile'
                ? t('currencyTransactions.smileDescription', 'Your recent Smile Coin transaction history.')
                : t('currencyTransactions.xcoinDescription', 'Your recent xCoin transaction history.')}
            </p>
          </div>
          
          <DataTable
            columns={columns}
            data={transactions}
            keyExtractor={(item) => item.id}
            isLoading={loading && transactions.length === 0}
            emptyMessage={activeTab === 'smile'
              ? t('currencyTransactions.noSmileTransactions', 'No Smile Coin transactions found.')
              : t('currencyTransactions.noXcoinTransactions', 'No xCoin transactions found.')}
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

export default CurrencyTransactionsPage;