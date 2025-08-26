'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import KpiCards from '@/components/KpiCards';
import PortfolioTable from '@/components/PortfolioTable';
import SectorDonut from '@/components/SectorDonut';
import { PortfolioSnapshotResponse } from '@/types/portfolio';

export default function Home() {
  // Use the portfolio hook to fetch and auto-refresh data
  const { data, loading, error, lastUpdated, refreshData } = usePortfolio({
    refreshInterval: 15000, // 15 seconds
  });

  // State for toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show error toast when API fails
  useEffect(() => {
    if (error) {
      setToast({
        message: 'Failed to fetch portfolio data. Retrying...',
        type: 'error',
      });
      
      // Auto-dismiss toast after 5 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show success toast when data refreshes
  useEffect(() => {
    if (data && !loading) {
      setToast({
        message: 'Portfolio data refreshed',
        type: 'success',
      });
      
      // Auto-dismiss toast after 2 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [data, loading]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Portfolio Dashboard</h1>
            <button
              onClick={() => refreshData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        {data?.summary && (
          <KpiCards summary={data.summary} isLoading={loading} />
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Portfolio Table (3/4 width on large screens) */}
          <div className="lg:col-span-3">
            <PortfolioTable data={data} isLoading={loading} />
          </div>

          {/* Sector Allocation Chart (1/4 width on large screens) */}
          <div className="lg:col-span-1">
            {data?.sectorTotals && (
              <SectorDonut sectorTotals={data.sectorTotals} isLoading={loading} />
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div 
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
