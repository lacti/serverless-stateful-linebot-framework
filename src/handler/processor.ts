import { ConsoleLogger } from "@yingyeothon/logger";
import copy from "fast-copy";
import { deepEqual } from "fast-equals";
import { EntityStateHolder, IState, StateMap } from "../entity";
import * as line from "../line";
import { SimpleGetSetRepository } from "../repository";
import { lookupHandler, StateHandler, StateRoute } from "./router";

const logger = new ConsoleLogger("debug");

interface ITuple<E, S> {
  entity: E;
  state: S;
}

export interface IProcessorOptions<E, S extends StateMap<S>> {
  bucketPrefix?: string;
  routes: StateRoute<S>;
  handlers: StateHandler<E, S>;
  initialState: () => IState<S>;
  initialEntity: () => E;
}

export interface ICommandRequest {
  command: string;
  replyToken: string;
}

export const newProcessorBuilder = <E, S extends StateMap<S>>(
  options: IProcessorOptions<E, S>
) => (entityId: string) => new CommandProcessor(options, entityId);

export class CommandProcessor<E, S extends StateMap<S>> {
  private readonly repository: SimpleGetSetRepository<ITuple<E, IState<S>>>;

  private entity: E | undefined;
  private state: IState<S> | undefined;
  private oldEntity: E | undefined;
  private oldState: IState<S> | undefined;

  constructor(
    private readonly options: IProcessorOptions<E, S>,
    entityId: string
  ) {
    this.repository = new SimpleGetSetRepository({
      id: entityId,
      prefix: options.bucketPrefix
    });
  }

  public prepareContext = async () => {
    const { initialEntity, initialState } = this.options;
    const tuple = await this.repository.get();
    this.entity = tuple ? tuple.entity : initialEntity();
    this.state = tuple ? tuple.state : initialState();
    this.oldEntity = copy(this.entity);
    this.oldState = copy(this.state);
  };

  public storeContext = async () => {
    if (
      !deepEqual(this.oldEntity, this.entity) ||
      !deepEqual(this.oldState, this.state)
    ) {
      const tuple: ITuple<E, IState<S>> = {
        entity: this.entity!,
        state: this.state!
      };
      await this.repository.set(tuple);
    }
  };

  public processCommand = async ({ command, replyToken }: ICommandRequest) => {
    const holder = new EntityStateHolder<E, S>(this.entity!, this.state!);
    logger.info(`Handle command[${command}] on state[${holder.state.name}]`);
    logger.debug(`Entity[${this.entity}], State[${this.state}]`);

    const { routes, handlers } = this.options;
    const handler = lookupHandler<E, S, any>(
      routes[holder.state.name],
      handlers[holder.state.name],
      command
    );
    if (!handler) {
      return;
    }

    let response = handler(holder);
    if (response instanceof Promise) {
      response = await response;
    }
    logger.debug(`Result of command[${command}]: ${response}`);

    // Update memory models after handling
    this.entity = holder.entity;
    this.state = holder.state;

    if (response) {
      await line.reply(replyToken, response);
    }
  };
}

export const processOne = async (
  processor: CommandProcessor<any, any>,
  request: ICommandRequest
) => {
  await processor.prepareContext();
  await processor.processCommand(request);
  await processor.storeContext();
};
