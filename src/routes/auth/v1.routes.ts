import Router from '@koa/router';
import authController from '@/controllers/v1/auth.controller';

const initialize = () => {
  const router = new Router({
    prefix: '/v1',
  });

  router.post('/login', authController.login);

  return router;
};

export default { initialize };
