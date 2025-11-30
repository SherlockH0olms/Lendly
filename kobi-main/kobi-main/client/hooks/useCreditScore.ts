import { useState, useCallback, useMemo } from "react";
import { CompanyData, CreditScoreResult } from "@shared/api";
import { calculateCreditScore } from "@shared/creditScoring";

interface CacheEntry {
  companyDataId: string;
  result: CreditScoreResult;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useCreditScore() {
  const [cache, setCache] = useState<CacheEntry | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = useCallback(
    (companyData: CompanyData): CreditScoreResult => {
      setIsCalculating(true);
      setError(null);

      try {
        // Check cache
        if (cache && cache.companyDataId === companyData.id) {
          const age = Date.now() - cache.timestamp;
          if (age < CACHE_DURATION) {
            setIsCalculating(false);
            return cache.result;
          }
        }

        // Calculate score
        const result = calculateCreditScore(companyData);

        // Update cache
        setCache({
          companyDataId: companyData.id,
          result,
          timestamp: Date.now(),
        });

        setIsCalculating(false);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to calculate credit score";
        setError(errorMessage);
        setIsCalculating(false);
        throw err;
      }
    },
    [cache],
  );

  const clearCache = useCallback(() => {
    setCache(null);
  }, []);

  // Precompute score if company data is available
  const memoizedScore = useMemo(() => {
    return cache?.result;
  }, [cache]);

  return {
    calculateScore,
    cachedScore: memoizedScore,
    clearCache,
    isCalculating,
    error,
  };
}
