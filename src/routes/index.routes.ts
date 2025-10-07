// index.routes.ts
import Router from '@koa/router';

import api from './api/index.routes';

export const initialize = async () => {
  const router = new Router();

  const apiRouter = await api.initialize();
  router.use(apiRouter.routes());

  router.get('/', async (ctx) => {
    ctx.body = 'Hello from Koa server!';
  });

  return router;
};
