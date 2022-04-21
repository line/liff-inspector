import HeadlessInspector, { EvEmitter } from '@line/headless-inspector-core';
import ProtocolMapping from 'devtools-protocol/types/protocol-mapping';

// https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-typeof-operator
export type JSType =
  | 'object'
  | 'function'
  | 'undefined'
  | 'string'
  | 'number'
  | 'boolean'
  | 'symbol'
  | 'bigint';

type UnrapArray<T extends unknown[]> = T extends (infer U)[] ? U : never;

export type CdpEvents = {
  [key in keyof ProtocolMapping.Events]: UnrapArray<
    ProtocolMapping.Events[key]
  >;
};
export type CdpCommands = {
  [key in keyof ProtocolMapping.Commands]: {
    paramsType: UnrapArray<ProtocolMapping.Commands[key]['paramsType']>;
    returnType: ProtocolMapping.Commands[key]['returnType'];
  };
};

export type CdpConverter = (
  inspector: HeadlessInspector,
  eventEmitter: EvEmitter<CdpEvents>,
  setCommandHandler: <Key extends keyof CdpCommands>(
    command: Key,
    handler: (
      params: CdpCommands[Key]['paramsType']
    ) => void | CdpCommands[Key]['returnType']
  ) => void
) => void;
