import {
  ActorSystem,
  InMemoryLock,
  InMemoryQueue
} from "@yingyeothon/actor-system";
import { RedisLock, RedisQueue } from "@yingyeothon/actor-system-redis-support";
import { ConsoleLogger } from "@yingyeothon/logger";
import IORedis from "ioredis";
import mem from "mem";
import { StateMap } from "./entity";
import { CommandProcessor, ICommandRequest } from "./handler";

const logger = new ConsoleLogger("debug");
const getRedis = mem(() => {
  if (process.env.NODE_ENV === "test") {
    throw new Error();
  }
  return new IORedis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  });
});

export const getSystem = mem(() =>
  process.env.NODE_ENV === "test"
    ? new ActorSystem({
        queue: new InMemoryQueue(),
        lock: new InMemoryLock(),
        logger
      })
    : new ActorSystem({
        queue: new RedisQueue({ redis: getRedis(), logger }),
        lock: new RedisLock({ redis: getRedis(), logger }),
        logger
      })
);

export const newBasicActor = <E, S extends StateMap<S>>(
  newProcessor: (id: string) => CommandProcessor<E, S>
) => (id: string) => {
  const processor = newProcessor(id);
  return getSystem().spawn<ICommandRequest>(id, actor =>
    actor
      .on("beforeAct", processor.prepareContext)
      .on("afterAct", processor.storeContext)
      .on("act", ({ message }) => processor.processCommand(message))
      .on("error", error => logger.error(`ActorError`, id, error))
  );
};
