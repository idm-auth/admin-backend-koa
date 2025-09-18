import Router from '@koa/router';
import v1 from './v1/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/auth',
  });
  router.use(v1.initialize().routes());

  return router;
};

export default { initialize };
