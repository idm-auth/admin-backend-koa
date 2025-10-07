import Router from '@koa/router';
import * as latestRoutes from '@/domains/realms/group-roles/latest/group-roles.routes';

export const initialize = async () => {
  const router = new Router({ prefix: '/v1' });
  const latestRouter = await latestRoutes.initialize();
  
  router.use(latestRouter.routes());
  
  return router;
};