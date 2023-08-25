import { EntityStateHolder, State, StateMap } from "../entity";
import { StateRouteHandlers, lookupHandler } from "./router";

import { ConsoleLogger } from "@yingyeothon/logger";
import { SimpleGetSetRepository } from "../repository";
import copy from "fast-copy";
import { deepEqual } from "fast-equals";

const logger = new ConsoleLogger("debug");
const pjson = (obj: any) => JSON.stringify(obj, null, 2);

interface ITuple<E, S> {
  entity?: E;
  state?: S;
}

export interface IProcessorOptions<E, S extends StateMap<S>, T> {
  bucketPrefix?: string;
  routeHandlers: StateRouteHandlers<E, S, T>;
  initialState: () => State<S>;
  initialEntity: (entityId: string) => E;
  decorateEntity?: (entity: E) => T;
}

export class CommandProcessor<E, S extends StateMap<S>, T> {
  private readonly repository: SimpleGetSetRepository<ITuple<E, State<S>>>;

  private entity: E | undefined;
  private state: State<S> | undefined;
  private oldEntity: E | undefined;
  private oldState: State<S> | undefined;

  constructor(
    private readonly options: IProcessorOptions<E, S, T>,
    private readonly entityId: string
  ) {
    this.repository = new SimpleGetSetRepository({
      id: entityId,
      prefix: options.bucketPrefix,
    });
  }

  public prepareContext = async () => {
    const { initialEntity, initialState } = this.options;
    const tuple = await this.repository.get();
    this.entity =
      !!tuple && !!tuple.entity ? tuple.entity : initialEntity(this.entityId);
    this.state = !!tuple && !!tuple.state ? tuple.state : initialState();
    this.oldEntity = copy(this.entity);
    this.oldState = copy(this.state);
  };

  public storeContext = async () => {
    if (
      !deepEqual(this.oldEntity, this.entity) ||
      !deepEqual(this.oldState, this.state)
    ) {
      const tuple: ITuple<E, State<S>> = {
        entity: this.entity,
        state: this.state,
      };
      await this.repository.set(tuple);

      this.oldEntity = copy(this.entity);
      this.oldState = copy(this.state);
    }
  };

  public processCommand = async (command: string) => {
    const { decorateEntity = this.castEntityImplicit } = this.options;
    const holder = new EntityStateHolder<E, S, T>(
      this.entityId,
      this.entity!,
      this.state!,
      decorateEntity
    );
    logger.info(
      `Handle command[${command}] on state[${String(holder.state.name)}]`
    );
    logger.debug(`Entity[${pjson(this.entity)}], State[${pjson(this.state)}]`);

    const { routeHandlers } = this.options;
    const handler = lookupHandler<E, S, T, any>(
      routeHandlers[holder.state.name],
      command
    );
    if (!handler) {
      logger.error(`No handler for a command[${command}]`);
      return null;
    }

    let response = handler(holder);
    if (response instanceof Promise) {
      response = await response;
    }
    logger.debug(`Result of command[${command}]: ${response}`);
    logger.debug(`Entity[${pjson(this.entity)}], State[${pjson(this.state)}]`);

    // Update memory models after handling
    this.entity = holder.entity;
    this.state = holder.state;

    return response;
  };

  public async truncate() {
    const { initialEntity, initialState } = this.options;
    this.entity = this.oldEntity = initialEntity(this.entityId);
    this.state = this.oldState = initialState();
    await this.repository.delete();
  }

  private castEntityImplicit = (entity: E) => entity as any as T;
}
