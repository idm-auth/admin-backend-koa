import { beforeAll } from 'vitest';
import { koa } from '@/plugins/koaServer.plugin';

beforeAll(async () => {
  // Só inicializa o Koa para testes de integração
  if (
    process.env.VITEST_POOL_ID?.includes('integration') ||
    globalThis.__vitest_worker__?.filepath?.includes('integration')
  ) {
    const app = await koa.initialize();
    globalThis.testKoaApp = app;
  }
});
