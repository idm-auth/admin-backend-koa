// index.routes.ts
import Router from '@koa/router';

import api from './api/index.routes';

const initialize = () => {
  const router = new Router();

  router.use(api.initialize().routes());

  router.get('/', async (ctx) => {
    ctx.body = 'Hello from Koa server!';
  });

  return router;
};

export default { initialize };
