// hooks/useRefresher.ts
import { useState, useCallback } from "react";

export function useRefresher(callback: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await callback();
    } finally {
      setRefreshing(false);
    }
  }, [callback]);

  return { refreshing, onRefresh };
}
