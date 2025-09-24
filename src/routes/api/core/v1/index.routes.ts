import Router from '@koa/router';
import { initialize as realm } from './realm/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/v1',
  });
  router.use(realm().routes());

  return router;
};
