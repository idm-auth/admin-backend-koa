import Router from '@koa/router';
import * as auth from './auth/index.routes';
import * as config from './config/index.routes';
import * as core from './core/index.routes';
import * as realm from './realm/index.routes';
import * as swaggerPoc from './swagger-poc/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/api',
  });
  const configRouter = await config.initialize();
  const authRouter = await auth.initialize();
  const coreRouter = await core.initialize();
  const realmRouter = await realm.initialize();
  const swaggerPocRouter = await swaggerPoc.initialize();

  router.use(configRouter.routes());
  router.use(authRouter.routes());
  router.use(coreRouter.routes());
  router.use(realmRouter.routes());

  router.use('/swagger-poc', swaggerPocRouter.routes());

  return router;
};

export default { initialize };
