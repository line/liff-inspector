import Protocol from 'devtools-protocol';
import { JSType } from '../../types';
import { PropertyPreview } from './PropertyPreview';

export class ObjectPreview implements Protocol.Runtime.ObjectPreview {
  type: JSType;
  subtype?: Protocol.Runtime.ObjectPreview['subtype'];
  description?: string;
  overflow = false;
  properties: PropertyPreview[] = [];

  constructor(value: unknown, overflow: boolean) {
    if (typeof value !== 'object' || value === null) {
      throw new Error(`ObjectPreview accepts object type only. given ${value}`);
    }

    this.type = 'object';
    this.overflow = overflow;

    if (Array.isArray(value)) {
      this.subtype = 'array';
      this.description = `Array(${value.length})`;
      this.properties = value.map((v, i) => new PropertyPreview(`${i}`, v));
    } else {
      this.description = `Object`;
      this.properties = Object.entries(value).map(
        ([key, v]) => new PropertyPreview(key, v)
      );
    }
  }
}
