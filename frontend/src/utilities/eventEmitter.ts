type EventListener<T> = (data: T) => void;

class EventEmitter {
  private static eventListeners = new Map<string, EventListener<any>[]>();

  static onEvent<T>(eventName: string, listener: EventListener<T>) {
    const listeners = EventEmitter.eventListeners.get(eventName);
    if (!listeners) {
      EventEmitter.eventListeners.set(eventName, [listener]);
    } else {
      listeners.push(listener);
    }

    return listener;
  }

  static emitEvent<T>(eventName: string, data: T) {
    const listeners = EventEmitter.eventListeners.get(eventName);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  }

  static remove<T>(eventName: string, listenerToRemove: EventListener<T>) {
    const listeners = EventEmitter.eventListeners.get(eventName);
    const index = listeners?.findIndex(
      (listener) => listener === listenerToRemove,
    );

    if (index === undefined || index === -1) {
      return;
    }

    listeners?.splice(index, 1);
  }
}

export { EventEmitter };
