// config.routes.ts

import Router from '@koa/router';
import * as configController from '@/domains/config/v1/config.controller';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  router.get('/app/:appName/env/:env', configController.getConfig);

  return router;
};
