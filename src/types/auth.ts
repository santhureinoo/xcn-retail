export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RETAILER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  balance: number; // Add this field
  createdAt: string;
  updatedAt: string;
}