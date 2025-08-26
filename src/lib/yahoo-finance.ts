import yahooFinance from 'yahoo-finance2';
import { yahooCache, getCachedData, setCachedData } from './cache';
import { MarketData } from '../types/portfolio';

export async function getYahooPrice(ticker: string): Promise<number | undefined> {
  try {
    const cacheKey = `yahoo_price_${ticker}`;
    const cachedData = getCachedData<number>(yahooCache, cacheKey);
    
    if (cachedData !== undefined) {
      console.log(`[Cache Hit] Yahoo price for ${ticker}: ${cachedData}`);
      return cachedData;
    }
    
    console.log(`[Cache Miss] Fetching Yahoo price for ${ticker}`);
    const result = await yahooFinance.quote(ticker);
    
    if (result && result.regularMarketPrice) {
      const price = result.regularMarketPrice;
      setCachedData(yahooCache, cacheKey, price);
      return price;
    }
    
    console.log(`No price data found for ${ticker}`);
    return undefined;
  } catch (error) {
    console.error(`Error fetching Yahoo price for ${ticker}:`, error);
    return undefined;
  }
}

export async function getYahooPrices(tickers: string[]): Promise<Record<string, number>> {
  try {
    const uniqueTickers = [...new Set(tickers)];
    const promises = uniqueTickers.map(ticker => getYahooPrice(ticker));
    const results = await Promise.allSettled(promises);
    
    const priceMap: Record<string, number> = {};
    
    results.forEach((result, index) => {
      const ticker = uniqueTickers[index];
      if (result.status === 'fulfilled' && result.value !== undefined) {
        priceMap[ticker] = result.value;
      }
    });
    
    return priceMap;
  } catch (error) {
    console.error('Error fetching Yahoo prices:', error);
    return {};
  }
}