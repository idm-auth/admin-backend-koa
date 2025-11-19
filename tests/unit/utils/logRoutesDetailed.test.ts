import { describe, expect, it } from 'vitest';
import Router from '@koa/router';
import { logRoutesDetailed } from '@/utils/routeLoggerDetailed.util';

describe('routeLoggerDetailed.util logRoutesDetailed', () => {
  it('should log detailed routes at level 0', async () => {
    const router = new Router();
    router.get('/test', (ctx) => { ctx.body = 'test'; });
    router.post('/create', (ctx) => { ctx.body = 'created'; });

    await expect(logRoutesDetailed(router, '/api', 0)).resolves.not.toThrow();
  });

  it('should log detailed routes at nested level', async () => {
    const router = new Router();
    router.get('/nested', (ctx) => { ctx.body = 'nested'; });

    await expect(logRoutesDetailed(router, '/api', 1)).resolves.not.toThrow();
  });

  it('should log routes without prefix', async () => {
    const router = new Router();
    router.get('/simple', (ctx) => { ctx.body = 'simple'; });

    await expect(logRoutesDetailed(router)).resolves.not.toThrow();
  });
});