import React from 'react';

const OrderFAQ: React.FC = () => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">How long does it take to receive my diamonds?</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Most orders are processed within 24 hours. In some cases, it may take up to 48 hours during peak periods.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Is it safe to provide my User ID and Region?</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Yes, we only need your User ID and Region to send the diamonds to your account. We do not need or ask for your password.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">What if I enter the wrong information?</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Please double-check your information before submitting. If you made a mistake, contact our customer support immediately.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Can I cancel my order?</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Orders can be canceled before they are processed. Once processing has begun, cancellation is not possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderFAQ;