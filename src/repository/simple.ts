import { Repository } from "@yingyeothon/repository";
import { newInternalRepository } from "./builder";

interface ISimpleGetSetRepositoryOptions {
  prefix?: string;
  id: string;
}

export class SimpleGetSetRepository<T> {
  private readonly id: string;
  private readonly internal: Repository;

  constructor({ prefix, id }: ISimpleGetSetRepositoryOptions) {
    this.id = id;
    this.internal = newInternalRepository(prefix || "");
  }

  public async get() {
    return this.internal.get<T>(this.id);
  }

  public async set(value: T) {
    return this.internal.set<T>(this.id, value);
  }

  public async delete() {
    return this.internal.delete(this.id);
  }
}
