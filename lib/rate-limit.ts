import { kv } from "@vercel/kv";

interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Rate limiter using Vercel KV (Redis)
 * Falls back to in-memory if KV is not available
 */
class RateLimiter {
    private inMemoryStore: Map<string, { count: number; resetTime: number }> =
        new Map();

    async limit(
        identifier: string,
        limit: number = 10,
        window: number = 60
    ): Promise<RateLimitResult> {
        try {
            // Try Vercel KV first
            if (process.env.KV_REST_API_URL) {
                return await this.kvLimit(identifier, limit, window);
            }
        } catch (error) {
            console.warn("KV rate limit failed, using in-memory fallback");
        }

        // Fallback to in-memory
        return this.memoryLimit(identifier, limit, window);
    }

    private async kvLimit(
        identifier: string,
        limit: number,
        window: number
    ): Promise<RateLimitResult> {
        const key = `ratelimit:${identifier}`;
        const now = Date.now();
        const resetTime = now + window * 1000;

        // Get current count
        const current = (await kv.get<number>(key)) || 0;

        if (current >= limit) {
            const ttl = await kv.ttl(key);
            return {
                success: false,
                limit,
                remaining: 0,
                reset: now + (ttl > 0 ? ttl * 1000 : window * 1000),
            };
        }

        // Increment counter
        const pipeline = kv.pipeline();
        pipeline.incr(key);
        pipeline.expire(key, window);
        await pipeline.exec();

        return {
            success: true,
            limit,
            remaining: limit - current - 1,
            reset: resetTime,
        };
    }

    private memoryLimit(
        identifier: string,
        limit: number,
        window: number
    ): RateLimitResult {
        const now = Date.now();
        const entry = this.inMemoryStore.get(identifier);

        if (entry) {
            if (now < entry.resetTime) {
                if (entry.count >= limit) {
                    return {
                        success: false,
                        limit,
                        remaining: 0,
                        reset: entry.resetTime,
                    };
                }
                entry.count++;
                return {
                    success: true,
                    limit,
                    remaining: limit - entry.count,
                    reset: entry.resetTime,
                };
            }
        }

        // Create new entry
        const resetTime = now + window * 1000;
        this.inMemoryStore.set(identifier, { count: 1, resetTime });

        // Cleanup old entries
        this.cleanup(now);

        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: resetTime,
        };
    }

    private cleanup(now: number) {
        for (const [key, entry] of this.inMemoryStore.entries()) {
            if (now >= entry.resetTime) {
                this.inMemoryStore.delete(key);
            }
        }
    }
}

// Export singleton
export const ratelimit = new RateLimiter();

/**
 * Rate limit middleware helper
 */
export async function checkRateLimit(
    identifier: string,
    limit: number = 10,
    window: number = 60
): Promise<RateLimitResult> {
    return await ratelimit.limit(identifier, limit, window);
}
