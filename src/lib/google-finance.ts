import { googleCache, getCachedData, setCachedData } from './cache';
import { MarketData } from '../types/portfolio';

// Mock data for P/E ratios and earnings
const mockData: Record<string, { peRatio?: number; latestEarnings?: number }> = {
  'RELIANCE.NS': { peRatio: 22.5, latestEarnings: 75.21 },
  'TCS.NS': { peRatio: 28.3, latestEarnings: 120.56 },
  'HDFCBANK.NS': { peRatio: 18.7, latestEarnings: 92.45 },
  'INFY.NS': { peRatio: 24.1, latestEarnings: 65.32 },
  'TATAMOTORS.NS': { peRatio: 15.8, latestEarnings: 42.18 },
  'AAPL': { peRatio: 30.2, latestEarnings: 6.14 },
  'MSFT': { peRatio: 35.7, latestEarnings: 11.33 },
  'GOOGL': { peRatio: 25.4, latestEarnings: 5.78 },
  'AMZN': { peRatio: 40.1, latestEarnings: 3.25 },
  'TSLA': { peRatio: 62.3, latestEarnings: 4.02 },
};

// Default values for unknown tickers
const defaultData = { peRatio: 20.0, latestEarnings: 50.0 };

export async function getGoogleStats(
  ticker: string,
  exchange: string
): Promise<MarketData> {
  try {
    const cacheKey = `google_stats_${ticker}_${exchange}`;
    const cachedData = getCachedData<MarketData>(googleCache, cacheKey);
    
    if (cachedData !== undefined) {
      console.log(`[Cache Hit] Google stats for ${ticker}`);
      return cachedData;
    }
    
    console.log(`[Cache Miss] Using mock data for ${ticker}`);
    
    // Use mock data or default values
    const result: MarketData = mockData[ticker] || defaultData;
    
    setCachedData(googleCache, cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error getting stats for ${ticker}:`, error);
    return {};
  }
}

export async function getGoogleStatsForMultiple(
  tickers: Array<{ ticker: string; exchange: string }>
): Promise<Record<string, MarketData>> {
  try {
    const statsMap: Record<string, MarketData> = {};
    
    for (const { ticker, exchange } of tickers) {
      const data = await getGoogleStats(ticker, exchange);
      statsMap[ticker] = data;
    }
    
    return statsMap;
  } catch (error) {
    console.error('Error getting stats for multiple tickers:', error);
    return {};
  }
}