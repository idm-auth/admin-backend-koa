import Router from '@koa/router';
import * as login from './login/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  const loginRouter = await login.initialize();
  router.use(loginRouter.routes());

  return router;
};
