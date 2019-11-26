import { EntityStateHolder, StateMap } from "../entity";
import { CommandProcessor, IProcessorOptions } from "./processor";
import { Handlers, RouteMap, Routes, StateHandlers, StateRouteHandlers, StateRoutes } from "./router";
declare type VerifyKindaPartial<T, KP> = Partial<T> & {
    [K in keyof KP]-?: K extends keyof T ? T[K] : never;
};
declare class Toolkit<E, S extends StateMap<S>, T> {
    options(options: IProcessorOptions<E, S, T>): IProcessorOptions<E, S, T>;
    newProcessorBuilder(options: IProcessorOptions<E, S, T>): (entityId: string) => CommandProcessor<E, S, T>;
    newReplierGenerator(options: IProcessorOptions<E, S, T>): (id: string) => (item: import("../actor").ICommandRequest, timeoutMillis?: number) => Promise<boolean>;
    routes<R extends RouteMap<R>>(routes: Routes<R>): Routes<R>;
    partialStateRoutes<KP>(routes: KP & VerifyKindaPartial<StateRoutes<S>, KP>): KP;
    stateRoutes(routes: StateRoutes<S>): StateRoutes<S>;
    handlers<R extends RouteMap<R>>(handlers: Handlers<E, S, T, R>): Handlers<E, S, T, R>;
    partialStateHandlers<KP>(handlers: KP & VerifyKindaPartial<StateHandlers<E, S, T>, KP>): KP;
    stateHandlers(handlers: StateHandlers<E, S, T>): StateHandlers<E, S, T>;
    routeHandlers<G extends {
        [K in keyof G]: G[K];
    }>(mapOfRoutes: {
        [K in keyof G]: Partial<StateRoutes<S>>;
    }, mapOfHandlers: {
        [K in keyof G]: Partial<StateHandlers<E, S, T>>;
    }): StateRouteHandlers<E, S, T>;
    typeOfContext(): EntityStateHolder<E, S, T>;
}
export declare const toolkit: <E, S extends StateMap<S>, T = E>() => Toolkit<E, S, T>;
export {};
