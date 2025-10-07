import Router from '@koa/router';
import * as realm from './realm/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });

  const realmRouter = await realm.initialize();
  router.use(realmRouter.routes());

  return router;
};
