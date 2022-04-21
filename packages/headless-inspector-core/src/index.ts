import { commandHandler } from './command_handler';
import { evemitter } from './evemitter';
import { interceptConsole, interceptNetwork } from './interceptors';
import { DebugEventMap, HICommands, InspectorEventEmitter } from './types';

export * from './evemitter';
export * from './interceptors';
export * from './types';

export interface Inspector<
  Events extends Record<string, unknown>,
  Commands extends Record<string, { paramsType: unknown; returnType: unknown }>
> {
  on<Key extends keyof Events>(
    event: Key,
    listener: (v: Events[Key]) => void
  ): void;
  onAll(
    listener: <Key extends keyof Events>(key: Key, value: Events[Key]) => void
  ): void;
  send<Key extends keyof Commands>(
    command: Key,
    params: Commands[Key]['paramsType']
  ): Commands[Key]['returnType'] | undefined;
  enable(): void;
  disable(): void;
}

export class HeadlessInspector implements Inspector<DebugEventMap, HICommands> {
  private debugEventEmitter: InspectorEventEmitter;
  private isEnabled = false;
  constructor() {
    this.debugEventEmitter = evemitter<DebugEventMap>();
  }

  on<Key extends keyof DebugEventMap>(
    event: Key,
    listener: (v: DebugEventMap[Key]) => void
  ): void {
    return this.debugEventEmitter.on(event, listener);
  }

  onAll(
    listener: <Key extends keyof DebugEventMap>(
      key: Key,
      value: DebugEventMap[Key]
    ) => void
  ): void {
    this.debugEventEmitter.onAll(listener);
    return;
  }

  send<Key extends keyof HICommands>(
    command: Key,
    params: HICommands[Key]['paramsType']
  ): HICommands[Key]['returnType'] {
    return commandHandler(command, params);
  }

  enable() {
    if (this.isEnabled) return;
    this.isEnabled = true;
    interceptConsole(this.debugEventEmitter);
    interceptNetwork(this.debugEventEmitter);
  }

  disable() {
    // TODO
  }
}

export default HeadlessInspector;
