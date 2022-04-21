import Protocol from 'devtools-protocol';
import { JSType } from '../../types';

export class PropertyPreview implements Protocol.Runtime.PropertyPreview {
  type: JSType;
  subtype: Protocol.Runtime.PropertyPreview['subtype'];
  name: string;
  value?: string;

  constructor(name: string, value: unknown) {
    this.name = name;
    switch (typeof value) {
      case 'string': {
        this.type = 'string';
        this.value = value;
        break;
      }
      case 'number': {
        this.type = 'number';
        this.value = `${value}`;
        break;
      }
      case 'boolean': {
        this.type = 'boolean';
        this.value = `${value}`;
        break;
      }
      case 'undefined': {
        this.type = 'undefined';
        this.value = `${value}`;
        break;
      }
      case 'bigint': {
        this.type = 'bigint';
        this.value = value.toString();
        break;
      }
      case 'symbol': {
        this.type = 'symbol';
        this.value = value.toString();
        break;
      }
      case 'function': {
        this.type = 'function';
        this.value = value.toString();
        break;
      }
      case 'object': {
        this.type = 'object';
        if (value === null) {
          this.value = 'null';
          break;
        }
        if (Array.isArray(value)) {
          this.value = `Array(${value.length})`;
          this.subtype = 'array';
          break;
        }
        this.value = 'Object';
        break;
      }
      default:
        throw new Error(`Unknown type: ${value} ${typeof value}`);
    }
  }
}
