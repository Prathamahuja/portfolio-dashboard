import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Holding, PortfolioSnapshotResponse } from '@/types/portfolio';

interface UsePortfolioOptions {
  refreshInterval?: number;
  initialHoldings?: Holding[];
}

interface UsePortfolioResult {
  data: PortfolioSnapshotResponse | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export function usePortfolio({
  refreshInterval = 15000,
  initialHoldings,
}: UsePortfolioOptions = {}): UsePortfolioResult {
  const [data, setData] = useState<PortfolioSnapshotResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (initialHoldings) {
        response = await axios.post('/api/snapshot', { holdings: initialHoldings });
      } else {
        response = await axios.get('/api/snapshot');
      }
      
      const portfolioData = response.data as PortfolioSnapshotResponse;
      portfolioData.lastUpdated = new Date(portfolioData.lastUpdated);
      
      setData(portfolioData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio data'));
    } finally {
      setLoading(false);
    }
  }, [initialHoldings]);

  const refreshData = useCallback(async () => {
    await fetchPortfolioData();
  }, [fetchPortfolioData]);

  useEffect(() => {
    fetchPortfolioData();
    
    const intervalId = setInterval(() => {
      fetchPortfolioData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchPortfolioData, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
  };
}