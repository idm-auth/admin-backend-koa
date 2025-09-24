import * as userController from '@/controllers/v1/user.controller';
import Router from '@koa/router';

export const initialize = () => {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/', userController.create);

  router.get('/:id', userController.findById);

  router.get('/search', userController.findByEmail);

  router.put('/:id', userController.update);

  router.delete('/:id', userController.remove);

  return router;
};
