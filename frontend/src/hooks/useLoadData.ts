import { useEffect } from "react";

const fetchRecord = new Map<string, boolean>();

// Ensures loading of data to store only once per session.
export const useLoadData = <T>(
  dataKey: string,
  fetcher: () => T,
  storeSetter: (val: T) => void,
) => {
  useEffect(() => {
    const asyncFn = async () => {
      if (fetchRecord.has(dataKey)) {
        return;
      }
      const val = await fetcher();
      storeSetter(val);
      fetchRecord.set(dataKey, true);
    };

    asyncFn();
  }, []);
};
