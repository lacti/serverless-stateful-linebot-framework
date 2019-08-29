import { IState, StateMap } from "../entity";
import { StateRouteHandlers } from "./router";
export interface IProcessorOptions<E, S extends StateMap<S>, T> {
    bucketPrefix?: string;
    routeHandlers: StateRouteHandlers<E, S, T>;
    initialState: () => IState<S>;
    initialEntity: () => E;
    decorateEntity?: (entity: E) => T;
}
export declare class CommandProcessor<E, S extends StateMap<S>, T> {
    private readonly options;
    private readonly repository;
    private entity;
    private state;
    private oldEntity;
    private oldState;
    constructor(options: IProcessorOptions<E, S, T>, entityId: string);
    prepareContext: () => Promise<void>;
    storeContext: () => Promise<void>;
    processCommand: (command: string) => Promise<string | null>;
    truncate(): Promise<void>;
    private castEntityImplicit;
}
