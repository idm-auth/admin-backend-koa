// index.routes.ts
import Router from '@koa/router';
import { initialize as v1 } from './v1/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/config',
  });
  router.use(v1().routes());

  return router;
};
