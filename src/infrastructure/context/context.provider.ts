import { AsyncLocalStorage } from "async_hooks";
import type { Logger } from "pino";

export interface ContextData {
  requestId: string;
  logger: Logger | null;
}

export const asyncLocalStorage = new AsyncLocalStorage<ContextData>();
