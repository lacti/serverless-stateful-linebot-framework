import { CommandProcessor, IProcessorOptions } from "./processor";
import { EntityStateHolder, StateMap } from "../entity";
import {
  Handlers,
  RouteMap,
  Routes,
  StateHandlers,
  StateRouteHandlers,
  StateRoutes,
} from "./router";

import { newBasicReplier } from "../actor";

// https://stackoverflow.com/a/54497408
type VerifyKindaPartial<T, KP> = Partial<T> & {
  [K in keyof KP]-?: K extends keyof T ? T[K] : never;
};

class Toolkit<E, S extends StateMap<S>, T> {
  public options(options: IProcessorOptions<E, S, T>) {
    return options;
  }

  public newProcessorBuilder(options: IProcessorOptions<E, S, T>) {
    return (entityId: string) =>
      new CommandProcessor<E, S, T>(options, entityId);
  }

  public newReplierGenerator(options: IProcessorOptions<E, S, T>) {
    return newBasicReplier<E, S, T>(this.newProcessorBuilder(options));
  }

  public routes<R extends RouteMap<R>>(routes: Routes<R>): Routes<R> {
    return routes;
  }

  public partialStateRoutes<KP>(
    routes: KP & VerifyKindaPartial<StateRoutes<S>, KP>
  ): KP {
    return routes;
  }

  public stateRoutes(routes: StateRoutes<S>): StateRoutes<S> {
    return routes;
  }

  public handlers<R extends RouteMap<R>>(
    handlers: Handlers<E, S, T, R>
  ): Handlers<E, S, T, R> {
    return handlers;
  }

  public partialStateHandlers<KP>(
    handlers: KP & VerifyKindaPartial<StateHandlers<E, S, T>, KP>
  ): KP {
    return handlers;
  }

  public stateHandlers(
    handlers: StateHandlers<E, S, T>
  ): StateHandlers<E, S, T> {
    return handlers;
  }

  public routeHandlers<G extends { [K in keyof G]: G[K] }>(
    mapOfRoutes: { [K in keyof G]: Partial<StateRoutes<S>> },
    mapOfHandlers: { [K in keyof G]: Partial<StateHandlers<E, S, T>> }
  ): StateRouteHandlers<E, S, T> {
    const result: Partial<StateRouteHandlers<E, S, T>> = {};
    for (const groupKey of Object.keys(mapOfRoutes)) {
      const group = groupKey as keyof G;
      const stateRoutes: Partial<StateRoutes<S>> = mapOfRoutes[group];
      const stateHandlers: Partial<StateHandlers<E, S, T>> =
        mapOfHandlers[group];
      for (const stateKey of Object.keys(stateRoutes)) {
        const state = stateKey as keyof S;
        if (!result[state]) {
          result[state] = [];
        }
        const routes: Routes<any> = stateRoutes[state]!;
        const handlers: Handlers<E, S, T, any> = stateHandlers[state]!;
        for (const routeKey of Object.keys(routes)) {
          result[state]!.push({
            ...routes[routeKey],
            handler: handlers[routeKey],
          });
        }
      }
    }
    // TODO How can I ensure this?
    return result as StateRouteHandlers<E, S, T>;
  }

  public typeOfContext(): EntityStateHolder<E, S, T> {
    throw new Error("Please use for this via `ReturnType<typeof method>`");
  }
}

export const toolkit = <E, S extends StateMap<S>, T = E>() =>
  new Toolkit<E, S, T>();
