import Router from '@koa/router';
import * as accountGroups from '@/domains/realms/account-groups/latest/account-groups.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const accountGroupsRouter = await accountGroups.initialize();
  router.use(accountGroupsRouter.routes());

  return router;
};