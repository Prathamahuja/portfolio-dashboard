import React from 'react';
import { PortfolioSummary } from '@/types/portfolio';

interface KpiCardsProps {
  summary: PortfolioSummary;
  isLoading?: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export default function KpiCards({ summary, isLoading = false }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-lg p-6 h-32"
          />
        ))}
      </div>
    );
  }

  const gainLossColor = summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600';
  const gainLossPercentColor = summary.totalGainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Investment Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-800 mb-1">Total Investment</h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(summary.totalInvestment)}
        </p>
      </div>

      {/* Present Value Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-800 mb-1">Present Value</h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(summary.totalPresentValue)}
        </p>
      </div>

      {/* Net Gain/Loss Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-800 mb-1">Net Gain/Loss</h3>
        <div className="flex flex-col">
          <p className={`text-2xl font-bold ${gainLossColor}`}>
            {formatCurrency(summary.totalGainLoss)}
          </p>
          <p className={`text-sm font-medium ${gainLossPercentColor}`}>
            {formatPercentage(summary.totalGainLossPercentage)}
          </p>
        </div>
      </div>
    </div>
  );
}