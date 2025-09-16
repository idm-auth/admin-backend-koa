// index.routes.ts
import Router from '@koa/router';
import config from './config/index.routes';

const initialize = () => {
  const router = new Router();
  router.use(config.initialize().routes());

  router.get('/', async (ctx) => {
    ctx.body = 'Hello from Koa server!';
  });

  return router;
};

export default { initialize };
