import React from 'react';

const OrderInstructions: React.FC = () => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        How to Find Your User ID and Region
      </h3>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              1. Open your game and go to your profile.
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              2. Your User ID is displayed at the top of your profile.
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              3. Your Region ID can be found next to your User ID.
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              4. Choose a package code from the list above (e.g., wkp, 257, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInstructions;