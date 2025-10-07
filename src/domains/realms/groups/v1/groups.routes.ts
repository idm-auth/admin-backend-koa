import Router from '@koa/router';
import * as groups from '@/domains/realms/groups/latest/groups.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const groupsRouter = await groups.initialize();
  router.use(groupsRouter.routes());

  return router;
};