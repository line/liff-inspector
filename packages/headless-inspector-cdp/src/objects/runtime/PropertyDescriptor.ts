import Protocol from 'devtools-protocol';
import { RemoteObject } from './RemoteObject';

export class PropertyDescriptor implements Protocol.Runtime.PropertyDescriptor {
  value?: RemoteObject;
  name: string;
  enumerable: boolean;
  configurable: boolean;
  writable?: boolean;

  constructor(
    value: unknown,
    objectId: string | undefined,
    {
      name,
      enumerable,
      configurable,
      writable,
    }: Pick<
      Protocol.Runtime.PropertyDescriptor,
      'name' | 'enumerable' | 'configurable' | 'writable'
    >
  ) {
    this.value = new RemoteObject(value, objectId);
    this.name = name;
    this.enumerable = enumerable;
    this.configurable = configurable;
    this.writable = writable;
  }
}
