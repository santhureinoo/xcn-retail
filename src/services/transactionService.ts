import { CurrencyTransaction, PackageTransaction } from '../types/transaction';
import axiosInstance from './axiosConfig';

export const transactionService = {
 // Get XCoin transactions with pagination
 getCurrencyTransactions: async (page: number, limit: number): Promise<CurrencyTransaction[]> => {
    try {
      const response = await axiosInstance.get('/transactions/xcoin', {
        params: {
          page: page + 1, // Backend uses 1-indexed pages
          limit
        }
      });

      if (response.data.success) {
        // Transform backend XCoinTransaction data to frontend CurrencyTransaction format
        return response.data.transactions.map((tx: any) => ({
          id: tx.id,
          userId: tx.userId,
          amount: parseFloat(tx.amount.toString()),
          currency: 'xCoin', // Using xCoin as the currency
          price: parseFloat(tx.amount.toString()), // For xCoin transactions, amount is the price
          status: tx.status.toLowerCase() === 'completed' ? 'completed' :
                  tx.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
          createdAt: tx.createdAt,
          transactionId: tx.id,
          command: tx.description || 'xCoin Transaction' // Using description as command
        }));
      } else {
        console.error('Error fetching currency transactions:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching currency transactions:', error);
      return [];
    }
  },
  
  // Get package transactions with pagination
 getPackageTransactions: async (page: number, limit: number): Promise<PackageTransaction[]> => {
    try {
      const response = await axiosInstance.get('/transactions/packages', {
        params: {
          page: page + 1, // Backend uses 1-indexed pages
          limit
        }
      });

      if (response.data.success) {
        // Transform backend Transaction data to frontend PackageTransaction format
        return response.data.transactions.map((tx: any) => ({
          id: tx.id,
          userId: tx.userId,
          packageId: tx.transactionPackages?.[0]?.packageId || '',
          price: parseFloat(tx.totalCost?.toString() || '0'),
          currency: 'xCoin',
          status: tx.status.toLowerCase() === 'completed' ? 'completed' :
                  tx.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
          createdAt: tx.createdAt,
          transactionId: tx.id,
          command: tx.notes || 'Package Purchase'
        }));
      } else {
        console.error('Error fetching package transactions:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching package transactions:', error);
      return [];
    }
  },
  
  // Get Smile coin transactions with pagination
  getSmileCoinTransactions: async (page: number, limit: number): Promise<CurrencyTransaction[]> => {
    try {
      const response = await axiosInstance.get('/transactions/smile', {
        params: {
          page: page + 1, // Backend uses 1-indexed pages
          limit
        }
      });

      if (response.data.success) {
        // Transform backend Transaction data (with special pricing) to frontend CurrencyTransaction format
        return response.data.transactions.map((tx: any) => ({
          id: tx.id,
          userId: tx.userId,
          amount: parseFloat(tx.totalCost?.toString() || '0'),
          currency: 'Smile Coin',
          price: parseFloat(tx.totalCost?.toString() || '0'),
          status: tx.status.toLowerCase() === 'completed' ? 'completed' :
                  tx.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
          createdAt: tx.createdAt,
          transactionId: tx.id,
          command: tx.notes || 'Smile Coin Transaction'
        }));
      } else {
        console.error('Error fetching smile coin transactions:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching smile coin transactions:', error);
      return [];
    }
  },

  // Get transaction by ID
  getTransactionById: async (id: string): Promise<CurrencyTransaction | PackageTransaction | null> => {
    try {
      // Try to get as XCoin transaction first
      const xCoinResponse = await axiosInstance.get(`/transactions/xcoin/${id}`);
      if (xCoinResponse.data.success) {
        const tx = xCoinResponse.data.transaction;
        return {
          id: tx.id,
          userId: tx.userId,
          amount: parseFloat(tx.amount.toString()),
          currency: 'xCoin',
          price: parseFloat(tx.amount.toString()),
          status: tx.status.toLowerCase() === 'completed' ? 'completed' :
                  tx.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
          createdAt: tx.createdAt,
          transactionId: tx.id,
          command: tx.description || 'xCoin Transaction'
        };
      }
      
      // If not found as XCoin transaction, try as regular transaction
      const packageResponse = await axiosInstance.get(`/transactions/${id}`);
      if (packageResponse.data.success) {
        const tx = packageResponse.data.transaction;
        return {
          id: tx.id,
          userId: tx.userId,
          packageId: tx.transactionPackages?.[0]?.packageId || '',
          price: parseFloat(tx.totalCost?.toString() || '0'),
          currency: 'xCoin',
          status: tx.status.toLowerCase() === 'completed' ? 'completed' :
                  tx.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
          createdAt: tx.createdAt,
          transactionId: tx.id,
          command: tx.notes || 'Package Purchase'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      return null;
    }
  }
};

export default transactionService;