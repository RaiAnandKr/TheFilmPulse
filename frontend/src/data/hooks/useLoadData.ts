/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from "react";
import { EventEmitter } from "~/utilities/eventEmitter";

type CacheKey = string;

interface CacheValue<T> {
  fetcher: () => Promise<T>;
  storeSetter: (val: T) => void;
  fetcherPromise?: Promise<T>;
}

interface CacheMutationOptions {
  /**
   * It will trigger a revalidation (mark the data as expired and trigger a refetch) for the resource.
   */
  revalidate?: boolean;
}

export enum LoadStatus {
  LOADING = "LOADING",
  // Denotes there is an ongoing request and data is not loaded yet.
  LOADED = "LOADED",
  // Denotes there is an ongoing request whether the data is loaded or not.
  REVALIDATING = "REVALIDATING",
  REVALIDATED = "REVALIDATED",
  ERROR = "ERROR",
}

interface LoadState {
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
}

interface LoadDataConfig {
  getDataKeys: () => CacheKey[];
  mutateCache: (keys: CacheKey[], options: CacheMutationOptions) => void;
}

const FETCH_CACHE = new Map<CacheKey, CacheValue<any>>();

/**
 * Ensures loading of data to store only once per session, unless revalidated.
 * @param dataKey unique key for data fetcher and store setter. There has to be 1:1 mapping b/w dataKey and (fetcher, storeSetter) params.
 * @param fetcher API call to get the data
 * @param storeSetter store setter
 * @returns
 */
export const useLoadData = <T>(
  dataKey: CacheKey,
  fetcher: () => Promise<T>,
  storeSetter: (val: T) => void,
): LoadState & LoadDataConfig => {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.LOADING);

  if (!FETCH_CACHE.has(dataKey)) {
    FETCH_CACHE.set(dataKey, {
      fetcher,
      storeSetter,
    });
  }

  useEffect(() => {
    const listener = EventEmitter.onEvent(dataKey, (status: LoadStatus) => {
      setLoadStatus(status);
    });

    fetchData<T>(dataKey)
      .then((val) => {
        FETCH_CACHE.get(dataKey)!.storeSetter(val);
        EventEmitter.emitEvent(dataKey, LoadStatus.LOADED);
      })
      .catch((err) => {
        console.log(`[Error] Loading Data with key: ${dataKey}.`, err);
        EventEmitter.emitEvent(dataKey, LoadStatus.ERROR);
      });

    return () => EventEmitter.remove(dataKey, listener);
  }, []);

  const isLoading = loadStatus === LoadStatus.LOADING;
  const isValidating = [LoadStatus.LOADING, LoadStatus.REVALIDATING].includes(
    loadStatus,
  );
  const isError = loadStatus === LoadStatus.ERROR;

  return { isLoading, isValidating, isError, ...useLoadDataConfig() };
};

export const useLoadDataConfig = (): LoadDataConfig => ({
  getDataKeys,
  mutateCache,
});

const fetchData = async <T>(dataKey: string): Promise<T> => {
  const fetchCacheValue = FETCH_CACHE.get(dataKey)!;

  if (!fetchCacheValue.fetcherPromise) {
    fetchCacheValue.fetcherPromise = fetchCacheValue.fetcher();
  }

  return fetchCacheValue.fetcherPromise;
};

const revalidateCache = (dataKey: CacheKey) => {
  EventEmitter.emitEvent(dataKey, LoadStatus.REVALIDATING);
  FETCH_CACHE.get(dataKey)!.fetcherPromise = undefined;

  fetchData(dataKey)
    .then((val) => {
      FETCH_CACHE.get(dataKey)!.storeSetter(val);
      EventEmitter.emitEvent(dataKey, LoadStatus.REVALIDATED);
    })
    .catch((err) => {
      console.log(`[Error] Revalidating Data with key: ${dataKey}.`, err);
      EventEmitter.emitEvent(dataKey, LoadStatus.ERROR);
    });
};

const getDataKeys = () => Array.from(FETCH_CACHE.keys());

const mutateCache = (keys: CacheKey[], options: CacheMutationOptions) => {
  for (const dataKey of keys) {
    if (FETCH_CACHE.has(dataKey)) {
      if (options.revalidate) {
        revalidateCache(dataKey);
      }
    }
  }
};
