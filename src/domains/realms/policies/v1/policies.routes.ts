import Router from '@koa/router';
import * as policies from '@/domains/realms/policies/latest/policies.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const policiesRouter = await policies.initialize();
  router.use(policiesRouter.routes());

  return router;
};