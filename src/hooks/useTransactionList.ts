import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import { CurrencyTransaction, PackageTransaction } from '../types/transaction';

interface UseTransactionListProps {
  type: 'currency' | 'package';
  limit?: number;
}

interface UseTransactionListResult<T> {
  transactions: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useTransactionList<T extends CurrencyTransaction | PackageTransaction>({
  type,
  limit = 10
}: UseTransactionListProps): UseTransactionListResult<T> {
  const [transactions, setTransactions] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (type === 'currency') {
          data = await transactionService.getCurrencyTransactions(0, limit);
        } else {
          data = await transactionService.getPackageTransactions(0, limit);
        }
        
        setTransactions(data as T[]);
        setHasMore(data.length === limit);
      } catch (err) {
        setError('Failed to load transactions. Please try again.');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [type, limit]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      
      let data;
      if (type === 'currency') {
        data = await transactionService.getCurrencyTransactions(nextPage, limit);
      } else {
        data = await transactionService.getPackageTransactions(nextPage, limit);
      }
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTransactions(prev => [...prev, ...data as T[]]);
        setPage(nextPage);
        setHasMore(data.length === limit);
      }
    } catch (err) {
      setError('Failed to load more transactions. Please try again.');
      console.error('Error fetching more transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, type, limit]);

  return { transactions, loading, error, hasMore, loadMore };
}