type HandlerFoAllEvents<EventValueMap extends Record<string, unknown>> = <
  Key extends keyof EventValueMap
>(
  key: Key,
  value: EventValueMap[Key]
) => void;

export type EvEmitter<EventValueMap extends Record<string, unknown>> = {
  on: <Key extends keyof EventValueMap>(
    key: Key,
    handler: (v: EventValueMap[Key]) => void
  ) => void;
  onAll: (handlerForAllEvents: HandlerFoAllEvents<EventValueMap>) => void;
  emit: <Key extends keyof EventValueMap>(
    key: Key,
    value: EventValueMap[Key]
  ) => void;
};

export const evemitter = <
  EventValueMap extends Record<string, unknown>
>(): EvEmitter<EventValueMap> => {
  let preventInfiniteEmit = false;
  let _handlerForAllEvents: HandlerFoAllEvents<EventValueMap> | null = null;
  const map = new Map();

  return {
    on: (key, handler) => {
      map.set(key, handler);
    },
    onAll: (handlerForAllEvents) => {
      _handlerForAllEvents = handlerForAllEvents;
    },
    emit: (key, value) => {
      if (preventInfiniteEmit) return;
      preventInfiniteEmit = true;
      const h = map.get(key);
      if (h) {
        h(value);
      }
      if (_handlerForAllEvents) {
        _handlerForAllEvents(key, value);
      }
      preventInfiniteEmit = false;
    },
  };
};
