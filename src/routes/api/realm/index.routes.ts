import Router from '@koa/router';
import * as v1 from './v1/index.routes';
export const initialize = async () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  const v1Router = await v1.initialize();

  router.use(v1Router.routes());

  return router;
};
