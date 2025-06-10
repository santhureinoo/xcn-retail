export interface CurrencyTransaction {
  id: string;
  userId: string;
  command: string;
  amount: number;
  currency: string;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string; // ISO date string
  transactionId: string;
}

export interface PackageTransaction {
  id: string;
  userId: string;
  packageId: string;
  command: string;
  price: number;
  currency: string;
//   paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string; // ISO date string
  transactionId: string;
}