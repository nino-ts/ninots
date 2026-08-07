import { beforeEach, describe, expect, test } from "bun:test";
import { EVENT_DISPATCHER_KEY } from "@ninots/foundation";
import type { EventDispatcher } from "@ninots/events";
import type { QueueManager } from "@ninots/queue";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendVerificationEmailJob } from "@/app/Jobs/SendVerificationEmailJob";
import { QUEUE_MANAGER_KEY } from "@/app/Queue/createQueueServices";
import { bootstrap } from "@/bootstrap/app";

describe("UserCreatedEvent", () => {
    beforeEach(() => {
        SendVerificationEmailJob.resetHandledJobs();
    });

    test("dispatches listener and runs sync verification job", async () => {
        const app = await bootstrap();
        const dispatcher = app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const queue = app.make<QueueManager>(QUEUE_MANAGER_KEY);

        await dispatcher.dispatch(new UserCreatedEvent(7, "dev@ninots.test"));

        expect(SendVerificationEmailJob.handledJobs).toHaveLength(1);
        expect(SendVerificationEmailJob.handledJobs[0]?.userId).toBe(7);
        expect(SendVerificationEmailJob.handledJobs[0]?.email).toBe("dev@ninots.test");
        expect(queue.getDefaultConnection()).toBe("sync");
    });
});
