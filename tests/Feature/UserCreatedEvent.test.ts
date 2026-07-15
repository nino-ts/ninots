import { beforeEach, describe, expect, test } from "bun:test";
import { EVENT_DISPATCHER_KEY, SYNC_BUS_KEY } from "@ninots/framework";
import type { EventDispatcher, SyncBus } from "@ninots/framework";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendVerificationEmailJob } from "@/app/Jobs/SendVerificationEmailJob";
import { bootstrap } from "@/bootstrap/app";

describe("UserCreatedEvent", () => {
    beforeEach(() => {
        SendVerificationEmailJob.resetHandledJobs();
    });

    test("dispatches listener and runs sync verification job", async () => {
        const app = await bootstrap();
        const dispatcher = app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const bus = app.make<SyncBus>(SYNC_BUS_KEY);

        await dispatcher.dispatch(new UserCreatedEvent(7, "dev@ninots.test"));

        expect(SendVerificationEmailJob.handledJobs).toHaveLength(1);
        expect(SendVerificationEmailJob.handledJobs[0]?.userId).toBe(7);
        expect(SendVerificationEmailJob.handledJobs[0]?.email).toBe("dev@ninots.test");
        expect(bus.getConnection()).toBe("sync");
    });
});
