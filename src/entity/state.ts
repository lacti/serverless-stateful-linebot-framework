export type StateMap<M> = { [K in keyof M]: M[K] };

export interface IState<M extends StateMap<M>> {
  name: keyof M;
  payload: M[keyof M];
}

export class EntityStateHolder<E, M extends StateMap<M>> {
  constructor(private currentEntity: E, private currentState: IState<M>) {}

  public update(entity: E) {
    this.currentEntity = entity;
  }
  public transit<K extends keyof M>(name: K, payload: M[K]) {
    this.currentState = {
      name,
      payload
    };
  }

  public get state() {
    return this.currentState;
  }

  public get entity() {
    return this.currentEntity;
  }
}
