// src/utils/localStorage.util.ts
import type { Logger } from 'pino';
import { getLogger as pinoLogger } from '@/plugins/pino.plugin';
import {
  asyncLocalStorage,
  type ContextData,
} from '@/plugins/asyncLocalStorage.plugin';

export const runWithContext = (
  context: ContextData,
  callback: () => Promise<void>
) => {
  return asyncLocalStorage.run(context, callback);
};

export const getLogger = async (): Promise<Logger> => {
  const contextLogger = asyncLocalStorage.getStore()?.logger;
  if (contextLogger) return contextLogger;

  // Fallback para o logger configurado do plugin
  return await pinoLogger();
};

export const getRequestId = (): string => {
  return asyncLocalStorage.getStore()?.requestId ?? 'unknown';
};
