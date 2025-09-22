import Router from '@koa/router';
import login from './login/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(login.initialize().routes());

  return router;
};

export default { initialize };
