import Router from '@koa/router';
import { initialize as config } from './config/index.routes';
import { initialize as auth } from './auth/index.routes';
import { initialize as core } from './core/index.routes';
import { initialize as swaggerPoc } from './swagger-poc/index.routes';

const initialize = async () => {
  const router = new Router({
    prefix: '/api',
  });
  const configRouter = await config();
  const authRouter = await auth();
  const coreRouter = await core();
  const swaggerPocRouter = await swaggerPoc();
  
  router.use(configRouter.routes());
  router.use(authRouter.routes());
  router.use(coreRouter.routes());
  router.use('/swagger-poc', swaggerPocRouter.routes());

  return router;
};

export default { initialize };
