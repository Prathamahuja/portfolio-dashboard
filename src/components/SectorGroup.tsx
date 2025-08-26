import React, { useState } from 'react';
import { SectorTotal, Snapshot } from '@/types/portfolio';

interface SectorGroupProps {
  sector: string;
  holdings: Snapshot[];
  sectorTotal: SectorTotal;
  isExpanded?: boolean;
  onToggle: (sector: string) => void;
  renderRow: (holding: Snapshot) => React.ReactNode;
  renderTotalRow: (sectorTotal: SectorTotal) => React.ReactNode;
}

export default function SectorGroup({
  sector,
  holdings,
  sectorTotal,
  isExpanded = false,
  onToggle,
  renderRow,
  renderTotalRow,
}: SectorGroupProps) {
  const handleToggle = () => {
    onToggle(sector);
  };

  return (
    <>
      <tr
        className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors text-gray-900"
        onClick={handleToggle}
      >
        <td colSpan={12} className="px-4 py-2">
          <div className="flex items-center">
            <span className="mr-2">
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </span>
            <span className="font-semibold">{sector}</span>
          </div>
        </td>
      </tr>

      {isExpanded && holdings.map((holding) => renderRow(holding))}

      {renderTotalRow(sectorTotal)}
    </>
  );
}

export function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}