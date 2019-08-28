import { EntityStateHolder, StateMap } from "../entity";

export type StateRoute<M extends StateMap<M>> = {
  [V in keyof M]: Route<any>;
};

export type StateHandler<E, S extends StateMap<S>> = {
  [V in keyof S]: Handler<E, S, any>;
};

// https://stackoverflow.com/a/54497408
type VerifyKindaPartial<T, KP> = Partial<T> &
  { [K in keyof KP]-?: K extends keyof T ? T[K] : never };

export const partial = <E, S extends StateMap<S>>() => ({
  route: <KP>(routes: KP & VerifyKindaPartial<StateRoute<S>, KP>): KP => ({
    ...routes
  }),
  handler: <KP>(
    handlers: KP & VerifyKindaPartial<StateHandler<E, S>, KP>
  ): KP => ({
    ...handlers
  })
});

type RouteMap<R> = { [K in keyof R]: R[K] };

export type Route<R extends RouteMap<R>> = {
  [K in keyof R]: {
    regex: RegExp;
    parse: (args: string[]) => R[K];
  };
};

export type Handler<E, S extends StateMap<S>, R extends RouteMap<R>> = {
  [K in keyof R]: (
    args: { context: EntityStateHolder<E, S> } & R[K]
  ) => string | Promise<string>;
};

export const lookupHandler = <E, S extends StateMap<S>, R extends RouteMap<R>>(
  routes: Route<R>,
  handlers: Handler<E, S, R>,
  command: string
) => {
  for (const [key, route] of Object.entries(routes)) {
    const { regex, parse } = route as {
      regex: RegExp;
      parse: (Args: string[]) => any;
    };
    const match = command.match(regex);
    if (!!match) {
      const args = parse(match.slice(1));
      return (context: EntityStateHolder<E, S>) =>
        handlers[key as keyof R]({ context, ...args });
    }
  }
  return null;
};
