// config.routes.ts

import Router from '@koa/router';
import configController from '@/controllers/v1/config.controller';

const initialize = () => {
  const router = new Router({
    prefix: '/v1',
  });
  router.get('/app/:appName/env/:env', configController.getConfig);
  return router;
};

export default { initialize };
