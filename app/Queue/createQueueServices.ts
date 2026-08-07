import { createDefaultRedisClient, JobRegistry, QueueManager, type QueueManagerConfig } from "@ninots/queue";
import { SendVerificationEmailJob } from "@/app/Jobs/SendVerificationEmailJob";
import queueConfig from "@/config/queue";

/** Container key for {@link QueueManager}. */
export const QUEUE_MANAGER_KEY = "QueueManager";

/** Container key for the app {@link JobRegistry}. */
export const JOB_REGISTRY_KEY = "JobRegistry";

/**
 * Build {@link QueueManagerConfig} from app config (lazy Redis client).
 */
export function buildQueueManagerConfig(): QueueManagerConfig {
    const redis = queueConfig.connections.redis;
    const url = redis.url;

    return {
        default: queueConfig.default,
        connections: {
            sync: queueConfig.connections.sync,
            redis: {
                driver: "redis",
                client: createDefaultRedisClient(url !== undefined && url.length > 0 ? url : undefined),
                queue: redis.queue,
                prefix: redis.prefix,
                blockTimeoutSeconds: redis.blockTimeoutSeconds,
            },
        },
    };
}

/**
 * Create the canonical {@link QueueManager} for this app.
 */
export function createQueueManager(config: QueueManagerConfig = buildQueueManagerConfig()): QueueManager {
    return new QueueManager(config);
}

/**
 * Register domain job factories for `nino queue:work`.
 */
export function createJobRegistry(): JobRegistry {
    return new JobRegistry().register("SendVerificationEmailJob", (data) => SendVerificationEmailJob.fromData(data));
}
