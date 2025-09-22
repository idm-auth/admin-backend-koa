import Router from '@koa/router';
import user from './users/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(user.initialize().routes());

  return router;
};

export default { initialize };
