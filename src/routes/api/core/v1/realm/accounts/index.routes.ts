import * as accountController from '@/controllers/v1/account.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/accounts',
  });

  router.post('/', accountController.create);
  router.get('/search', accountController.findByEmail);
  router.get('/:id', accountController.findById);
  router.put('/:id', accountController.update);
  router.delete('/:id', accountController.remove);

  return router;
};
