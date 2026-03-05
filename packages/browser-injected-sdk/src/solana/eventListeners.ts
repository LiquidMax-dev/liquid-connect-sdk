import type { LiquidEventType } from "./types";

export type ConnectCallback = (publicKey: string) => void;
export type DisconnectCallback = () => void;
export type AccountChangedCallback = (publicKey: string | null) => void;

export type LiquidEventCallback = ConnectCallback | DisconnectCallback | AccountChangedCallback;

const eventCallbacks = new Map<LiquidEventType, Set<LiquidEventCallback>>();

export function addEventListener(event: LiquidEventType, callback: LiquidEventCallback): () => void {
  if (!eventCallbacks.has(event)) {
    eventCallbacks.set(event, new Set());
  }
  eventCallbacks.get(event)?.add(callback);
  return () => {
    removeEventListener(event, callback);
  };
}

export function removeEventListener(event: LiquidEventType, callback: LiquidEventCallback): void {
  if (eventCallbacks.has(event)) {
    eventCallbacks.get(event)?.delete(callback);
    if (eventCallbacks.get(event)?.size === 0) {
      eventCallbacks.delete(event);
    }
  }
}

export function triggerEvent(event: "connect", publicKey: string): void;
export function triggerEvent(event: "disconnect"): void;
export function triggerEvent(event: "accountChanged", publicKey: string | null): void;
export function triggerEvent(event: LiquidEventType, ...args: any[]): void {
  if (eventCallbacks.has(event)) {
    eventCallbacks.get(event)?.forEach(cb => {
      try {
        (cb as (...args: any[]) => void)(...args);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }
}

export function clearAllEventListeners(): void {
  eventCallbacks.clear();
}
