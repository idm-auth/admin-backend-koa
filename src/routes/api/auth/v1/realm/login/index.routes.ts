import Router from '@koa/router';
import * as authController from '@/controllers/v1/auth.controller';

export const initialize = () => {
  const router = new Router();

  router.post('/login', authController.login);

  return router;
};
