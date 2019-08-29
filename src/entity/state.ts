export type StateMap<M> = { [K in keyof M]: M[K] };

export interface IState<M extends StateMap<M>> {
  name: keyof M;
  payload: M[keyof M];
}

export class EntityStateHolder<E, M extends StateMap<M>, T> {
  constructor(
    private currentEntity: E,
    private currentState: IState<M>,
    private readonly transform: (entity: E) => T
  ) {}

  public update(entity: E) {
    this.currentEntity = entity;
  }

  public transit<K extends keyof M>(name: K, payload: M[K]) {
    this.currentState = {
      name,
      payload
    };
  }

  public ensureState<K extends keyof M>(name: K): M[K] | undefined {
    if (this.currentState.name === name) {
      return this.currentState.payload as M[K];
    }
    return undefined;
  }

  public get state() {
    return this.currentState;
  }

  public get entity() {
    return this.currentEntity;
  }

  public get t() {
    return this.transform(this.currentEntity);
  }
}
