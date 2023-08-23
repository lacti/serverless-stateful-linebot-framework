import * as Actor from "@yingyeothon/actor-system";
import * as InMemoryActorSupport from "@yingyeothon/actor-system/lib/support/inmemory";

import { CommandProcessor } from "./handler";
import { ConsoleLogger } from "@yingyeothon/logger";
import { StateMap } from "./entity";
import mem from "mem";
import { newRedisSubsystem } from "@yingyeothon/actor-system-redis-support";
import redisConnect from "@yingyeothon/naive-redis/lib/connection";
import { reply } from "./line";

const logger = new ConsoleLogger("debug");
const getRedisConnection = mem(() => {
  if (process.env.NODE_ENV === "test") {
    throw new Error();
  }
  return redisConnect({
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
  });
});

const subsys =
  process.env.NODE_ENV === "test"
    ? {
        queue: new InMemoryActorSupport.InMemoryQueue(),
        lock: new InMemoryActorSupport.InMemoryLock(),
        awaiter: new InMemoryActorSupport.InMemoryAwaiter(),
        shift: () => logger.error(`Please check your lambda's lifetime`),
        logger,
      }
    : {
        ...newRedisSubsystem({
          connection: getRedisConnection(),
          keyPrefix: "linebot",
          logger,
        }),
        shift: () => logger.error(`Please check your lambda's lifetime`),
        logger,
      };

export interface ICommandRequest {
  command: string;
  replyToken: string;
}

class CommandActor {
  constructor(
    public readonly id: string,
    private readonly processor: CommandProcessor<any, any, any>
  ) {}

  public onPrepare = async () => this.processor.prepareContext();
  public onCommand = async () => this.processor.storeContext();
  public onMessage = async ({ command, replyToken }: ICommandRequest) => {
    const response = await this.processor.processCommand(command);
    if (response) {
      await reply(replyToken, response);
    }
  };
  public onError = (error: Error) => logger.error(`ActorError`, this.id, error);
}

export const newBasicReplier = <E, S extends StateMap<S>, T>(
  newProcessor: (id: string) => CommandProcessor<E, S, T>
) =>
  mem((id: string) => {
    const processor = newProcessor(id);
    const env = {
      ...Actor.singleConsumer,
      ...subsys,
      ...new CommandActor(id, processor),
    };

    // I think it would not be touched 30 seconds.
    return (item: ICommandRequest, timeoutMillis: number = 30 * 1000) =>
      Actor.send(
        env,
        {
          item,
          awaitPolicy: Actor.AwaitPolicy.Commit,
          awaitTimeoutMillis: timeoutMillis,
        },
        {
          aliveMillis: timeoutMillis,
          oneShot: true,
          shiftable: true,
        }
      );
  });
