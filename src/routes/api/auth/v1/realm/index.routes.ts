import Router from '@koa/router';
import { initialize as login } from './login/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  const loginRouter = await login();
  router.use(loginRouter.routes());

  return router;
};
