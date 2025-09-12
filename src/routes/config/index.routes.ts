// index.routes.ts
import Router from '@koa/router';
import v1 from './v1.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/config',
  });
  router.use(v1.initialize().routes());

  return router;
};

export default { initialize };
