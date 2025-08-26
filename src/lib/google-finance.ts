import axios from 'axios';
import * as cheerio from 'cheerio';
import { googleCache, getCachedData, setCachedData } from './cache';
import { MarketData } from '../types/portfolio';

function getGoogleFinanceUrl(ticker: string, exchange: string): string {
  let formattedTicker = ticker;
  
  if (ticker.endsWith('.NS')) {
    formattedTicker = ticker.replace('.NS', '');
    return `https://www.google.com/finance/quote/${formattedTicker}:NSE`;
  } else if (ticker.endsWith('.BO')) {
    formattedTicker = ticker.replace('.BO', '');
    return `https://www.google.com/finance/quote/${formattedTicker}:BSE`;
  } else if (exchange === 'NASDAQ') {
    return `https://www.google.com/finance/quote/${formattedTicker}:NASDAQ`;
  } else if (exchange === 'NYSE') {
    return `https://www.google.com/finance/quote/${formattedTicker}:NYSE`;
  }
  
  return `https://www.google.com/finance/quote/${formattedTicker}`;
}

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
    
    console.log(`[Cache Miss] Fetching Google stats for ${ticker}`);
    const url = getGoogleFinanceUrl(ticker, exchange);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    const $ = cheerio.load(response.data);
    const result: MarketData = {};
    
    $('.gyFHrc').each((i, el) => {
      const label = $(el).find('.mfs7Fc').text();
      const value = $(el).find('.P6K39c').text();
      
      if (label.includes('P/E ratio')) {
        const peRatio = parseFloat(value.replace(/,/g, ''));
        if (!isNaN(peRatio)) {
          result.peRatio = peRatio;
        }
      } else if (label.includes('EPS')) {
        const earnings = parseFloat(value.replace(/,/g, ''));
        if (!isNaN(earnings)) {
          result.latestEarnings = earnings;
        }
      }
    });
    
    setCachedData(googleCache, cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error fetching Google stats for ${ticker}:`, error);
    return {};
  }
}

export async function getGoogleStatsForMultiple(
  tickers: Array<{ ticker: string; exchange: string }>
): Promise<Record<string, MarketData>> {
  try {
    const promises = tickers.map(({ ticker, exchange }) => 
      getGoogleStats(ticker, exchange).then(data => ({ ticker, data }))
    );
    
    const results = await Promise.allSettled(promises);
    
    const statsMap: Record<string, MarketData> = {};
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        statsMap[result.value.ticker] = result.value.data;
      }
    });
    
    return statsMap;
  } catch (error) {
    console.error('Error fetching Google stats for multiple tickers:', error);
    return {};
  }
}