import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package } from '../types/package';
import { PackageService } from '../services/packageService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CommandInput from '../components/packages/CommandInput';
import OrderSummaryModal from '../components/packages/OrderSummaryModal';
import PackageInfo from '../components/packages/PackageInfo';
import PackageList from '../components/packages/PackageList';
import OrderInstructions from '../components/packages/OrderInstructions';
import OrderFAQ from '../components/packages/OrderFAQ';

interface CommandInput {
  id: string;
  value: string;
}

const PackageOrderPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [commandInputs, setCommandInputs] = useState<CommandInput[]>([
    { id: '1', value: '' }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{
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
  } | null>(null);
  
  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        if (!packageId) {
          throw new Error('Package ID is required');
        }
        
        const pkg = await PackageService.getPackageById(packageId);
        setPackageData(pkg);
      } catch (error) {
        console.error('Failed to fetch package:', error);
        setError('Failed to load package details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackage();
  }, [packageId]);
  
  // Add a new command input
  const addCommandInput = () => {
    setCommandInputs([
      ...commandInputs,
      { id: Date.now().toString(), value: '' }
    ]);
  };
  
  // Remove a command input
  const removeCommandInput = (id: string) => {
    if (commandInputs.length > 1) {
      setCommandInputs(commandInputs.filter(input => input.id !== id));
    }
  };
  
  // Update a command input value
  const updateCommandInput = (id: string, value: string) => {
    setCommandInputs(
      commandInputs.map(input => 
        input.id === id ? { ...input, value } : input
      )
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all inputs
    const regex = /^\d+ \d+ .+$/;
    const invalidInputs = commandInputs.filter(input => !regex.test(input.value));
    
    if (invalidInputs.length > 0) {
      setError('Please enter all information in the correct format: User ID, Region ID, and Package Code');
      return;
    }
    
    try {
      // Extract commands
      const commands = commandInputs.map(input => input.value);
      
      // Submit the order
      const orderSummary = await PackageService.submitOrder(packageId || '', commands);
      
      // Set the order summary and show the modal
      setOrderSummary(orderSummary);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Failed to submit order:', error);
      setError('Failed to submit order. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error || 'Package not found'}</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/packages')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Packages
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Order {packageData.name}
          </h1>
        </div>
        
        {/* Order Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Package Info */}
          <PackageInfo packageData={packageData} />
          
          {/* Order Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter User ID, Region, and Package Code
              </label>
              
              {/* Multiple Command Inputs */}
              <div className="space-y-3">
                {commandInputs.map((input, index) => (
                  <CommandInput
                    key={input.id}
                    id={input.id}
                    value={input.value}
                    index={index}
                    totalInputs={commandInputs.length}
                    onChange={updateCommandInput}
                    onAdd={addCommandInput}
                    onRemove={removeCommandInput}
                  />
                ))}
              </div>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Format: User ID, Region ID, Package Code (e.g. 1391379101 15749 wkp+86)
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
            
            {/* Package List */}
            <PackageList />
            
            {/* Instructions */}
            <OrderInstructions />
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Submit Order
            </button>
            
            {/* Terms and Conditions */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              By submitting this order, you agree to our Terms of Service and Privacy Policy.
              Orders typically process within 24 hours.
            </p>
          </form>
        </div>
        
        {/* FAQ Section */}
        <OrderFAQ />
      </div>
      
      {/* Order Summary Modal */}
      <OrderSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        orderSummary={orderSummary}
      />
    </div>
  );
};

export default PackageOrderPage;