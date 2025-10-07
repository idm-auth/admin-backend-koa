import Router from '@koa/router';
import * as roles from '@/domains/realms/roles/latest/roles.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const rolesRouter = await roles.initialize();
  router.use(rolesRouter.routes());

  return router;
};