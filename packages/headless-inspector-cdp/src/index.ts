import {
  evemitter,
  EvEmitter,
  HeadlessInspector,
  Inspector,
} from '@line/headless-inspector-core';
import { attachDOMEvents } from './events/dom';
import { attachNetworkEvents } from './events/network';
import { attachRuntimeEvents } from './events/runtime';
import { CdpEvents, CdpCommands } from './types';

export class HeadlessInspectorCdp implements Inspector<CdpEvents, CdpCommands> {
  private enabled = false;
  private eventEmitter: EvEmitter<CdpEvents>;
  private commandHandlerMap: Map<
    keyof CdpCommands,
    (
      params: CdpCommands[keyof CdpCommands]['paramsType']
    ) => void | CdpCommands[keyof CdpCommands]['returnType']
  >;
  private inspector: HeadlessInspector;

  constructor() {
    this.inspector = new HeadlessInspector();
    this.commandHandlerMap = new Map();
    this.eventEmitter = evemitter();
  }

  on<Key extends keyof CdpEvents>(
    event: Key,
    listener: (params: CdpEvents[Key]) => void
  ): void {
    this.eventEmitter.on(event, listener);
  }

  onAll(
    listener: <Key extends keyof CdpEvents>(
      key: Key,
      value: CdpEvents[Key]
    ) => void
  ): void {
    this.eventEmitter.onAll(listener);
    return;
  }

  send<Key extends keyof CdpCommands>(
    command: Key,
    params: CdpCommands[Key]['paramsType']
  ): CdpCommands[Key]['returnType'] | undefined {
    const handler = this.commandHandlerMap.get(command);
    if (!handler) return undefined;
    const res = handler(params);
    return res;
  }

  private setCommandHandler = <Key extends keyof CdpCommands>(
    command: Key,
    handler: (
      params: CdpCommands[Key]['paramsType']
    ) => void | CdpCommands[Key]['returnType']
  ) => {
    this.commandHandlerMap.set(command, handler as any); // FIXME
  };

  enable() {
    if (this.enabled) return;
    this.enabled = true;
    this.inspector.enable();
    attachRuntimeEvents(
      this.inspector,
      this.eventEmitter,
      this.setCommandHandler
    );
    attachNetworkEvents(
      this.inspector,
      this.eventEmitter,
      this.setCommandHandler
    );
    attachDOMEvents(this.inspector, this.eventEmitter, this.setCommandHandler);
  }

  disable() {
    // TODO
  }
}

export default HeadlessInspectorCdp;
