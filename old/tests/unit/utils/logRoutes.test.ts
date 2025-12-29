import { describe, expect, it } from 'vitest';
import Router from '@koa/router';
import { logRoutes } from '@/utils/routeLogger.util';

describe('routeLogger.util logRoutes', () => {
  it('should log routes without errors', async () => {
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.body = 'test';
    });
    router.post('/create', (ctx) => {
      ctx.body = 'created';
    });

    await expect(logRoutes(router, '/api')).resolves.not.toThrow();
  });

  it('should log routes without prefix', async () => {
    const router = new Router();
    router.get('/simple', (ctx) => {
      ctx.body = 'simple';
    });

    await expect(logRoutes(router)).resolves.not.toThrow();
  });
});
