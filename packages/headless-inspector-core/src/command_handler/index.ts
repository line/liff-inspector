import { HICommands } from '../types';

export const commandHandler = <Key extends keyof HICommands>(
  command: Key,
  params: HICommands[Key]['paramsType']
): HICommands[Key]['returnType'] => {
  if (command === 'getRootNode') {
    return window.document.getRootNode();
  }
  throw new Error(`Unsupported command ${command}`);
};
