import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
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
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (info) => formatNumber(info.getValue()),
      }),
      columnHelper.accessor('investment', {
        header: 'Investment',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('portfolioPercentage', {
        header: 'Portfolio %',
        cell: (info) => formatPercentage(info.getValue()),
      }),
      columnHelper.accessor('exchange', {
        header: 'Exchange',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('currentPrice', {
        header: 'CMP',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('presentValue', {
        header: 'Present Value',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('gainLoss', {
        header: 'Gain/Loss',
        cell: (info) => {
          const value = info.getValue();
          const colorClass = value === undefined ? '' : value >= 0 ? 'text-green-600' : 'text-red-600';
          return <span className={colorClass}>{formatCurrency(value)}</span>;
        },
      }),
      columnHelper.accessor('gainLossPercentage', {
        header: 'Gain/Loss %',
        cell: (info) => {
          const value = info.getValue();
          const colorClass = value === undefined ? '' : value >= 0 ? 'text-green-600' : 'text-red-600';
          return <span className={colorClass}>{formatPercentage(value)}</span>;
        },
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E Ratio',
        cell: (info) => formatNumber(info.getValue()),
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Latest Earnings',
        cell: (info) => formatCurrency(info.getValue()),
      }),
    ],
    []
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

  const renderHoldingRow = (holding: Snapshot) => (
    <tr key={`${holding.sector}-${holding.particulars}`} className="hover:bg-gray-50">
      {table.getAllColumns().map((column) => {
        const cell = column.columnDef.cell;
        return (
          <td key={column.id} className="px-4 py-2 border-b text-gray-900">
            {cell && typeof cell === 'function'
              ? flexRender(cell, {
                  column,
                  row: { original: holding },
                  getValue: () => holding[column.id as keyof Snapshot]
                })
              : holding[column.id as keyof Snapshot]}
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
                {column.columnDef.header && typeof column.columnDef.header === 'function'
                  ? flexRender(column.columnDef.header, { column })
                  : column.columnDef.header || column.id}
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
        <p>Last updated: {data.lastUpdated.toLocaleString()}</p>
        <p>Data refreshes every 15 seconds</p>
      </div>
    </div>
  );
}