import Router from '@koa/router';
import { initialize as account } from './accounts/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(account().routes());

  return router;
};
