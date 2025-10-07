import Router from '@koa/router';
import { initialize as v1 } from './v1/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/auth',
  });
  const v1Router = await v1();
  router.use(v1Router.routes());

  return router;
};
