import Router from '@koa/router';
import * as accounts from '@/domains/realms/accounts/latest/accounts.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const accountsRouter = await accounts.initialize();
  router.use(accountsRouter.routes());

  return router;
};
