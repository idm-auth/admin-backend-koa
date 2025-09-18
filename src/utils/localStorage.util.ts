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

export const getLogger = (): Logger => {
  const contextLogger = asyncLocalStorage.getStore()?.logger;
  if (contextLogger) return contextLogger;
  
  // Fallback para logger Pino quando não há contexto
  const pino = require('pino');
  return pino({ level: 'debug' });
};

export const getRequestId = (): string => {
  return asyncLocalStorage.getStore()?.requestId ?? 'unknown';
};
