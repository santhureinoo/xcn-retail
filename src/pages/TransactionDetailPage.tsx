import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import transactionService from '../services/transactionService';
import { CurrencyTransaction, PackageTransaction } from '../types/transaction';
import TransactionStatusBadge from '../components/transactions/TransactionStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TransactionDetailPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState<CurrencyTransaction | PackageTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if this is a currency or package transaction
  const isCurrencyTransaction = transaction && 'currency' in transaction;
  
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setError('Transaction ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const data = await transactionService.getTransactionById(transactionId);
        if (data) {
          setTransaction(data);
        } else {
          setError('Transaction not found');
        }
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [transactionId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            {t('common.error', 'Error')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {error || t('transaction.notFound', 'Transaction not found')}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('common.goBack', 'Go Back')}
            </button>
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
            {t('transaction.details', 'Transaction Details')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('common.back', 'Back')}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          {/* Transaction header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center flex-wrap">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {isCurrencyTransaction 
                    ? t('transaction.currencyPurchase', 'Currency Purchase') 
                    : t('transaction.packagePurchase', 'Package Purchase')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t('transaction.id', 'Transaction ID')}: {transaction.transactionId}
                </p>
              </div>
              <TransactionStatusBadge status={transaction.status} />
            </div>
          </div>
          
          {/* Transaction details */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 sm:dark:divide-gray-700">
              {/* Date */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transaction.date', 'Date')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {new Date(transaction.createdAt).toLocaleString()}
                </dd>
              </div>
              
              {/* Amount/Package */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isCurrencyTransaction 
                    ? t('transaction.amount', 'Amount') 
                    : t('transaction.package', 'Package')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {isCurrencyTransaction 
                    ? `${(transaction as CurrencyTransaction).amount} ${(transaction as CurrencyTransaction).currency}`
                    : (transaction as PackageTransaction).command}
                </dd>
              </div>
              
              {/* Price */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transaction.price', 'Price')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  ${transaction.price.toFixed(2)} {transaction.currency}
                </dd>
              </div>
              
              {/* Payment Method */}
              {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transaction.paymentMethod', 'Payment Method')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {transaction.paymentMethod}
                </dd>
              </div> */}
              
              {/* Status */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('transaction.status', 'Status')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  <TransactionStatusBadge status={transaction.status} />
                  {transaction.status === 'failed' && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {t('transaction.failureReason', 'Payment processing failed. Please contact support if you need assistance.')}
                    </p>
                  )}
                  {transaction.status === 'pending' && (
                    <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                      {t('transaction.pendingReason', 'Your payment is being processed. This may take a few minutes.')}
                    </p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          
          {/* Actions */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              {transaction.status === 'failed' && (
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('transaction.tryAgain', 'Try Again')}
                </button>
              )}
              
              <button
                className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('transaction.contactSupport', 'Contact Support')}
              </button>
              
              {transaction.status === 'completed' && (
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t('transaction.downloadReceipt', 'Download Receipt')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;