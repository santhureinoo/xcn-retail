import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import { CurrencyTransaction } from '../types/transaction';
import TransactionStatusBadge from '../components/transactions/TransactionStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TransactionDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState<CurrencyTransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError(t('transactionDetails.error.invalidId', 'Invalid transaction ID'));
          return;
        }
        
        const transactionData = await transactionService.getTransactionById(id);
        
        if (transactionData) {
          setTransaction(transactionData as CurrencyTransaction);
        } else {
          setError(t('transactionDetails.error.notFound', 'Transaction not found'));
        }
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(t('transactionDetails.error.fetchFailed', 'Failed to fetch transaction details'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, t]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('transactionDetails.title', 'Transaction Details')}
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={handleGoBack}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t('common.goBack', 'Go Back')}
              </button>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('transactionDetails.title', 'Transaction Details')}
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={handleGoBack}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t('common.goBack', 'Go Back')}
              </button>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{t('transactionDetails.error.notFound', 'Transaction not found')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('transactionDetails.title', 'Transaction Details')}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleGoBack}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('common.goBack', 'Go Back')}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Transaction details card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {t('transactionDetails.transactionInfo', 'Transaction Information')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {t('transactionDetails.detailsDescription', 'Detailed information about the transaction.')}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Transaction ID */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.id', 'Transaction ID')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                  {transaction.id}
                </dd>
              </div>
              
              {/* Date */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.date', 'Date')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(transaction.createdAt)}
                </dd>
              </div>
              
              {/* Amount */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.amount', 'Amount')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{transaction.amount}</span> {transaction.currency}
                </dd>
              </div>
              
              {/* Price */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.price', 'Price')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  ${transaction.price.toFixed(2)}
                </dd>
              </div>
              
              {/* Status */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.status', 'Status')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  <TransactionStatusBadge status={transaction.status} />
                </dd>
              </div>
              
              {/* Description/Command */}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transactionDetails.description', 'Description')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {transaction.command || t('transactionDetails.noDescription', 'No description available')}
                </dd>
              </div>
              
              {/* User ID */}
              {transaction.userId && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('transactionDetails.userId', 'User ID')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {transaction.userId}
                  </dd>
                </div>
              )}
            </div>
            
            {/* Additional information */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('transactionDetails.additionalInfo', 'Additional Information')}
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('transactionDetails.infoText', 'This transaction represents a purchase of digital currency. The amount shown is the quantity of currency purchased, and the price reflects the total cost of the transaction.')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
            >
              {t('common.close', 'Close')}
            </button>
            
            <Link
              to={`/transactions/${transaction.userId === 'smile' ? 'smile' : 'currency'}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('transactionDetails.viewAll', 'View All Transactions')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;