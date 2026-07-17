"use client";

import { useCallback, useState } from "react";

export function useApi<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message: string }).message)
            : "Request failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { loading, error, data, execute };
}
