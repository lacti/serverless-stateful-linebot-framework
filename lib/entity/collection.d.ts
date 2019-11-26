declare type ArrayKeySelector<T, E> = {
    [P in keyof T]-?: T[P] extends E[] ? P : never;
}[keyof T];
export interface IWithIndex {
    index: number;
}
export declare class EntityElementExtension<C extends {
    [K in keyof C]: any;
}, E extends IWithIndex> {
    protected readonly entity: C;
    private readonly name;
    constructor(entity: C, name: ArrayKeySelector<C, E>);
    get elements(): E[];
    find(predicate: (each: E) => boolean): E | undefined;
    filter(predicate: (each: E) => boolean): E[];
    findByIndex(index: number): E | undefined;
    add(fields: Omit<E, "index">): void;
    update(index: number, fields: Partial<Omit<E, "index">>): boolean;
    remove(index: number): void;
    removeWhere(predicate: (each: E) => boolean): void;
}
export {};
