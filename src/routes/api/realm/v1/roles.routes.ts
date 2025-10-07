import * as roleController from '@/controllers/v1/role.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/roles',
  });

  router.post('/', roleController.create);
  router.get('/search', roleController.findByName);
  router.get('/:id', roleController.findById);
  router.put('/:id', roleController.update);
  router.delete('/:id', roleController.remove);

  return router;
};