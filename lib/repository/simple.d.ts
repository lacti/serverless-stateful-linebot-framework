interface ISimpleGetSetRepositoryOptions {
    prefix?: string;
    id: string;
}
export declare class SimpleGetSetRepository<T> {
    private readonly id;
    private readonly internal;
    constructor({ prefix, id }: ISimpleGetSetRepositoryOptions);
    get(): Promise<T | undefined>;
    set(value: T): Promise<void>;
    delete(): Promise<void>;
}
export {};
