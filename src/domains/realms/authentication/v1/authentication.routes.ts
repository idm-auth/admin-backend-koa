import Router from '@koa/router';
import * as authentication from '@/domains/realms/authentication/latest/authentication.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const authenticationRouter = await authentication.initialize();
  router.use(authenticationRouter.routes());

  return router;
};