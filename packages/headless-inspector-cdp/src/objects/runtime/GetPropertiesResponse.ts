import Protocol from 'devtools-protocol';
import { ObjectLike } from '../../store/ObjectStore';
import { isObject } from '../../utils';
import { PropertyDescriptor } from './PropertyDescriptor';

export class GetPropertiesResponse
  implements Protocol.Runtime.GetPropertiesResponse
{
  result: PropertyDescriptor[];

  constructor(
    object: ObjectLike,
    getObjectId: (v: ObjectLike) => string | undefined
  ) {
    this.result = Object.entries(object).map(([key, o]) => {
      const objectId = isObject(o) ? getObjectId(o) : undefined;
      const disc = Object.getOwnPropertyDescriptor(object, key);
      if (!disc) {
        throw new Error(`PropertyDescriptor of ${o} is missing`);
      }
      return new PropertyDescriptor(o, objectId, {
        name: key,
        enumerable: disc.enumerable ?? true,
        configurable: disc.configurable ?? true,
        writable: disc.writable,
      });
    });
  }
}
