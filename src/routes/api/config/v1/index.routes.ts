// config.routes.ts

import Router from '@koa/router';
import * as configController from '@/controllers/v1/config.controller';

export const initialize = async () => {
  const router = new Router();
  router.get('/init-setup', configController.getInitSetup);

  const routerV1 = new Router({
    prefix: '/v1',
  });
  routerV1.get('/app/:appName/env/:env', configController.getConfig);

  router.use(routerV1.routes());
  return router;
};
