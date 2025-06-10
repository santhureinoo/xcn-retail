import { CurrencyTransaction, PackageTransaction } from '../types/transaction';

// Sample data for currency transactions
const sampleCurrencyTransactions: CurrencyTransaction[] = Array.from({ length: 100 }, (_, i) => ({
  id: `curr-${i + 1}`,
  userId: 'current-user-id',
  amount: Math.floor(Math.random() * 5 + 1) * 100, // Random amount: 100, 200, 300, 400, or 500
  currency: 'Diamonds',
  price: Math.floor(Math.random() * 5 + 1) * 4.99,
  command: [
    "1391379101 15749 wkp+86",
    "523815984 8101 257",
    "7654321 9876 343",
    "8765432 1234 cpn",
    "9876543 5678 wkp3"
  ][Math.floor(Math.random() * 5)],
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed',
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
  transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`
}));

// Sample data for package transactions
const samplePackageTransactions: PackageTransaction[] = Array.from({ length: 100 }, (_, i) => ({
  id: `pkg-${i + 1}`,
  userId: 'current-user-id',
  packageId: `package-${Math.floor(Math.random() * 10) + 1}`,
  command: [
    "1391379101 15749 wkp+86",
    "523815984 8101 257",
    "7654321 9876 343",
    "8765432 1234 cpn",
    "9876543 5678 wkp3"
  ][Math.floor(Math.random() * 5)],
  price: Math.floor(Math.random() * 5 + 1) * 9.99,
  currency: 'USD',
//   paymentMethod: ['Creditsss Card', 'PayPal', 'Google Pay', 'Apple Pay'][Math.floor(Math.random() * 4)],
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed',
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
  transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`
}));

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  // Get currency transactions with pagination
  getCurrencyTransactions: async (page: number, limit: number): Promise<CurrencyTransaction[]> => {
    await delay(800); // Simulate network delay
    return sampleCurrencyTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(page * limit, (page + 1) * limit);
  },
  
  // Get package transactions with pagination
  getPackageTransactions: async (page: number, limit: number): Promise<PackageTransaction[]> => {
    await delay(800); // Simulate network delay
    return samplePackageTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(page * limit, (page + 1) * limit);
  },
  
  // Get transaction by ID
  getTransactionById: async (id: string): Promise<CurrencyTransaction | PackageTransaction | null> => {
    await delay(500);
    const currencyTx = sampleCurrencyTransactions.find(tx => tx.id === id);
    if (currencyTx) return currencyTx;
    
    const packageTx = samplePackageTransactions.find(tx => tx.id === id);
    return packageTx || null;
  }
};

export default transactionService;