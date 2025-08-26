import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Snapshot, SectorTotal, PortfolioSnapshotResponse } from '@/types/portfolio';
import SectorGroup from './SectorGroup';

interface PortfolioTableProps {
  data: PortfolioSnapshotResponse | null;
  isLoading?: boolean;
}

const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number | undefined): string => {
  if (value === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const formatNumber = (value: number | undefined): string => {
  if (value === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
};

export default function PortfolioTable({ data, isLoading = false }: PortfolioTableProps) {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  const toggleSector = (sector: string) => {
    setExpandedSectors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sector)) {
        newSet.delete(sector);
      } else {
        newSet.add(sector);
      }
      return newSet;
    });
  };

  const columnHelper = createColumnHelper<Snapshot>();
  
  const columns = useMemo(
    () => [
      columnHelper.accessor('particulars', {
        header: 'Particulars',
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
      }),
      columnHelper.accessor('investment', {
        header: 'Investment',
      }),
      columnHelper.accessor('portfolioPercentage', {
        header: 'Portfolio %',
      }),
      columnHelper.accessor('exchange', {
        header: 'Exchange',
      }),
      columnHelper.accessor('currentPrice', {
        header: 'CMP',
      }),
      columnHelper.accessor('presentValue', {
        header: 'Present Value',
      }),
      columnHelper.accessor('gainLoss', {
        header: 'Gain/Loss',
      }),
      columnHelper.accessor('gainLossPercentage', {
        header: 'Gain/Loss %',
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E Ratio',
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Latest Earnings',
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: data?.holdings || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <div className="h-96 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (!data || data.holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-center text-gray-700 py-8 font-medium">No portfolio data available</p>
      </div>
    );
  }

  const holdingsBySector = data.holdings.reduce<Record<string, Snapshot[]>>(
    (acc, holding) => {
      if (!acc[holding.sector]) {
        acc[holding.sector] = [];
      }
      acc[holding.sector].push(holding);
      return acc;
    },
    {}
  );

  const sectorTotalsMap = data.sectorTotals.reduce<Record<string, SectorTotal>>(
    (acc, sectorTotal) => {
      acc[sectorTotal.sector] = sectorTotal;
      return acc;
    },
    {}
  );

  // Helper function to format cell values based on column type
  const formatCellValue = (columnId: keyof Snapshot, value: number | string | undefined) => {
    if (value === undefined) return '—';
    
    switch (columnId) {
      case 'purchasePrice':
      case 'investment':
      case 'currentPrice':
      case 'presentValue':
      case 'latestEarnings':
        return formatCurrency(value as number);
      case 'quantity':
      case 'peRatio':
        return formatNumber(value as number);
      case 'portfolioPercentage':
        return formatPercentage(value as number);
      case 'gainLoss':
        return (
          <span className={(value as number) >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(value as number)}
          </span>
        );
      case 'gainLossPercentage':
        return (
          <span className={(value as number) >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatPercentage(value as number)}
          </span>
        );
      default:
        return value as string;
    }
  };

  const renderHoldingRow = (holding: Snapshot) => (
    <tr key={`${holding.sector}-${holding.particulars}`} className="hover:bg-gray-50">
      {table.getAllColumns().map((column) => {
        const columnId = column.id as keyof Snapshot;
        return (
          <td key={column.id} className="px-4 py-2 border-b text-gray-900">
            {formatCellValue(columnId, holding[columnId])}
          </td>
        );
      })}
    </tr>
  );

  const renderSectorTotalRow = (sectorTotal: SectorTotal) => (
    <tr key={`${sectorTotal.sector}-total`} className="bg-gray-50 font-medium text-gray-900">
      <td className="px-4 py-2 border-b">Total</td>
      <td className="px-4 py-2 border-b">—</td>
      <td className="px-4 py-2 border-b">—</td>
      <td className="px-4 py-2 border-b">{formatCurrency(sectorTotal.investment)}</td>
      <td className="px-4 py-2 border-b">{formatPercentage(sectorTotal.portfolioPercentage)}</td>
      <td className="px-4 py-2 border-b">—</td>
      <td className="px-4 py-2 border-b">—</td>
      <td className="px-4 py-2 border-b">{formatCurrency(sectorTotal.presentValue)}</td>
      <td className="px-4 py-2 border-b">
        <span className={sectorTotal.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(sectorTotal.gainLoss)}
        </span>
      </td>
      <td className="px-4 py-2 border-b">
        <span className={sectorTotal.gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatPercentage(sectorTotal.gainLossPercentage)}
        </span>
      </td>
      <td className="px-4 py-2 border-b">—</td>
      <td className="px-4 py-2 border-b">—</td>
    </tr>
  );

  const renderGrandTotalRow = () => (
    <tr className="bg-gray-200 font-bold text-gray-900">
      <td className="px-4 py-3">Grand Total</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">{formatCurrency(data.summary.totalInvestment)}</td>
      <td className="px-4 py-3">100%</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">{formatCurrency(data.summary.totalPresentValue)}</td>
      <td className="px-4 py-3">
        <span className={data.summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(data.summary.totalGainLoss)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={data.summary.totalGainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatPercentage(data.summary.totalGainLossPercentage)}
        </span>
      </td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {table.getAllColumns().map((column) => (
              <th
                key={column.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sticky top-0 bg-gray-50"
              >
                {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(holdingsBySector).map((sector) => (
            <SectorGroup
              key={sector}
              sector={sector}
              holdings={holdingsBySector[sector]}
              sectorTotal={sectorTotalsMap[sector]}
              isExpanded={expandedSectors.has(sector)}
              onToggle={toggleSector}
              renderRow={renderHoldingRow}
              renderTotalRow={renderSectorTotalRow}
            />
          ))}
          {renderGrandTotalRow()}
        </tbody>
      </table>
      
      <div className="mt-4 text-xs text-gray-800 font-medium">
        <p>Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
        <p>Data refreshes every 15 seconds</p>
      </div>
    </div>
  );
}