import Router from '@koa/router';
import { initialize as config } from './config/index.routes';
import { initialize as auth } from './auth/index.routes';
import { initialize as core } from './core/index.routes';
import { initialize as swaggerPoc } from './swagger-poc/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/api',
  });
  router.use(config().routes());
  router.use(auth().routes());
  router.use(core().routes());
  router.use('/swagger-poc', swaggerPoc().routes());

  return router;
};

export default { initialize };
