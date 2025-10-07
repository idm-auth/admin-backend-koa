import Router from '@koa/router';

import * as config from '@/domains/config/config.routes';

import * as realms from '@/domains/realms/realms.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/api',
  });
  const configRouter = await config.initialize();

  const realmsRouter = await realms.initialize();

  router.use(configRouter.routes());

  router.use(realmsRouter.routes());

  return router;
};

export default { initialize };
