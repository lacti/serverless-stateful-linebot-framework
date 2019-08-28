type ArrayKeySelector<T, E> = {
  [P in keyof T]-?: T[P] extends E[] ? P : never;
}[keyof T];

const filterByIndex = (index: number) => <T extends IWithIndex>(each: T) =>
  each.index === index;

export interface IWithIndex {
  index: number;
}

export class EntityElementExtension<
  C extends { [K in keyof C]: any },
  E extends IWithIndex
> {
  constructor(
    protected readonly entity: C,
    private readonly name: ArrayKeySelector<C, E>
  ) {}

  public get elements(): E[] {
    return this.entity[this.name] as E[];
  }

  public find(predicate: (each: E) => boolean) {
    return this.elements.find(predicate);
  }

  public filter(predicate: (each: E) => boolean) {
    return this.elements.filter(predicate);
  }

  public findByIndex(index: number) {
    return this.find(filterByIndex(index));
  }

  public add(fields: Omit<E, "index">) {
    const insertId = Math.max(...this.elements.map(each => each.index), 0) + 1;
    const newTuple = {
      ...fields,
      index: insertId
    } as E;
    this.elements.push(newTuple);
  }

  public update(index: number, fields: Partial<Omit<E, "index">>) {
    const arrayIndex = this.elements.findIndex(each => each.index === index);
    if (arrayIndex < 0) {
      return false;
    }
    this.elements[arrayIndex] = {
      ...this.elements[arrayIndex],
      ...fields
    };
    return true;
  }

  public remove(index: number) {
    this.removeWhere(filterByIndex(index));
  }

  public removeWhere(predicate: (each: E) => boolean) {
    (this.entity[this.name] as E[]) = this.elements.filter(
      each => !predicate(each)
    );
  }
}
