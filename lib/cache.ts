import { kv } from "@vercel/kv";

/**
 * Cache utility using Vercel KV (Redis)
 * Falls back to Map if KV is not available
 */
class CacheManager {
    private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

    async get<T = any>(key: string): Promise<T | null> {
        try {
            if (process.env.KV_REST_API_URL) {
                return await kv.get<T>(key);
            }
        } catch (error) {
            console.warn(`KV get failed for ${key}, using memory fallback`);
        }

        // Fallback to memory
        const entry = this.memoryCache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.memoryCache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    async set<T = any>(
        key: string,
        value: T,
        ttlSeconds?: number
    ): Promise<void> {
        try {
            if (process.env.KV_REST_API_URL) {
                if (ttlSeconds) {
                    await kv.set(key, value, { ex: ttlSeconds });
                } else {
                    await kv.set(key, value);
                }
                return;
            }
        } catch (error) {
            console.warn(`KV set failed for ${key}, using memory fallback`);
        }

        // Fallback to memory
        const ttl = ttlSeconds ? ttlSeconds * 1000 : 3600000; // Default 1 hour
        const expiry = Date.now() + ttl;
        this.memoryCache.set(key, { value, expiry });

        // Cleanup old entries
        this.cleanup();
    }

    async del(key: string): Promise<void> {
        try {
            if (process.env.KV_REST_API_URL) {
                await kv.del(key);
                return;
            }
        } catch (error) {
            console.warn(`KV del failed for ${key}`);
        }

        this.memoryCache.delete(key);
    }

    async hincrby(key: string, field: string, increment: number = 1): Promise<number> {
        try {
            if (process.env.KV_REST_API_URL) {
                return await kv.hincrby(key, field, increment);
            }
        } catch (error) {
            console.warn(`KV hincrby failed for ${key}:${field}`);
        }

        // Memory fallback for analytics
        const hashKey = `${key}:${field}`;
        const entry = this.memoryCache.get(hashKey);
        const currentValue = entry?.value || 0;
        const newValue = currentValue + increment;

        this.memoryCache.set(hashKey, {
            value: newValue,
            expiry: Date.now() + 86400000, // 24 hours
        });

        return newValue;
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.memoryCache.entries()) {
            if (now > entry.expiry) {
                this.memoryCache.delete(key);
            }
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.memoryCache.size,
            backend: process.env.KV_REST_API_URL ? "Vercel KV" : "In-Memory",
        };
    }
}

// Export singleton
export const cache = new CacheManager();

/**
 * Helper functions
 */
export async function getCached<T = any>(
    key: string
): Promise<T | null> {
    return await cache.get<T>(key);
}

export async function setCached<T = any>(
    key: string,
    value: T,
    ttlSeconds?: number
): Promise<void> {
    await cache.set(key, value, ttlSeconds);
}

export async function deleteCached(key: string): Promise<void> {
    await cache.del(key);
}

export async function incrementAnalytics(
    category: string,
    metric: string,
    value: number = 1
): Promise<number> {
    return await cache.hincrby(`analytics:${category}`, metric, value);
}
