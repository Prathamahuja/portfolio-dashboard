import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectorTotal } from '@/types/portfolio';

interface SectorDonutProps {
  sectorTotals: SectorTotal[];
  isLoading?: boolean;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#8DD1E1', '#A4DE6C', '#D0ED57', '#FAAAA3'
];

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      sector: string;
      investment: number;
      portfolioPercentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-medium text-gray-900">{data.sector}</p>
        <p className="text-sm text-gray-800">
          Investment: ₹{data.investment.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-gray-800">
          Portfolio: {formatPercentage(data.portfolioPercentage)}
        </p>
      </div>
    );
  }
  return null;
};

export default function SectorDonut({ sectorTotals, isLoading = false }: SectorDonutProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse">
        <div className="h-full bg-gray-100 rounded-md"></div>
      </div>
    );
  }

  const data = sectorTotals.map((sector) => ({
    sector: sector.sector,
    value: sector.portfolioPercentage,
    investment: sector.investment,
    portfolioPercentage: sector.portfolioPercentage,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-80">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Sector Allocation</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={(props) => {
              if (typeof props.value === 'number') {
                return formatPercentage(props.value);
              }
              return '';
            }}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 mr-1"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-gray-800">{entry.sector}</span>
              </div>
            ))}
          </div>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}