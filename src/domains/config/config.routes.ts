// index.routes.ts
import * as configController from '@/domains/config/v1/config.controller';
import Router from '@koa/router';
import * as v1 from './v1/config.routes';
export const initialize = async () => {
  const router = new Router({
    prefix: '/config',
  });
  router.get('/init-setup', configController.getInitSetup);
  const v1Router = await v1.initialize();
  router.use(v1Router.routes());

  return router;
};
