import Router from '@koa/router';
import * as auth from './auth/index.routes';
import * as config from './config/index.routes';
import * as core from './core/index.routes';
import * as realms from '@/domains/realms/realms.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/api',
  });
  const configRouter = await config.initialize();
  const authRouter = await auth.initialize();
  const coreRouter = await core.initialize();
  const realmsRouter = await realms.initialize();
  
  router.use(configRouter.routes());
  router.use(authRouter.routes());
  router.use(coreRouter.routes());
  router.use(realmsRouter.routes());

  return router;
};

export default { initialize };
