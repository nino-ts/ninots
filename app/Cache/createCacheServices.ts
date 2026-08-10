/**
 * Cache service wiring for the starter.
 *
 * Stores: array | file | redis (`Bun.redis` via `@ninots/cache`).
 *
 * @packageDocumentation
 */

import {
    ArrayStore,
    CacheManager,
    createDefaultCacheRedisClient,
    FileStore,
    RedisStore,
} from "@ninots/cache";
import { mkdirSync } from "node:fs";
import cacheConfig from "@/config/cache";

/** Container key for {@link CacheManager}. */
export const CACHE_MANAGER_KEY = "CacheManager";

/**
 * Create the canonical {@link CacheManager} with array / file / redis stores.
 */
export function createCacheManager(): CacheManager {
    const manager = new CacheManager({ default: cacheConfig.default });
    const prefix = cacheConfig.prefix;

    manager.extend("array", () => new ArrayStore());

    manager.extend("file", () => {
        const path = cacheConfig.stores.file.path;
        mkdirSync(path, { recursive: true });
        return new FileStore(path);
    });

    manager.extend("redis", () => {
        const redis = cacheConfig.stores.redis;
        const url = redis.url;
        return new RedisStore(
            createDefaultCacheRedisClient(url !== undefined && url.length > 0 ? url : undefined),
            { prefix: redis.prefix ?? prefix },
        );
    });

    return manager;
}
