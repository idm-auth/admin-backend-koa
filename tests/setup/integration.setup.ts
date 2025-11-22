import { beforeAll } from 'vitest';
import { initKoa } from '@/plugins/koaServer.plugin';

beforeAll(async () => {
  const app = await initKoa();
  globalThis.testKoaApp = app;
});
