import { EntityStateHolder, StateMap } from "../entity";

export type RouteMap<R> = { [K in keyof R]: R[K] };

export type Route<R extends RouteMap<R>, K extends keyof R> = {
  regex: RegExp;
  parse: (args: string[]) => R[K];
};

export type Routes<R extends RouteMap<R>> = {
  [K in keyof R]: Route<R, K>;
};

export type Handler<
  E,
  S extends StateMap<S>,
  T,
  R extends RouteMap<R>,
  K extends keyof R
> = (
  args: { context: EntityStateHolder<E, S, T> } & R[K]
) => string | Promise<string>;

export type Handlers<E, S extends StateMap<S>, T, R extends RouteMap<R>> = {
  [K in keyof R]: Handler<E, S, T, R, K>;
};

export type StateRoutes<S extends StateMap<S>> = {
  [V in keyof S]: Routes<any>;
};

export type StateHandlers<E, S extends StateMap<S>, T> = {
  [V in keyof S]: Handlers<E, S, T, any>;
};

export type RouteHandler<E, S extends StateMap<S>, T> = Route<any, any> & {
  handler: Handler<E, S, T, any, any>;
};

export type StateRouteHandlers<E, S extends StateMap<S>, T> = {
  [V in keyof S]: Array<RouteHandler<E, S, T>>;
};

export const lookupHandler = <
  E,
  S extends StateMap<S>,
  T,
  R extends RouteMap<R>
>(
  routeHandlers: Array<RouteHandler<E, S, T>>,
  command: string
) => {
  for (const { regex, parse, handler } of routeHandlers) {
    const match = command.match(regex);
    if (!!match) {
      const args = parse(match.slice(1));
      return (context: EntityStateHolder<E, S, T>) =>
        handler({ context, ...args });
    }
  }
  return null;
};
