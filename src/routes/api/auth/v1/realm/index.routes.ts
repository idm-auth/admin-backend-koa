import Router from '@koa/router';
import { initialize as login } from './login/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(login().routes());

  return router;
};
