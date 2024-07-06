/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type CacheKey = string;
interface CacheValue<T> {
  fetcher: () => Promise<T>;
  storeSetter: (val: T) => void;
  value?: T;
}

interface CacheMutationOptions {
  /**
   * It will trigger a revalidation (mark the data as expired and trigger a refetch) for the resource.
   */
  revalidate?: boolean;
}

interface LoadDataConfig {
  getDataKeys: () => CacheKey[];
  mutateCache: (keys: CacheKey[], options: CacheMutationOptions) => void;
}

const FETCH_CACHE = new Map<CacheKey, CacheValue<any>>();

// Ensures loading of data to store only once per session.
export const useLoadData = <T>(
  dataKey: CacheKey,
  fetcher: () => Promise<T>,
  storeSetter: (val: T) => void,
): LoadDataConfig => {
  if (!FETCH_CACHE.has(dataKey)) {
    FETCH_CACHE.set(dataKey, { fetcher, storeSetter });

    loadDataAsync(dataKey).catch((err) =>
      console.log(`[Error] Loading Data with key: ${dataKey}.`, err),
    );
  }

  return useLoadDataConfig();
};

export const useLoadDataConfig = (): LoadDataConfig => {
  const getDataKeys = () => Array.from(FETCH_CACHE.keys());

  const mutateCache = (keys: CacheKey[], options: CacheMutationOptions) => {
    for (const dataKey of keys) {
      if (FETCH_CACHE.has(dataKey)) {
        if (options.revalidate) {
          loadDataAsync(dataKey).catch((err) =>
            console.log(`[Error] Revalidating Data with key: ${dataKey}.`, err),
          );
        }
      }
    }
  };

  return { getDataKeys, mutateCache };
};

const loadDataAsync = async (dataKey: string) => {
  const fetchCacheValue = FETCH_CACHE.get(dataKey)!;

  const val = await fetchCacheValue.fetcher();
  fetchCacheValue.storeSetter(val);
  FETCH_CACHE.set(dataKey, { ...fetchCacheValue, value: val });
};
