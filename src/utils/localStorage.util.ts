// src/utils/localStorage.util.ts
import { AsyncLocalStorage } from 'async_hooks';
import type { Logger } from 'pino';

interface RequestContext {
  requestId: string;
  logger: Logger | null;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const runWithContext = (
  context: RequestContext,
  callback: () => Promise<void>
) => {
  return asyncLocalStorage.run(context, callback);
};

export const getLogger = (): Logger | Console => {
  return asyncLocalStorage.getStore()?.logger ?? console;
};

export const getRequestId = (): string => {
  return asyncLocalStorage.getStore()?.requestId ?? 'unknown';
};
