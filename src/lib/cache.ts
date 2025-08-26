import NodeCache from 'node-cache';

export const yahooCache = new NodeCache({
  stdTTL: 15,
  checkperiod: 5,
});

export const googleCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600,
});

export function getCachedData<T>(
  cache: NodeCache,
  key: string
): T | undefined {
  return cache.get<T>(key);
}

export function setCachedData<T>(
  cache: NodeCache,
  key: string,
  data: T
): void {
  cache.set(key, data);
}