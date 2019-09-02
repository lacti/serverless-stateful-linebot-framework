export declare type StateMap<M> = {
    [K in keyof M]: M[K];
};
export interface IState<M extends StateMap<M>> {
    name: keyof M;
    payload: M[keyof M];
}
export declare class EntityStateHolder<E, M extends StateMap<M>, T> {
    readonly entityId: string;
    private currentEntity;
    private currentState;
    private readonly transform;
    constructor(entityId: string, currentEntity: E, currentState: IState<M>, transform: (entity: E) => T);
    update(entity: E): void;
    transit<K extends keyof M>(name: K, payload: M[K]): void;
    ensureState<K extends keyof M>(name: K): M[K] | undefined;
    readonly state: IState<M>;
    readonly entity: E;
    readonly t: T;
}
