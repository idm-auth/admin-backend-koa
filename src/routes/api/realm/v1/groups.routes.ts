import * as groupController from '@/controllers/v1/group.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/groups',
  });

  router.post('/', groupController.create);
  router.get('/search', groupController.findByName);
  router.get('/:id', groupController.findById);
  router.put('/:id', groupController.update);
  router.delete('/:id', groupController.remove);

  return router;
};