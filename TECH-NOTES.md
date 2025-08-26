# Technical Notes

This document provides technical details about the implementation of the Portfolio Dashboard application, focusing on the scraping approach, cache strategy, and rate limit handling.

## Data Sources

The application uses two primary data sources:

1. **Yahoo Finance API** (via yahoo-finance2 package)
   - Used for fetching current market prices (CMP)
   - Provides real-time or slightly delayed stock quotes

2. **Google Finance** (via web scraping)
   - Used for fetching P/E Ratio and Latest Earnings
   - Data is scraped from the Google Finance web pages

## Scraping Approach

### Google Finance Scraping

The application scrapes data from Google Finance using the following approach:

1. **URL Construction**:
   - Different exchanges require different URL formats
   - NSE tickers: `https://www.google.com/finance/quote/TICKER:NSE`
   - BSE tickers: `https://www.google.com/finance/quote/TICKER:BSE`
   - NASDAQ tickers: `https://www.google.com/finance/quote/TICKER:NASDAQ`
   - NYSE tickers: `https://www.google.com/finance/quote/TICKER:NYSE`

2. **HTTP Request**:
   - Uses Axios to fetch the HTML content
   - Includes a User-Agent header to mimic a browser request

3. **HTML Parsing**:
   - Uses Cheerio to parse the HTML and extract data
   - Targets specific CSS selectors to find P/E Ratio and EPS values
   - Example: `.gyFHrc` class for key-value pairs, `.mfs7Fc` for labels, and `.P6K39c` for values

4. **Error Handling**:
   - Gracefully handles missing data (returns undefined)
   - Catches and logs any scraping errors
   - Returns empty objects when scraping fails

## Cache Strategy

The application implements a two-tier caching strategy using node-cache:

1. **Yahoo Finance Cache**:
   - TTL (Time To Live): 15 seconds
   - Check period: 5 seconds
   - Purpose: Minimize API calls while keeping data relatively fresh
   - Implementation: `yahooCache` instance in `cache.ts`

2. **Google Finance Cache**:
   - TTL: 3600 seconds (1 hour)
   - Check period: 600 seconds (10 minutes)
   - Purpose: Reduce scraping frequency for data that changes less frequently
   - Implementation: `googleCache` instance in `cache.ts`

3. **Cache Keys**:
   - Yahoo Finance: `yahoo_price_${ticker}`
   - Google Finance: `google_stats_${ticker}_${exchange}`

4. **Cache Helpers**:
   - `getCachedData<T>`: Type-safe function to retrieve data from cache
   - `setCachedData<T>`: Type-safe function to store data in cache

## Rate Limit Handling

To avoid hitting rate limits and to ensure the application remains responsive:

1. **Batch Processing**:
   - `getYahooPrices`: Fetches prices for multiple tickers in parallel
   - `getGoogleStatsForMultiple`: Fetches stats for multiple tickers in parallel
   - Uses `Promise.allSettled` to handle partial failures

2. **Error Resilience**:
   - Continues operation even if some API calls fail
   - Returns partial data when available
   - Logs errors for debugging

3. **Throttling**:
   - Client-side refresh interval: 15 seconds
   - Respects Yahoo Finance's rate limits
   - Minimizes Google Finance scraping frequency

4. **Fallbacks**:
   - UI gracefully handles missing data with "—" placeholders
   - Continues to display cached data when new data can't be fetched

## Performance Optimizations

1. **Memoization**:
   - Table columns are memoized to prevent unnecessary re-renders
   - Formatting functions are defined outside component render cycles

2. **Efficient Data Processing**:
   - Sector totals are pre-calculated on the server
   - Derived values are computed once and reused

3. **Conditional Rendering**:
   - Uses loading states to show skeletons during data fetching
   - Only renders components when data is available

4. **Network Efficiency**:
   - Caching reduces network requests
   - API responses are kept minimal and focused

## Security Considerations

1. **Input Validation**:
   - All API inputs are validated using Zod schemas
   - Invalid requests return appropriate error responses

2. **Error Handling**:
   - Errors are logged but not exposed to clients in detail
   - User-friendly error messages are displayed

3. **Web Scraping Ethics**:
   - Respects robots.txt
   - Includes proper User-Agent headers
   - Implements caching to reduce request frequency

## Future Improvements

1. **API Key Management**:
   - Implement proper API key management for Yahoo Finance
   - Add rate limit tracking and adaptive throttling

2. **Alternative Data Sources**:
   - Add fallback data sources when primary sources fail
   - Implement data source rotation

3. **Caching Improvements**:
   - Implement Redis for distributed caching
   - Add cache invalidation strategies

4. **Performance Monitoring**:
   - Add telemetry for API call success rates
   - Monitor cache hit/miss ratios