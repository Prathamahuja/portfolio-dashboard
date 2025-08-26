import { Holding, Snapshot, SectorTotal, PortfolioSummary, PortfolioSnapshotResponse } from '../types/portfolio';
import { getYahooPrices } from './yahoo-finance';
import { getGoogleStatsForMultiple } from './google-finance';

export function calculateDerivedFields(
  holding: Holding,
  currentPrice?: number,
  peRatio?: number,
  latestEarnings?: number
): Snapshot {
  const investment = holding.purchasePrice * holding.quantity;
  
  const presentValue = currentPrice 
    ? currentPrice * holding.quantity 
    : undefined;
  
  const gainLoss = presentValue !== undefined 
    ? presentValue - investment 
    : undefined;
  
  const gainLossPercentage = gainLoss !== undefined && investment > 0
    ? (gainLoss / investment) * 100
    : undefined;
  
  return {
    ...holding,
    investment,
    portfolioPercentage: 0,
    currentPrice,
    presentValue,
    gainLoss,
    gainLossPercentage,
    peRatio,
    latestEarnings,
  };
}

export function calculateSectorTotals(snapshots: Snapshot[]): SectorTotal[] {
  const sectorMap = new Map<string, SectorTotal>();
  
  snapshots.forEach(snapshot => {
    const sector = snapshot.sector;
    const existing = sectorMap.get(sector);
    
    const investment = snapshot.investment;
    const presentValue = snapshot.presentValue ?? 0;
    const gainLoss = snapshot.gainLoss ?? 0;
    
    if (existing) {
      existing.investment += investment;
      existing.presentValue += presentValue;
      existing.gainLoss += gainLoss;
    } else {
      sectorMap.set(sector, {
        sector,
        investment,
        presentValue,
        gainLoss,
        gainLossPercentage: 0,
        portfolioPercentage: 0,
      });
    }
  });
  
  const sectorTotals = Array.from(sectorMap.values());
  sectorTotals.forEach(sectorTotal => {
    if (sectorTotal.investment > 0) {
      sectorTotal.gainLossPercentage = (sectorTotal.gainLoss / sectorTotal.investment) * 100;
    }
  });
  
  return sectorTotals;
}

export function calculatePortfolioSummary(
  snapshots: Snapshot[],
  sectorTotals: SectorTotal[]
): PortfolioSummary {
  const totalInvestment = sectorTotals.reduce((sum, sector) => sum + sector.investment, 0);
  const totalPresentValue = sectorTotals.reduce((sum, sector) => sum + sector.presentValue, 0);
  const totalGainLoss = sectorTotals.reduce((sum, sector) => sum + sector.gainLoss, 0);
  
  const totalGainLossPercentage = totalInvestment > 0
    ? (totalGainLoss / totalInvestment) * 100
    : 0;
  
  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercentage,
  };
}

export function calculatePortfolioPercentages(
  snapshots: Snapshot[],
  sectorTotals: SectorTotal[],
  totalInvestment: number
): void {
  snapshots.forEach(snapshot => {
    snapshot.portfolioPercentage = totalInvestment > 0
      ? (snapshot.investment / totalInvestment) * 100
      : 0;
  });
  
  sectorTotals.forEach(sectorTotal => {
    sectorTotal.portfolioPercentage = totalInvestment > 0
      ? (sectorTotal.investment / totalInvestment) * 100
      : 0;
  });
}

export async function generatePortfolioSnapshot(
  holdings: Holding[]
): Promise<PortfolioSnapshotResponse> {
  const tickers = holdings.map(holding => holding.ticker);
  
  const priceMap = await getYahooPrices(tickers);
  
  const tickerExchangePairs = holdings.map(holding => ({
    ticker: holding.ticker,
    exchange: holding.exchange,
  }));
  
  const statsMap = await getGoogleStatsForMultiple(tickerExchangePairs);
  
  const snapshots: Snapshot[] = holdings.map(holding => {
    const currentPrice = priceMap[holding.ticker];
    const stats = statsMap[holding.ticker] || {};
    
    return calculateDerivedFields(
      holding,
      currentPrice,
      stats.peRatio,
      stats.latestEarnings
    );
  });
  
  const sectorTotals = calculateSectorTotals(snapshots);
  
  const summary = calculatePortfolioSummary(snapshots, sectorTotals);
  
  calculatePortfolioPercentages(snapshots, sectorTotals, summary.totalInvestment);
  
  return {
    holdings: snapshots,
    sectorTotals,
    summary,
    lastUpdated: new Date(),
  };
}