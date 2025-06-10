import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/balance');
      setBalance(response.data.balance || 0);
      setError(null);
    } catch (error: any) {
      console.error('Failed to fetch balance:', error);
      setError(error.response?.data?.message || 'Failed to fetch balance');
      // Set a default balance for demo purposes
      setBalance(1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return { balance, loading, error, refetch: fetchBalance };
};