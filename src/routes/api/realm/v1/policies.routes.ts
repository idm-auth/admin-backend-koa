import * as policyController from '@/controllers/v1/policy.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/policies',
  });

  router.post('/', policyController.create);
  router.get('/search', policyController.findByName);
  router.get('/:id', policyController.findById);
  router.put('/:id', policyController.update);
  router.delete('/:id', policyController.remove);

  return router;
};