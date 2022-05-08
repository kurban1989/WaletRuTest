export interface EventBusI extends EventTarget {
  uid(): string;
  on(type: string, func: (arg: any) => void, uid: string): void;
  emit(type: string, payload: any): void;
  destroy(uid: string): void;
}

export interface SDKI {
  get(symbol: string): Promise<any>;
  subscribe(symbol: string): WebSocket;
}
