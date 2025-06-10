import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: {
    orderNumber: string;
    success: boolean;
    successCount: number;
    originalCommand: string;
    orders: Array<{
      orderId: string;
      product: string;
      playerId: string;
      playerName: string;
    }>;
    totalDebited: number;
    balance: number;
    createdAt: string;
    processingTime: string;
  } | null;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  orderSummary
}) => {
  const navigate = useNavigate();
  
  if (!isOpen || !orderSummary) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Summary #{orderSummary.orderNumber}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            {/* Success Status */}
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                SUCCESS ({orderSummary.successCount})
              </span>
              <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                Created at {orderSummary.createdAt}
              </span>
            </div>
            
            {/* Command Used */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-md mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Command Used:</h3>
                  <p className="mt-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {orderSummary.originalCommand}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {orderSummary.orders.map((order, index) => (
                <div key={order.orderId} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {index + 1}) Order ID: <span className="font-mono">{order.orderId}</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Product: {order.product}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Player ID: {order.playerId}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Player: {order.playerName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Financial Summary */}
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Debited from balance:</span>
                <span className="font-medium text-gray-900 dark:text-white">R${orderSummary.totalDebited}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                <span className="font-medium text-gray-900 dark:text-white">R${orderSummary.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time took to proceed:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderSummary.processingTime}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate('/packages');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Browse More Packages
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/transactions');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                View Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;