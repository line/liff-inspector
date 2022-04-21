export class Store<TId, TValue> {
  private idToValue: Map<TId, TValue> = new Map();
  private valueToId: Map<TValue, TId> = new Map();

  store(id: TId, value: TValue): void {
    this.idToValue.set(id, value);
    this.valueToId.set(value, id);
  }

  getById(id: TId): TValue | undefined {
    return this.idToValue.get(id);
  }

  getByValue(value: TValue): TId | undefined {
    return this.valueToId.get(value);
  }
}
