import { EvEmitter } from './evemitter';

export type ConsoleType = Exclude<keyof Console, 'Console'>;

export type NetworkRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
type NetworkResponse = {
  url: string;
  rawData: TODO;
  text: string;
  status: string;
  statusCode: number;
  headers: Record<string, string>;
};

interface DebugEvent {
  timestamp: number;
}

interface ConsoleApiHasBeenCalledEvent extends DebugEvent {
  argumentsList: unknown[];
  type: ConsoleType;
}

interface NetworkRequestHasBeenMade extends DebugEvent {
  type: 'xhr' | 'fetch';
  requestId: string;
  request: NetworkRequest;
}

interface NetworkRequestHasSucceeded extends DebugEvent {
  type: 'xhr' | 'fetch';
  requestId: string;
  response: NetworkResponse;
}

export type DebugEventMap = {
  consoleAPIHasBeenCalled: ConsoleApiHasBeenCalledEvent;
  networkRequestHasBeenMade: NetworkRequestHasBeenMade;
  networkRequestHasSucceeded: NetworkRequestHasSucceeded;
};

export type InspectorEventEmitter = EvEmitter<DebugEventMap>;

export type HICommands = {
  getRootNode: {
    paramsType: undefined;
    returnType: Node;
  };
};
