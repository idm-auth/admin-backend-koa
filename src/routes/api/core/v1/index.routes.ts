import Router from '@koa/router';
import user from './realm/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/v1',
  });
  router.use(user.initialize().routes());

  return router;
};

export default { initialize };
