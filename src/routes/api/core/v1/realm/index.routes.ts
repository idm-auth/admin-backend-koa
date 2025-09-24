import Router from '@koa/router';
import { initialize as user } from './users/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(user().routes());

  return router;
};
