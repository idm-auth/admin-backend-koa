import Router from '@koa/router';
import config from './config/index.routes';
import auth from './auth/index.routes';
import core from './core/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/api',
  });
  router.use(config.initialize().routes());
  router.use(auth.initialize().routes());
  router.use(core.initialize().routes());

  return router;
};

export default { initialize };
