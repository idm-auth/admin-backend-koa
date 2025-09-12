import { AsyncLocalStorage } from 'async_hooks';

interface ContextData {
  requestId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<ContextData>();

export const getRequestId = () => {
  const store = asyncLocalStorage.getStore();
  return store?.requestId;
};
