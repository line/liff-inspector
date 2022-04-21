import Protocol from 'devtools-protocol';
import { ObjectLike } from '../../store/ObjectStore';
import { isObject } from '../../utils';
import { RemoteObject } from './RemoteObject';

export type CDPConsoleType = Protocol.Runtime.ConsoleAPICalledEvent['type'];

type Arguments = {
  type: CDPConsoleType;
  argumentsList: unknown[];
  timestamp: number;
};

export class ConsoleAPICalledEvent
  implements Protocol.Runtime.ConsoleAPICalledEvent
{
  type: CDPConsoleType;
  timestamp: number;
  executionContextId: number;
  args: RemoteObject[] = [];

  constructor(
    { type, argumentsList, timestamp }: Arguments,
    executionContextId: number,
    getObjectId: (v: ObjectLike) => string | undefined
  ) {
    this.type = type;
    this.timestamp = timestamp;
    this.executionContextId = executionContextId;
    argumentsList.forEach((value) => {
      const objectId = isObject(value) ? getObjectId(value) : undefined;
      this.args.push(new RemoteObject(value, objectId));
    });
  }
}
