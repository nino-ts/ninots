/**
 * Feature smoke — cache wire (array default + redis store with mock client).
 *
 * @packageDocumentation
 */

import { describe, expect, test } from "bun:test";
import {
    ArrayStore,
    CacheManager,
    RedisStore,
    type CacheRedisClient,
} from "@ninots/cache";
import { CACHE_MANAGER_KEY, createCacheManager } from "@/app/Cache/createCacheServices";
import { bootstrap } from "@/bootstrap/app";

/**
 * Minimal in-memory Redis client for Feature tests (no live Redis).
 */
function createMemoryCacheRedisClient(): CacheRedisClient {
    const data = new Map<string, string>();
    return {
        get: async (key) => data.get(key) ?? null,
        set: async (key, value) => {
            data.set(key, value);
            return "OK";
        },
        setex: async (key, _seconds, value) => {
            data.set(key, value);
            return "OK";
        },
        del: async (...keys) => {
            let n = 0;
            for (const key of keys) {
                if (data.delete(key)) {
                    n += 1;
                }
            }
            return n;
        },
        incrby: async (key, increment) => {
            const next = Number(data.get(key) ?? "0") + increment;
            data.set(key, String(next));
            return next;
        },
        decrby: async (key, decrement) => {
            const next = Number(data.get(key) ?? "0") - decrement;
            data.set(key, String(next));
            return next;
        },
        keys: async (pattern) => {
            const prefix = pattern.endsWith("*") ? pattern.slice(0, -1) : pattern;
            return [...data.keys()].filter((k) => k.startsWith(prefix));
        },
    };
}

describe("Cache smoke", () => {
    test("bootstrap resolves CacheManager singleton", async () => {
        const app = await bootstrap();
        const cache = app.make<CacheManager>(CACHE_MANAGER_KEY);
        expect(cache).toBeDefined();
        expect(cache.store().getStore()).toBeInstanceOf(ArrayStore);
    });

    test("createCacheManager put/get via default array store", async () => {
        const cache = createCacheManager();
        await cache.put("smoke:key", { ok: true }, 60);
        expect(await cache.get<{ ok: boolean }>("smoke:key")).toEqual({ ok: true });
        await cache.forget("smoke:key");
        expect(await cache.get("smoke:key")).toBeUndefined();
    });

    test("redis store works with injected mock client", async () => {
        const store = new RedisStore(createMemoryCacheRedisClient(), { prefix: "test_cache_" });
        const manager = new CacheManager({ default: "redis" });
        manager.extend("redis", () => store);

        await manager.put("user", { id: 7 });
        expect(await manager.get<{ id: number }>("user")).toEqual({ id: 7 });
        expect(store.getPrefix()).toBe("test_cache_");
        await manager.flush();
        expect(await manager.get("user")).toBeUndefined();
    });
});
