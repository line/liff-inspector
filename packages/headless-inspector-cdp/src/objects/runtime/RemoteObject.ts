import Protocol from 'devtools-protocol';
import { JSType } from '../../types';
import { ObjectPreview } from './ObjectPreview';

export class RemoteObject implements Protocol.Runtime.RemoteObject {
  type: JSType;
  subtype?: Protocol.Runtime.RemoteObject['subtype'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  description?: string;
  objectId?: string;
  className?: string;
  preview?: ObjectPreview;

  constructor(value: unknown, objectId?: string) {
    switch (typeof value) {
      case 'string': {
        this.type = 'string';
        this.value = value;
        break;
      }
      case 'number': {
        this.type = 'number';
        this.value = value;
        this.description = `${value}`;
        break;
      }
      case 'boolean': {
        this.type = 'boolean';
        this.value = value;
        break;
      }
      case 'undefined': {
        this.type = 'undefined';
        this.value = value;
        break;
      }
      case 'bigint': {
        this.type = 'bigint';
        this.value = value.toString();
        this.description = value.toString();
        break;
      }
      case 'symbol': {
        if (!objectId) {
          throw new Error(
            `${value.toString()} should have objectId in RemoteObject`
          );
        }
        this.type = 'symbol';
        this.value = value.toString();
        this.objectId = objectId;
        break;
      }
      case 'function': {
        if (!objectId) {
          throw new Error(
            `${value.toString()} should have objectId in RemoteObject`
          );
        }
        this.type = 'function';
        this.description = value.toString();
        this.objectId = objectId;
        this.className = 'Function';
        break;
      }
      case 'object': {
        this.type = 'object';
        // NULL
        if (value === null) {
          this.subtype = 'null';
          this.value = null;
          break;
        }
        if (!objectId) {
          throw new Error(
            `${JSON.stringify(value)} should have objectId in RemoteObject`
          );
        }
        // Array
        if (Array.isArray(value)) {
          this.objectId = objectId;
          this.className = 'Array';
          this.description = `Array(${value.length})`;
          this.subtype = 'array';
          this.preview = new ObjectPreview(value, true);
          break;
        }
        // Object
        this.objectId = objectId;
        this.className = 'Object';
        this.description = 'Object';
        this.preview = new ObjectPreview(value, false); // TODO: What is overflow?
        break;
      }
      default:
        throw new Error(`Unknown type: ${value} ${typeof value}`);
    }
  }
}
