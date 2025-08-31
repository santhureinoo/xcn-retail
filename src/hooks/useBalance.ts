import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

export const useBalance = (region?: string) => {
  const [balance, setBalance] = useState<number>(0);
  const [smileCoinBalance, setSmileCoinBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/balance');
      setBalance(response.data.balance || 0);
      
      // If a region is specified, fetch the region-specific smile coin balance
      if (region) {
        try {
          const smileResponse = await axiosInstance.get(`/transactions/smile-balance/${encodeURIComponent(region)}`);
          setSmileCoinBalance(smileResponse.data.balance || 0);
        } catch (smileError: any) {
          console.error('Failed to fetch smile coin balance for region:', smileError);
          // Use the first smile coin balance or 0 as fallback
          const firstBalance = response.data.smileCoinBalances?.[0]?.balance || 0;
          setSmileCoinBalance(firstBalance);
        }
      } else {
        // Use the first smile coin balance or 0
        const firstBalance = response.data.smileCoinBalances?.[0]?.balance || 0;
        setSmileCoinBalance(firstBalance);
      }
      
      setError(null);
    } catch (error: any) {
      console.error('Failed to fetch balance:', error);
      setError(error.response?.data?.message || 'Failed to fetch balance');
      // Set default balances for demo purposes
      setBalance(100);
      setSmileCoinBalance(500);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmileCoinBalanceByRegion = async (region: string) => {
    try {
      const response = await axiosInstance.get(`/transactions/smile-balance/${encodeURIComponent(region)}`);
      return response.data.balance || 0;
    } catch (error: any) {
      console.error('Failed to fetch smile coin balance for region:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [region]);

  return {
    balance,
    smileCoinBalance,
    loading,
    error,
    refetch: fetchBalance,
    fetchSmileCoinBalanceByRegion
  };
};